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
, User Input:`

export async function POST(req) {
    try {
        const { courseId, ...formData } = await req.json();
        const user = await currentUser();
        const {has} = await auth();
        const hasPremiumAccess = has({plan:'starter'})

        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // If user already created any course and is not premium, block further creation
        if (!hasPremiumAccess) {
            const result = await db.select().from(coursesTable)
                .where(eq(coursesTable.userEmail, user?.primaryEmailAddress.emailAddress));
            if (result?.length >= 1) {
                return NextResponse.json({ resp: 'limit exceed' });
            }
        }

        // Generate content
        const result = await model.generateContent(PROMPT + JSON.stringify(formData));
        const response = await result.response;
        const text = response.text();

        console.log('Raw response:', text);

        // Clean up the JSON response
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const JSONResp = JSON.parse(cleanedText);
        
        // Debug: Check if bannerImagePrompt exists
        console.log('Full JSON Response:', JSONResp);
        console.log('Banner Image Prompt:', JSONResp?.course?.bannerImagePrompt);
        
        const ImagePrompt = JSONResp?.course?.bannerImagePrompt;
        
        // Generate banner image with better error handling
        let bannerImageUrl = null;
        
        if (ImagePrompt && ImagePrompt.trim()) {
            console.log('Attempting to generate image with prompt:', ImagePrompt);
            
            try {
                // Check if HuggingFace API key exists
                if (!process.env.HUGGINGFACE_API_KEY) {
                    console.error('HUGGINGFACE_API_KEY not found in environment variables');
                    throw new Error('HuggingFace API key not configured');
                }
                
                const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
                
                // Use a more reliable model and add timeout
                const imageBlob = await Promise.race([
                    hf.textToImage({
                        model: "black-forest-labs/FLUX.1-schnell", // More reliable model
                        inputs: ImagePrompt.substring(0, 500), // Limit prompt length
                        parameters: {
                            width: 1024,
                            height: 576,
                            num_inference_steps: 4, // Faster generation
                        }
                    }),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Image generation timeout')), 30000)
                    )
                ]);

                if (imageBlob) {
                    console.log('Image blob received, converting to base64...');
                    
                    // Convert blob to base64
                    const imageBuffer = await imageBlob.arrayBuffer();
                    const base64Image = Buffer.from(imageBuffer).toString('base64');
                    bannerImageUrl = `data:image/png;base64,${base64Image}`;
                    
                    console.log('Banner image generated successfully');
                } else {
                    console.log('No image blob received');
                }
                
            } catch (imageError) {
                console.error('Error generating banner image:', imageError);
                
                // Fallback: Use a placeholder image or default banner
                bannerImageUrl = generatePlaceholderImage(formData.name || 'Course');
            }
        } else {
            console.log('No valid image prompt found');
            // Generate placeholder image
            bannerImageUrl = generatePlaceholderImage(formData.name || 'Course');
        }

        console.log('Final banner image URL:', bannerImageUrl ? 'Generated' : 'Null');

        // Save to database
        const dbResult = await db.insert(coursesTable).values({
            cid: courseId,
            name: formData.name,
            description: formData.courseDescription || null,
            noOfChapters: parseInt(formData.courseChapters) || 1,
            includeVideo: formData.includeVideo || false,
            level: formData.level,
            category: formData.category,
            courseJson: JSON.stringify(JSONResp),
            bannerImage: bannerImageUrl,
            userEmail: user?.primaryEmailAddress?.emailAddress,
        });

        return NextResponse.json({ 
            courseId: courseId,
            bannerGenerated: bannerImageUrl ? true : false
        });

    } catch (error) {
        console.error('Error in generate-course-layout:', error);
        return NextResponse.json(
            { error: 'Failed to generate course layout', details: error.message },
            { status: 500 }
        );
    }
}

// Fallback function to generate a placeholder image
function generatePlaceholderImage(courseName) {
    try {
        // Create a simple SVG placeholder
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
                    ${courseName.substring(0, 20)}
                </text>
            </svg>
        `;
        
        const base64Svg = Buffer.from(svg).toString('base64');
        return `data:image/svg+xml;base64,${base64Svg}`;
    } catch (error) {
        console.error('Error generating placeholder image:', error);
        return null;
    }
}