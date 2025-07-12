'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddNewCourseDialog from "./AddNewCourseDialog";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import CourseCard from "./CourseCard";

function CourseList() {
    const [courseList, setCourseList] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);

    const { user } = useUser();

    useEffect(() => {
        user && GetCourseList()
    }, [user])

    const GetCourseList = async () => {
        const result = await axios.get('/api/courses');
        console.log(result.data);
        setCourseList(result.data);
    }

    const GetAvailableCourses = async () => {
        setIsLoading(true);
        try {
            const allCoursesResult = await axios.get('/api/courses?courseId=0');
            const allCourses = allCoursesResult.data || [];
            console.log('All courses:', allCourses);

            const enrolledResult = await axios.get('/api/enroll-course');
            console.log('Enrolled courses:', enrolledResult.data);
            // Use 'cid' for both
            const enrolledCourseIds = enrolledResult.data.map(
                enrolled => String(enrolled.courses.cid).trim()
            );

            const notEnrolledCourses = allCourses.filter(
                course => !enrolledCourseIds.includes(String(course.cid).trim())
            );

            setAvailableCourses(notEnrolledCourses);
            console.error('Error fetching courses:', error);
            setAvaila
        } catch (error) {
            bleCourses([]);
        }
        setIsLoading(false);
    }

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-3xl">Course List</h2>
            </div>

            {availableCourses?.length == 0 ?
                <div className="flex p-10 items-center justify-center flex-col border-2 border-dashed border-gray-300 rounded-xl mt-5 bg-gray-50">
                    <Image src={'/education.png'} alt='Online Education' width={120} height={120} />
                    <h2 className="my-4 text-xl font-bold text-gray-700 text-center">
                        Look like you haven't created any courses yet.
                    </h2>
                    <p className="text-gray-500 text-center mb-6 max-w-md">
                        Start your teaching journey by creating your first course. Share your knowledge with the world!
                    </p>
                    <AddNewCourseDialog>
                        <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                            + Create your first course
                        </Button>
                    </AddNewCourseDialog>
                </div>
                :
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courseList?.map((course, index) => (
                        <CourseCard course={course} key={course.id || index} />
                    ))}
                    {/* Add New Course Card */}
                    <AddNewCourseDialog>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center min-h-[280px] bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl text-blue-600 font-bold">+</span>
                            </div>
                            <h3 className="font-semibold text-gray-700 mb-2">Create New Course</h3>
                            <p className="text-gray-500 text-sm text-center">
                                Start building your next course
                            </p>
                        </div>
                    </AddNewCourseDialog>
                </div>
            }
        </div>
    );
}

export default CourseList;