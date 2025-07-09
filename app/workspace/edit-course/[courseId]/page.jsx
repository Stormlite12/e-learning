'use client'

import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useState } from 'react';
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../_components/ChapterTopicList';
import { view } from 'drizzle-orm/sqlite-core';


function EditCourse({viewCourse=false}) {
    const {courseId} = useParams();
    const [loading,setLoading] = useState(false);
    const [course,setCourse] = useState();
    console.log(courseId);
 
    useEffect(()=>{
        GetCourseInfo();
    },[])

    const GetCourseInfo = async() =>{
        setLoading(true);
        const result = await axios.get('/api/courses?courseId='+courseId);
        console.log(result.data);
        setLoading(false);
        setCourse(result.data);

    }
  return (
    <div>
      <CourseInfo course={course} viewCourse={viewCourse}/>
      <ChapterTopicList course={course}/>
    </div>
  )
}

export default EditCourse