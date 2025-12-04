import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import axios from 'axios';

export async function POST(req) {
    try {
        const PROMPT = `Generate HTML content based on a given chapter name and a list of topics. Return ONLY valid JSON (no markdown).

JSON Schema:
{
  "chapterName": "Chapter Title",
  "topics": [
    {
      "topic": "Topic Name",
      "content": "<p>Educational HTML content here...</p>"
    }
  ]
}

Requirements:
- Educational, detailed content
- Use HTML tags: <p>, <ul>, <li>, <strong>
- 2-3 paragraphs per topic
- Properly escape quotes in JSON

User Input:`;

        const { courseId, courseName, chapters } = await req.json();
        const user = await currentUser();

        console.log('\n========================================');
        console.log('🚀 CONTENT GENERATION STARTED');
        console.log('========================================');
        console.log('Course ID:', courseId);
        console.log('Course Name:', courseName);
        console.log('Total Chapters:', chapters?.length);

        // Check API Key
        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY is MISSING!');
            throw new Error('GEMINI_API_KEY not configured');
        }
        console.log('✅ GEMINI_API_KEY exists');

        // Initialize Model
        console.log('\n📦 Initializing Gemini AI...');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", // ✅ CHANGED: Gemini 2.5 Flash
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            }
        });
        console.log('✅ Model initialized: gemini-2.5-flash');

        // ❌ REMOVED: Connection test to save quota

        const batchSize = 1; // Process 1 chapter at a time
        const courseContent = [];
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < chapters.length; i += batchSize) {
            const batch = chapters.slice(i, i + batchSize);
            console.log(`\n========================================`);
            console.log(`📚 PROCESSING CHAPTER ${i + 1}/${chapters.length}`);
            console.log(`========================================`);
            
            const batchPromises = batch.map(async (chapter, index) => {
                const chapterName = chapter.chapterName || chapter.name;
                const topics = chapter.topics || [];

                console.log(`\n📖 Chapter: "${chapterName}"`);
                console.log(`📝 Topics (${topics.length}):`, topics);

                const userInput = {
                    chapterName: chapterName,
                    topics: topics
                };

                const startTime = Date.now();

                try {
                    console.log(`⏳ Starting generation...`);
                    
                    let aiResult = null;
                    let youtubeData = [];

                    // Generate AI content with retry logic
                    try {
                        console.log('   🤖 Calling Gemini 2.5 Flash...');
                        aiResult = await generateAIContentWithRetry(model, PROMPT, userInput, chapterName);
                        console.log(`   ✅ AI content generated (${Date.now() - startTime}ms)`);
                    } catch (aiError) {
                        console.error('   ❌ AI generation failed:', aiError.message);
                        throw new Error(`AI: ${aiError.message}`);
                    }

                    // Fetch YouTube videos (optional)
                    try {
                        console.log('   📺 Fetching YouTube videos...');
                        youtubeData = await GetYoutubeVideo(chapterName);
                        console.log(`   ✅ Videos fetched (${Date.now() - startTime}ms)`);
                    } catch (ytError) {
                        console.error('   ⚠️ YouTube failed (non-critical):', ytError.message);
                    }

                    const totalTime = Date.now() - startTime;
                    console.log(`✅ SUCCESS: "${chapterName}" (${totalTime}ms)`);
                    successCount++;

                    return {
                        youtubeVideo: youtubeData,
                        courseData: aiResult
                    };

                } catch (chapterError) {
                    const totalTime = Date.now() - startTime;
                    console.error(`\n❌ FAILED: "${chapterName}" (${totalTime}ms)`);
                    console.error(`   Error: ${chapterError.message}`);
                    failCount++;

                    return {
                        youtubeVideo: [],
                        courseData: {
                            chapterName: chapterName,
                            topics: topics.map(topic => ({
                                topic: topic,
                                content: `<div class="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                    <p class="text-red-700 font-semibold">❌ Generation Failed</p>
                                    <p class="text-sm text-red-600 mt-2"><strong>Error:</strong> ${chapterError.message}</p>
                                    <p class="text-sm text-red-600"><strong>Topic:</strong> ${topic}</p>
                                </div>`
                            }))
                        }
                    };
                }
            });

            const batchResults = await Promise.all(batchPromises);
            courseContent.push(...batchResults);
            
            // ✅ IMPORTANT: Longer delay between chapters to avoid rate limits
            if (i + batchSize < chapters.length) {
                console.log('\n⏸️ Waiting 5 seconds before next chapter (rate limit protection)...');
                await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds
            }
        }

        console.log('\n========================================');
        console.log('🏁 GENERATION COMPLETE');
        console.log('========================================');
        console.log(`✅ Success: ${successCount}/${chapters.length}`);
        console.log(`❌ Failed: ${failCount}/${chapters.length}`);

        // Save to database
        const dbResp = await db.update(coursesTable).set({
            courseContent: courseContent
        }).where(eq(coursesTable.cid, courseId));

        console.log('💾 Saved to database\n');

        return NextResponse.json({
            courseId: courseId,
            courseName: courseName,
            courseContent: courseContent,
            stats: {
                total: chapters.length,
                success: successCount,
                failed: failCount
            }
        });

    } catch (error) {
        console.error('\n💥 FATAL ERROR:', error.message);
        return NextResponse.json(
            { error: 'Failed to generate course content', details: error.message },
            { status: 500 }
        );
    }
}

