'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EnrollCourseCard from './EnrollCourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

function EnrollCourseList({course, enrollCourse}) {
 
    const [enrolledCourseList, setEnrolledCourseList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetEnrolledCourse();
    }, [])

    const GetEnrolledCourse = async () => {
        setLoading(true);
        try {
            const result = await axios.get('/api/enroll-course');
            console.log(result.data);
            setEnrolledCourseList(result.data);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        } finally {
            setLoading(false);
        }
    }

    // Loading skeleton
    if (loading) {
        return (
            <div className='mt-3'>
                <Skeleton className="h-8 w-80 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border rounded-xl overflow-hidden animate-pulse">
                            <Skeleton className="h-48 w-full" />
                            <div className="p-4">
                                <Skeleton className="h-6 w-3/4 mb-3" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6 mb-4" />
                                <Skeleton className="h-2 w-full rounded-full mb-3" />
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-9 w-32" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (enrolledCourseList?.length === 0) {
        return (
            <div className='mt-3'>
                <h2 className='font-bold text-xl mb-6'>Continue Learning Your Courses</h2>
                <div className="border-2 border-dashed rounded-xl p-12 text-center">
                    <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-lg font-semibold mb-2">No enrolled courses yet</h3>
                    <p className="text-gray-600">Start learning by enrolling in a course</p>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-3'>
            <h2 className='font-bold text-xl mb-6'>Continue Learning Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {enrolledCourseList?.map((course, index) => (
                    <EnrollCourseCard 
                        course={course?.courses} 
                        enrollCourse={course?.enrollCourse}  
                        key={index} 
                    />
                ))}
            </div>
        </div>
    )
}

export default EnrollCourseList