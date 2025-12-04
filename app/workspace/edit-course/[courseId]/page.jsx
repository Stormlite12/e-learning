'use client'

import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../_components/ChapterTopicList';
import { Skeleton } from '@/components/ui/skeleton';

function EditCourse({viewCourse=false}) {
    const {courseId} = useParams();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState();
    const [enrollCourse, setEnrollCourse] = useState();

    useEffect(() => {
        GetCourseInfo();
        if(viewCourse) {
            GetEnrollCourseInfo();
        }
    }, [])

    const GetCourseInfo = async() => {
        setLoading(true);
        try {
            const result = await axios.get('/api/courses?courseId='+courseId);
            console.log(result.data);
            setCourse(result.data);
        } catch (error) {
            console.error('Error loading course:', error);
        } finally {
            setLoading(false);
        }
    }

    const GetEnrollCourseInfo = async() => {
        try {
            const result = await axios.get('/api/enroll-course?courseId='+courseId);
            setEnrollCourse(result.data);
        } catch (error) {
            console.log('No enrollment data found');
        }
    }

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex-1">
                        <Skeleton className="h-10 w-48 mb-3" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                    {!viewCourse && <Skeleton className="h-10 w-32" />}
                </div>

                {/* Course Banner Skeleton */}
                <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />

                {/* Course Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border rounded-xl p-6">
                            <Skeleton className="h-12 w-12 rounded-full mb-4" />
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    ))}
                </div>

                {/* Course Description */}
                <div className="mb-8">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Chapters List */}
                <div className="space-y-4">
                    <Skeleton className="h-8 w-64 mb-6" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="border rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <Skeleton className="h-6 w-3/4 mb-3" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                                {!viewCourse && <Skeleton className="h-10 w-24 ml-4" />}
                            </div>
                            
                            {/* Chapter Topics */}
                            <div className="mt-4 space-y-2 pl-4 border-l-2 border-gray-200">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-3/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <CourseInfo course={course} viewCourse={viewCourse}/>
            <ChapterTopicList course={course} enrollCourse={enrollCourse}/>
        </div>
    )
}

export default EditCourse