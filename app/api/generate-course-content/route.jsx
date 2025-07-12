import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import axios from 'axios';

export async function POST(req) {
    try {
        const PROMPT = `Generate HTML content based on a given chapter name and a list of topics. Return the response in JSON format using the schema below.

                        Requirements:
                        - Each topic should have its own HTML-formatted content.
                        - Content should be educational, detailed, and well-structured.
                        - Use proper HTML tags like <h3>, <p>, <ul>, <li>, <strong>, <em>, <code>, etc.
                        - Make content engaging and informative.
                        - IMPORTANT: Escape all quotes and special characters properly in JSON.
                        - Keep content concise but comprehensive (2-3 paragraphs per topic max).

                        JSON Schema:
                        {
                        "chapterName": "<Chapter Title>",
                        "topics": [
                            {
                            "topic": "<Topic Name>",
                            "content": "<HTML-formatted content>"
                            }
                        ]
                        }
                        User Input:
                        Provide the chapter name and an array of topics.`;

        const { courseId, courseName, chapters } = await req.json();
        const user = await currentUser();

        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp", // Use faster model
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048, // Limit output tokens for faster generation
            }
        });

        // Batch process chapters with concurrency limit
        const batchSize = 3; // Process 3 chapters at a time
        const courseContent = [];

        for (let i = 0; i < chapters.length; i += batchSize) {
            const batch = chapters.slice(i, i + batchSize);
            
            const batchPromises = batch.map(async (chapter, index) => {
                const userInput = {
                    chapterName: chapter.chapterName,
                    topics: chapter.topics
                };

                try {
                    // Start both AI generation and YouTube search in parallel
                    const [aiResult, youtubeData] = await Promise.all([
                        generateAIContent(model, PROMPT, userInput),
                        GetYoutubeVideo(chapter?.chapterName)
                    ]);

                    return {
                        youtubeVideo: youtubeData,
                        courseData: aiResult
                    };

                } catch (chapterError) {
                    console.error(`Error generating content for ${chapter.chapterName}:`, chapterError);
                    // Return fallback content for this chapter
                    return {
                        youtubeVideo: [],
                        courseData: {
                            chapterName: chapter.chapterName,
                            topics: chapter.topics.map(topic => ({
                                topic: topic,
                                content: `<h3>${topic}</h3><p>Content for ${topic} will be generated later.</p>`
                            }))
                        }
                    };
                }
            });

            const batchResults = await Promise.all(batchPromises);
            courseContent.push(...batchResults);
            
            // Optional: Add small delay between batches to avoid rate limiting
            if (i + batchSize < chapters.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Save to database
        const dbResp = await db.update(coursesTable).set({
            courseContent: courseContent
        }).where(eq(coursesTable.cid, courseId));

        return NextResponse.json({
            courseId: courseId,
            courseName: courseName,
            courseContent: courseContent
        });

    } catch (error) {
        console.error('Error in generate-course-content:', error);
        return NextResponse.json(
            { error: 'Failed to generate course content', details: error.message },
            { status: 500 }
        );
    }
}

// Separate function for AI content generation with timeout
async function generateAIContent(model, prompt, userInput) {
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI generation timeout')), 15000) // 15 second timeout
    );

    const generationPromise = (async () => {
        const result = await model.generateContent(prompt + JSON.stringify(userInput));
        const response = await result.response;
        
        const rawResp = response.candidates[0].content.parts[0].text;
        const rawJson = rawResp.replace(/```json/g, '').replace(/```/g, '').trim();
        
        try {
            return JSON.parse(rawJson);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Raw JSON:', rawJson);
            
            // Create fallback structure
            return {
                chapterName: userInput.chapterName,
                topics: userInput.topics.map(topic => ({
                    topic: topic,
                    content: `<h3>${topic}</h3><p>Content for ${topic} covers the fundamental concepts and practical applications.</p>`
                }))
            };
        }
    })();

    return Promise.race([generationPromise, timeoutPromise]);
}

// Optimized YouTube API call with caching
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const youtubeCache = new Map(); // Simple in-memory cache

const GetYoutubeVideo = async (topic) => {
    try {
        // Check cache first
        const cacheKey = topic.toLowerCase().trim();
        if (youtubeCache.has(cacheKey)) {
            return youtubeCache.get(cacheKey);
        }

        const params = {
            part: 'snippet',
            q: topic + ' tutorial', // Add 'tutorial' for better educational results
            maxResults: 2, // Reduced from 3 to 2 for faster response
            type: 'video',
            order: 'relevance',
            videoDefinition: 'high',
            videoDuration: 'medium', // Prefer medium-length videos
            key: process.env.YOUTUBE_API_KEY
        };

        // Set timeout for YouTube API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const resp = await axios.get(YOUTUBE_BASE_URL, { 
            params,
            signal: controller.signal,
            timeout: 5000
        });
        
        clearTimeout(timeoutId);

        const youtubeVideoList = resp.data.items.map(item => ({
            videoId: item.id?.videoId,
            title: item?.snippet?.title
        }));
        
        // Cache the result
        youtubeCache.set(cacheKey, youtubeVideoList);
        
        return youtubeVideoList;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
};