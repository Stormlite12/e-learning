import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { HfInference } from '@huggingface/inference';

const PROMPT = `Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, , Topic under each chapters , Duration for each chapters etc, in JSON format only
Schema:
{
"course": {
"name": "string",
"courseDescription": "string",
"category": "string",
"level": "string",
"includeVideo": "boolean", 
"noOfChapters": "number",
"bannerImagePrompt": "string",
"chapters": [
{
"chapterName": "string",
"duration": "string",
    "topics": [
    "string"]
    }]}
}
, User Input:`;

// ✅ ADDED: Generate unique ID function
function generateUniqueId() {
    return `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(req) {
    try {
        const { courseId, ...formData } = await req.json();
        const user = await currentUser();
        const {has} = await auth();
        const hasPremiumAccess = has({plan:'starter'});

        console.log('📝 Form Data:', formData);

        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096, // ✅ INCREASED: More tokens for complete response
            }
        });

        // If user already created any course and is not premium, block further creation
        if (!hasPremiumAccess) {
            const result = await db.select().from(coursesTable)
                .where(eq(coursesTable.userEmail, user?.primaryEmailAddress.emailAddress));
            if (result?.length >= 1) {
                return NextResponse.json({ resp: 'limit exceed' });
            }
        }

        // Generate content
        console.log('🤖 Generating course layout...');
        const result = await model.generateContent(PROMPT + JSON.stringify(formData));
        const response = await result.response;
        const text = response.text();

        console.log('📄 Raw response length:', text.length);
        console.log('📄 Raw response preview:', text.substring(0, 200));

        // ✅ IMPROVED: Better JSON extraction
        let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Extract JSON between first { and last }
        const firstBrace = cleanedText.indexOf('{');
        const lastBrace = cleanedText.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error('No valid JSON found in response');
        }
        
        cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
        console.log('🧹 Cleaned JSON length:', cleanedText.length);

        let JSONResp;
        try {
            JSONResp = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError.message);
            console.error('📄 Failed JSON:', cleanedText.substring(0, 500));
            throw new Error(`Failed to parse AI response: ${parseError.message}`);
        }
        
        console.log('✅ JSON parsed successfully');
        console.log('📚 Course Name:', JSONResp?.course?.name);
        console.log('📑 Chapters:', JSONResp?.course?.chapters?.length);
        
        const ImagePrompt = JSONResp?.course?.bannerImagePrompt;
        
        // Generate banner image with better error handling
        let bannerImageUrl = null;
        
        if (ImagePrompt && ImagePrompt.trim()) {
            console.log('🎨 Generating banner image...');
            
            try {
                if (!process.env.HUGGINGFACE_API_KEY) {
                    console.error('❌ HUGGINGFACE_API_KEY not found');
                    throw new Error('HuggingFace API key not configured');
                }
                
                const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
                
                const imageBlob = await hf.textToImage({
                    model: "black-forest-labs/FLUX.1-schnell",
                    inputs: ImagePrompt.substring(0, 500),
                    parameters: {
                        width: 1024,
                        height: 576,
                        num_inference_steps: 4,
                    }
                });

                const imageBuffer = await imageBlob.arrayBuffer();
                const base64Image = Buffer.from(imageBuffer).toString('base64');
                bannerImageUrl = `data:image/png;base64,${base64Image}`;
                console.log('✅ Banner image generated');
                
            } catch (imageError) {
                console.error('⚠️ Banner generation failed:', imageError.message);
            }
        }

        // ✅ FIXED: Correct variable mapping from JSONResp
        const courseData = JSONResp.course;
        const newCourseId = courseId || generateUniqueId();

        console.log('💾 Saving to database...');
        
        const dbResult = await db.insert(coursesTable).values({
            cid: newCourseId,
            name: courseData.name,
            description: courseData.courseDescription,
            noOfChapters: courseData.noOfChapters,
            level: courseData.level,
            category: courseData.category,
            includeVideo: courseData.includeVideo,
            courseJson: JSONResp, // Store the full response
            bannerImage: bannerImageUrl,
            userEmail: user.primaryEmailAddress.emailAddress
        }).returning({ cid: coursesTable.cid });

        console.log('✅ Course saved successfully');

        return NextResponse.json({ 
            courseId: dbResult[0].cid,
            courseLayout: JSONResp,
            bannerGenerated: bannerImageUrl ? true : false
        });

    } catch (error) {
        console.error('❌ Error in generate-course-layout:', error);
        return NextResponse.json(
            { error: 'Failed to generate course layout', details: error.message },
            { status: 500 }
        );
    }
}

// Fallback function to generate a placeholder image
function generatePlaceholderImage(courseName) {
    try {
        const svg = `
            <svg width="1024" height="576" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad1)"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
                      text-anchor="middle" dy=".3em" fill="white">
                    ${courseName.substring(0, 30)}
                </text>
            </svg>
        `;
        
        const base64Svg = Buffer.from(svg).toString('base64');
        return `data:image/svg+xml;base64,${base64Svg}`;
    } catch (error) {
        console.error('❌ Placeholder generation failed:', error);
        return null;
    }
}