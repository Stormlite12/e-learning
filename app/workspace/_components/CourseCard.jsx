import React from 'react';
import Image from 'next/image';
import { Book, Clock, TrendingUp, Play, Users, Settings, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';

function CourseCard({ course }) {
    const router = useRouter();
    const [loading,setLoading] = useState(false);
    const courseLayout = course?.courseJson?.course;

    const handleViewCourse = () => {
        router.push(`/workspace/edit-course/${course.cid}`);
    };

    // const handleStartLearning = () => {
    //     // Navigate to learning/viewing page when content exists
    //     router.push(`/workspace/edit-course/${course.cid}`);
    // };


    const onEnrollCourse=async()=>{
        try{ setLoading(true);

        const result = await axios.post('/api/enroll-course',{
            courseId:course?.cid
        })
        console.log(result.data);
        if(result.data.resp){
            toast.warning('Already Enrolled');
        }

        setLoading(false);
        }
        catch (e){
            toast.error('server side error');
            setLoading(false);
        }
    }

    return (
        <div className='border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group h-full flex flex-col'>
            {/* Banner Image */}
            <div className='relative h-44 w-full overflow-hidden flex-shrink-0'>
                {course?.bannerImage ? (
                    <Image 
                        src={course.bannerImage} 
                        alt={courseLayout?.name || 'Course banner'} 
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                ) : (
                    <div className='w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                        <Book className='w-12 h-12 text-white opacity-70' />
                    </div>
                )}
                
                {/* Course Level Badge */}
                <div className='absolute top-2 left-2'>
                    <span className='bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700'>
                        {courseLayout?.level || course.level}
                    </span>
                </div>
                
                {/* Video Indicator */}
                {courseLayout?.includeVideo && (
                    <div className='absolute top-2 right-2'>
                        <div className='bg-red-500 text-white p-1 rounded-full'>
                            <Play className='w-3 h-3' />
                        </div>
                    </div>
                )}

                {/* Content Status Badge */}
                <div className='absolute bottom-2 right-2'>
                    {course.courseContent ? (
                        <span className='bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold'>
                            Ready
                        </span>
                    ) : (
                        <span className='bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold'>
                            Draft
                        </span>
                    )}
                </div>
            </div>

            {/* Card Content - Flex grow to fill remaining space */}
            <div className='p-4 flex flex-col flex-grow'>
                {/* Course Category */}
                <div className='mb-2'>
                    <span className='text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md'>
                        {courseLayout?.category || course.category}
                    </span>
                </div>

                {/* Course Title */}
                <h3 className='font-bold text-lg text-gray-800 mb-2 line-clamp-2 leading-tight'>
                    {courseLayout?.name || course.name}
                </h3>

                {/* Course Description */}
                <p className='text-gray-600 text-sm mb-3 line-clamp-2 flex-grow'>
                    {courseLayout?.courseDescription || course.description || 'No description available'}
                </p>

                {/* Course Stats */}
                <div className='grid grid-cols-2 gap-2 mb-3 text-xs'>
                    <div className='flex items-center gap-1 text-gray-600'>
                        <Book className='w-3 h-3' />
                        <span>{courseLayout?.noOfChapters || course.noOfChapters || 0} chapters</span>
                    </div>
                    <div className='flex items-center gap-1 text-gray-600'>
                        <Clock className='w-3 h-3' />
                        <span>2-4 hours</span>
                    </div>
                </div>

                {/* Progress Bar (only if course content exists) */}
                {/* {course.courseContent && (
                    <div className='mb-3'>
                        <div className='flex items-center justify-between mb-1'>
                            <span className='text-xs text-gray-500'>Progress</span>
                            <span className='text-xs text-gray-500'>0%</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-1.5'>
                            <div className='bg-blue-500 h-1.5 rounded-full' style={{ width: '0%' }}></div>
                        </div>
                    </div>
                )} */}

                {/* Action Button - Conditional based on content status */}
                {course.courseContent?.length?(
                    <Button 
                        onClick={onEnrollCourse}
                        className='w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 text-sm mt-auto'
                        disabled ={loading}
                    >
                        <Play className="mr-2 w-4 h-4" />
                        Enroll
                    </Button>
                ) : (
                    <Button 
                        onClick={handleViewCourse}
                        className='w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 text-sm mt-auto'
                        variant="outline"
                    >{loading?<LoaderCircle className='animate-spin' />:
                        <Settings className="mr-2 w-4 h-4" />}
                        Generate Content
                    </Button>
                )}
            </div>

            {/* Footer */}
            <div className='px-4 pb-3 pt-2 border-t border-gray-100 bg-gray-50 flex-shrink-0'>
                <div className='flex items-center justify-between text-xs text-gray-500'>
                    <span>Created recently</span>
                    <div className='flex items-center gap-1'>
                        <Users className='w-3 h-3' />
                        <span>{course.courseContent?.length? 'Ready to learn' : 'In progress'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseCard;