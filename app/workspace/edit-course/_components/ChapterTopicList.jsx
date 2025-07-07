import React from 'react';
import { Clock, BookOpen, Play, CheckCircle } from 'lucide-react';

function ChapterTopicList({ course }) {
    const courseLayout = course?.courseJson?.course;
    
    return (
        <div className='p-5'>
            <h2 className='font-bold text-3xl mt-10 mb-8'>Chapters & Topics</h2>
            
            {courseLayout?.chapters?.map((chapter, index) => (
                <div 
                    key={index} 
                    className='mb-8 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200'
                >
                    {/* Chapter Header */}
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold'>
                                {index + 1}
                            </div>
                            <div>
                                <h3 className='font-bold text-xl text-gray-800'>
                                    {chapter.chapterName}
                                </h3>
                                <div className='flex items-center gap-2 text-gray-500 mt-1'>
                                    <Clock className='w-4 h-4' />
                                    <span className='text-sm'>{chapter.duration}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Chapter Stats */}
                        <div className='flex items-center gap-4 text-sm text-gray-600'>
                            <div className='flex items-center gap-1'>
                                <BookOpen className='w-4 h-4' />
                                <span>{chapter.topics?.length || 0} topics</span>
                            </div>
                            {courseLayout?.includeVideo && (
                                <div className='flex items-center gap-1'>
                                    <Play className='w-4 h-4' />
                                    <span>Video</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Topics List */}
                    <div className='space-y-3'>
                        <h4 className='font-semibold text-gray-700 mb-3'>Topics Covered:</h4>
                        {chapter.topics?.map((topic, topicIndex) => (
                            <div 
                                key={topicIndex}
                                className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150'
                            >
                                <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
                                <div>
                                    <p className='text-gray-700 leading-relaxed'>
                                        {topic}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Chapter Progress (Optional) */}
                    <div className='mt-6 pt-4 border-t border-gray-100'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-500'>Progress</span>
                            <div className='flex items-center gap-2'>
                                <div className='w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                                    <div 
                                        className='h-full bg-blue-500 rounded-full transition-all duration-300'
                                        style={{ width: '0%' }} // You can make this dynamic
                                    />
                                </div>
                                <span className='text-sm text-gray-500'>0%</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Course Summary */}
            <div className='mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100'>
                <h3 className='font-bold text-lg mb-3 text-gray-800'>Course Summary</h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
                    <div className='p-4 bg-white rounded-lg shadow-sm'>
                        <div className='text-2xl font-bold text-blue-600'>
                            {courseLayout?.chapters?.length || 0}
                        </div>
                        <div className='text-sm text-gray-600'>Total Chapters</div>
                    </div>
                    <div className='p-4 bg-white rounded-lg shadow-sm'>
                        <div className='text-2xl font-bold text-green-600'>
                            {courseLayout?.chapters?.reduce((total, chapter) => total + (chapter.topics?.length || 0), 0)}
                        </div>
                        <div className='text-sm text-gray-600'>Total Topics</div>
                    </div>
                    <div className='p-4 bg-white rounded-lg shadow-sm'>
                        <div className='text-2xl font-bold text-purple-600'>
                            {courseLayout?.level}
                        </div>
                        <div className='text-sm text-gray-600'>Difficulty Level</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChapterTopicList;