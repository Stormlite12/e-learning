'use client'

import CourseCard from '@/app/workspace/_components/CourseCard'
import React, { useState,useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs';
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'

function explore() {
  const [courseList, setCourseList] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    user && GetCourseList()
  }, [user])

  const GetCourseList = async () => {
    const result = await axios.get('/api/courses?courseId=0');
    console.log(result.data);
    setCourseList(result.data);
  }

  return (
    <div>
      <h2>Explore more courses</h2>
      <div>
        <Input placeholder='Search' />
        <Button>
          <Search />Search
        </Button>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courseList.length>0?courseList?.map((course, index) => (
              <CourseCard
               course={course} key={course.id || index} />
            ))
             : [0,1,2,3].map((item,index)=>(
              <Skeleton className='w-full h-[240px]' key={index}/>
            ))}

          </div>


        </div>
      </div>
    </div>
  )
}

export default explore