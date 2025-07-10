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

                        Each topic should have its own HTML-formatted content.
                        Content should be educational, detailed, and well-structured.
                        Use proper HTML tags like <h3>, <p>, <ul>, <li>, <strong>, <em>, <code>, etc.
                        Make content engaging and informative.
                        IMPORTANT: Escape all quotes and special characters properly in JSON.

                        The response must strictly follow the provided JSON structure.

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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Generate content for all chapters
        const promises = chapters.map(async (chapter) => {
            const userInput = {
                chapterName: chapter.chapterName,
                topics: chapter.topics
            };

            try {
                const result = await model.generateContent(PROMPT + JSON.stringify(userInput));
                const response = await result.response;
                
                console.log(response.candidates[0].content.parts[0].text);
                
                const rawResp = response.candidates[0].content.parts[0].text;
                const rawJson = rawResp.replace(/```json/g, '').replace(/```/g, '');
                
                let JSONResp;
                try {
                    JSONResp = JSON.parse(rawJson);
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    console.error('Raw JSON:', rawJson);
                    
                    // Create fallback structure
                    JSONResp = {
                        chapterName: chapter.chapterName,
                        topics: chapter.topics.map(topic => ({
                            topic: topic,
                            content: `<h3>${topic}</h3><p>Content for ${topic} will be generated.</p>`
                        }))
                    };
                }

                const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
                
                console.log({
                    youtubeVideo: youtubeData,
                    courseData: JSONResp
                });
                 
                return {
                    youtubeVideo: youtubeData,
                    courseData: JSONResp
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
                            content: `<h3>${topic}</h3><p>Content for ${topic} will be generated.</p>`
                        }))
                    }
                };
            }
        });

        const courseContent = await Promise.all(promises);

        //save to db
        const dbResp = await db.update(coursesTable).set({
            courseContent:courseContent
        }).where(eq(coursesTable.cid,courseId));

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

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const GetYoutubeVideo = async (topic) => {
    try {
        const params = {
            part: 'snippet',
            q: topic,
            maxResults: 3,
            type: 'video',
            key: process.env.YOUTUBE_API_KEY
        };

        const resp = await axios.get(YOUTUBE_BASE_URL, { params });
        const youtubeVideoListResp = resp.data.items;
        const youtubeVideoList = [];
        
        youtubeVideoListResp.forEach(item => {
            const data = {
                videoId: item.id?.videoId,
                title: item?.snippet?.title
            };
            youtubeVideoList.push(data);
        });
        
        console.log("youtubeVideoList", youtubeVideoList);
        return youtubeVideoList;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
};