// ✅ NEW: Generate AI content with automatic retry for rate limits
async function generateAIContentWithRetry(model, prompt, userInput, chapterName, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`      📤 Attempt ${attempt}/${maxRetries}...`);
            
            const result = await generateAIContent(model, prompt, userInput, chapterName);
            return result;
            
        } catch (error) {
            const isRateLimit = error.message.includes('429') || 
                              error.message.includes('quota') ||
                              error.message.includes('Too Many Requests');
            
            if (isRateLimit && attempt < maxRetries) {
                const waitTime = Math.pow(2, attempt) * 5000; // 5s, 10s, 20s
                console.log(`      ⏸️ Rate limit hit. Waiting ${waitTime/1000}s before retry ${attempt + 1}...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            
            throw error;
        }
    }
}

async function generateAIContent(model, prompt, userInput, chapterName) {
    const startTime = Date.now();
    
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
            reject(new Error(`Timeout after ${Date.now() - startTime}ms`));
        }, 120000) // 120 seconds
    );

    const generationPromise = (async () => {
        try {
            const fullPrompt = prompt + '\n\n' + JSON.stringify(userInput, null, 2);
            
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const rawResp = response.candidates[0].content.parts[0].text;
            
            console.log(`      📄 Response length: ${rawResp.length} chars`);
            
            // Clean JSON
            let rawJson = rawResp
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            
            const firstBrace = rawJson.indexOf('{');
            const lastBrace = rawJson.lastIndexOf('}');
            
            if (firstBrace >= 0 && lastBrace > firstBrace) {
                rawJson = rawJson.substring(firstBrace, lastBrace + 1);
            }
            
            try {
                const parsed = JSON.parse(rawJson);
                
                if (!parsed.chapterName || !parsed.topics || !Array.isArray(parsed.topics)) {
                    throw new Error('Invalid structure');
                }
                
                console.log(`      ✅ Parsed: ${parsed.topics.length} topics`);
                return parsed;
                
            } catch (parseError) {
                console.error(`      ❌ Parse failed: ${parseError.message}`);
                
                // Fallback content
                return {
                    chapterName: userInput.chapterName,
                    topics: userInput.topics.map(topic => ({
                        topic: topic,
                        content: `<p><strong>${topic}</strong> is covered in ${userInput.chapterName}.</p>
                                 <p>This topic includes fundamental concepts and practical applications.</p>
                                 <ul><li>Key principles</li><li>Real-world examples</li><li>Best practices</li></ul>`
                    }))
                };
            }
        } catch (genError) {
            console.error(`      ❌ Generation error: ${genError.message}`);
            throw genError;
        }
    })();

    return Promise.race([generationPromise, timeoutPromise]);
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const youtubeCache = new Map();

const GetYoutubeVideo = async (topic) => {
    try {
        const cacheKey = topic.toLowerCase().trim();
        if (youtubeCache.has(cacheKey)) {
            return youtubeCache.get(cacheKey);
        }

        const params = {
            part: 'snippet',
            q: topic + ' tutorial',
            maxResults: 2,
            type: 'video',
            order: 'relevance',
            key: process.env.YOUTUBE_API_KEY
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const resp = await axios.get(YOUTUBE_BASE_URL, { 
            params,
            signal: controller.signal,
            timeout: 8000
        });
        
        clearTimeout(timeoutId);

        const youtubeVideoList = resp.data.items.map(item => ({
            videoId: item.id?.videoId,
            title: item?.snippet?.title
        }));
        
        youtubeCache.set(cacheKey, youtubeVideoList);
        
        return youtubeVideoList;
    } catch (error) {
        console.error(`      ⚠️ YouTube error: ${error.message}`);
        return [];
    }
};