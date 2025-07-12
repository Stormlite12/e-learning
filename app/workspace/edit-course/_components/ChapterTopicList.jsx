import React from 'react';
import { Clock, BookOpen, Play, CheckCircle } from 'lucide-react';


function ChapterTopicList({ course, enrollCourse }) {
    const courseLayout = course?.courseJson?.course;
    
    // Calculate overall course progress
    const CalculateOverallProgress = () => {
        if (!enrollCourse?.completedChapters || !course?.courseContent?.length) {
            return 0;
        }
        return Math.round((enrollCourse.completedChapters.length / course.courseContent.length) * 100);
    }

    // Calculate individual chapter progress
    const CalculateChapterProgress = (chapterIndex) => {
        if (!enrollCourse?.completedChapters) {
            return 0;
        }
        // Check if this specific chapter is completed
        const isChapterCompleted = enrollCourse.completedChapters.includes(chapterIndex);
        return isChapterCompleted ? 100 : 0;
    }

    return (
        <div className='p-5'>
            <h2 className='font-bold text-3xl mt-10 mb-8'>Chapters & Topics</h2>
            
            {courseLayout?.chapters?.map((chapter, index) => {
                const chapterProgress = CalculateChapterProgress(index);
                const isCompleted = chapterProgress === 100;
                
                return (
                    <div 
                        key={index} 
                        className={`mb-8 border rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200 ${
                            isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'
                        }`}
                    >
                        {/* Chapter Header */}
                        <div className='flex items-center justify-between mb-6'>
                            <div className='flex items-center gap-4'>
                                <div className={`w-10 h-10 text-white rounded-full flex items-center justify-center font-bold ${
                                    isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}>
                                    {isCompleted ? <CheckCircle className='w-6 h-6' /> : index + 1}
                                </div>
                                <div>
                                    <h3 className='font-bold text-xl text-gray-800'>
                                        {chapter.chapterName}
                                        {isCompleted && (
                                            <span className='ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
                                                Completed
                                            </span>
                                        )}
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
                                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors duration-150 ${
                                        isCompleted 
                                            ? 'bg-green-100 hover:bg-green-200' 
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <BookOpen className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                        isCompleted ? 'text-green-600' : 'text-green-500'
                                    }`} />
                                    <div>
                                        <p className={`leading-relaxed ${
                                            isCompleted ? 'text-green-800' : 'text-gray-700'
                                        }`}>
                                            {topic}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Dynamic Chapter Progress */}
                        <div className='mt-6 pt-4 border-t border-gray-100'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-500'>Progress</span>
                                <div className='flex items-center gap-2'>
                                    <div className='w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                                        <div 
                                            className={`h-full rounded-full transition-all duration-300 ${
                                                isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${chapterProgress}%` }}
                                        />
                                    </div>
                                    <span className={`text-sm font-medium ${
                                        isCompleted ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                        {chapterProgress}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            
            {/* Dynamic Course Summary */}
            <div className='mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100'>
                <h3 className='font-bold text-lg mb-3 text-gray-800'>Course Summary</h3>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-center'>
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
                    <div className='p-4 bg-white rounded-lg shadow-sm'>
                        <div className='text-2xl font-bold text-orange-600'>
                            {CalculateOverallProgress()}%
                        </div>
                        <div className='text-sm text-gray-600'>Overall Progress</div>
                    </div>
                </div>
                
                {/* Overall Progress Bar */}
                <div className='mt-6 p-4 bg-white rounded-lg shadow-sm'>
                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-gray-700'>Course Progress</span>
                        <span className='text-sm font-bold text-blue-600'>{CalculateOverallProgress()}%</span>
                    </div>
                    <div className='w-full h-3 bg-gray-200 rounded-full overflow-hidden'>
                        <div 
                            className='h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500'
                            style={{ width: `${CalculateOverallProgress()}%` }}
                        />
                    </div>
                    <div className='mt-2 text-xs text-gray-500'>
                        {enrollCourse?.completedChapters?.length || 0} of {course?.courseContent?.length || 0} chapters completed
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChapterTopicList;