import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
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

        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Generate content
        const result = await model.generateContent(PROMPT + JSON.stringify(formData));
        const response = await result.response;
        const text = response.text();

        console.log('Raw response:', text);

        // Clean up the JSON response
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const JSONResp = JSON.parse(cleanedText);
        const ImagePrompt=JSONResp.course?.bannerImagePrompt;
        
        //generate banner image

        let bannerImageUrl = null;
        if (ImagePrompt) {
            try {
                const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
                
                const imageBlob = await hf.textToImage({
                    model: "stabilityai/stable-diffusion-xl-base-1.0",
                    inputs: ImagePrompt,
                });

                // Convert blob to base64 or upload to a storage service
                const imageBuffer = await imageBlob.arrayBuffer();
                const base64Image = Buffer.from(imageBuffer).toString('base64');
                bannerImageUrl = `data:image/png;base64,${base64Image}`;
                
            } catch (imageError) {
                console.error('Error generating banner image:', imageError);
                // Continue without image if generation fails
            }
        }

        // Save to database
        const dbResult = await db.insert(coursesTable).values({
            cid: courseId,
            name: formData.name, // This should not be null
            description: formData.courseDescription || null,
            noOfChapters: parseInt(formData.courseChapters) || 1,
            includeVideo: formData.includeVideo || false,
            level: formData.level,
            category: formData.category,
            courseJson: JSON.stringify(JSONResp),
            bannerImage: bannerImageUrl,
            userEmail: user?.primaryEmailAddress?.emailAddress,
        });

        return NextResponse.json({ courseId: courseId });

    } catch (error) {
        console.error('Error in generate-course-layout:', error);
        return NextResponse.json(
            { error: 'Failed to generate course layout', details: error.message },
            { status: 500 }
        );
    }
}