'use client'

import React, { useEffect, useState } from 'react'
import AppHeader from '../../workspace/_components/AppHeader'
import ChapterListSidebar from '../_components/ChapterListSidebar'
import ChapterContent from '../_components/ChapterContent'
import { useParams } from 'next/navigation'
import axios from 'axios'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

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
        
        {/* Back to Workspace Button */}
        <div className='px-4 py-2 border-b bg-white'>
          <Link href="/workspace">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Workspace
            </Button>
          </Link>
        </div>
        
        <div className='flex h-[calc(100vh-112px)]'> {/* Adjusted height for button bar */}
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