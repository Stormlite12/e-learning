'use client'


import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EnrollCourseCard from './EnrollCourseCard';


function EnrollCourseList({course, enrollCourse}) {
 
    const [enrolledCourseList,setEnrolledCourseList]= useState([]);
    useEffect(()=>{
        GetEnrolledCourse();
    },[])

    const GetEnrolledCourse = async () => {
        const result = await axios.get('/api/enroll-course');
        console.log(result.data);
        setEnrolledCourseList(result.data);

    }
    return enrolledCourseList?.length>0 && (

        <div className='mt-3 '>
            <h2 className='font-bold text- xl'>Continue Learning Your Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledCourseList?.map((course,index)=>(
                <EnrollCourseCard course={course?.courses} enrollCourse={course?.enrollCourse}  key={index} className=''/>
            ))}
        </div>
            
        </div>
    )
}

export default EnrollCourseList