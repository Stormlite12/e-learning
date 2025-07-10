'use client'

import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../_components/ChapterTopicList';

function EditCourse({viewCourse=false}) {
    const {courseId} = useParams();
    const [loading,setLoading] = useState(false);
    const [course,setCourse] = useState();
    const [enrollCourse, setEnrollCourse] = useState(); // Add this state

    useEffect(()=>{
        GetCourseInfo();
        if(viewCourse) {
            GetEnrollCourseInfo(); // Add this function call
        }
    },[])

    const GetCourseInfo = async() =>{
        setLoading(true);
        const result = await axios.get('/api/courses?courseId='+courseId);
        console.log(result.data);
        setLoading(false);
        setCourse(result.data);
    }

    // Add this function to get enrollment data
    const GetEnrollCourseInfo = async() => {
        try {
            const result = await axios.get('/api/enroll-course?courseId='+courseId);
            setEnrollCourse(result.data);
        } catch (error) {
            console.log('No enrollment data found');
        }
    }

    return (
        <div>
            <CourseInfo course={course} viewCourse={viewCourse}/>
            <ChapterTopicList course={course} enrollCourse={enrollCourse}/>
        </div>
    )
}

export default EditCourse