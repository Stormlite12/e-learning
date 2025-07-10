'use client'

import React, { useEffect, useState } from 'react'
import AppHeader from '../../workspace/_components/AppHeader'
import ChapterListSidebar from '../_components/ChapterListSidebar'
import ChapterContent from '../_components/ChapterContent'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
function Course() {

    const {courseId}= useParams();
    const [courseInfo,setCourseInfo]=useState();

     useEffect(()=>{
        GetEnrolledCourseById();
    },[])

    const GetEnrolledCourseById  = async () => {
        const result = await axios.get('/api/enroll-course?courseId='+courseId);
        console.log(result.data);
        setCourseInfo(result.data);

    }
  return (
    <div className='min-h-screen'>
        
        <AppHeader hideSidebar={true}/>
        <div className='flex h-[calc(100vh-64px)]'>
          <div className='w-90 flex-shrink-0'>
             <ChapterListSidebar courseInfo={courseInfo}/>
          </div>
           <div className='flex-1 overflow-auto'> 
             <ChapterContent courseInfo={courseInfo} refreshData={()=>GetEnrolledCourseById()}/>
           </div>
           
        </div>
    </div>
  )
}

export default Course