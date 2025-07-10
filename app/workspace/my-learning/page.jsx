'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import EnrollCourseCard from '@/app/workspace/_components/EnrollCourseCard'
import { Skeleton } from '@/components/ui/skeleton'

function MyLearning() {
  const [enrolledCourseList, setEnrolledCourseList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const GetEnrolledCourse = async () => {
      setIsLoading(true)
      const result = await axios.get('/api/enroll-course')
      setEnrolledCourseList(result.data)
      setIsLoading(false)
    }
    GetEnrolledCourse()
  }, [])

  return (
    <div className="mt-6 px-4 md:px-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-extrabold text-3xl text-primary tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-8 bg-primary rounded-full mr-2"></span>
          Continue Learning
        </h2>
        <span className="text-gray-400 text-base">
          {isLoading ? '' : `${enrolledCourseList.length} course${enrolledCourseList.length !== 1 ? 's' : ''}`}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading
          ? [1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm overflow-hidden animate-pulse"
              >
                <Skeleton className="h-44 w-full rounded-t-2xl" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-7 w-3/4 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                  <div className="flex justify-between items-center mt-6">
                    <Skeleton className="h-9 w-28 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          : enrolledCourseList?.map((course, index) => (
              <EnrollCourseCard
                course={course?.courses}
                enrollCourse={course?.enrollCourse}
                key={index}
                className="rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-shadow duration-200"
              />
            ))}
      </div>
      {!isLoading && enrolledCourseList.length === 0 && (
        <div className="text-center text-gray-400 py-16 col-span-4">
          <div className="inline-flex flex-col items-center">
            <svg width="48" height="48" fill="none" className="mb-4 text-primary" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
            </svg>
            <span className="text-lg font-semibold">No enrolled courses found.</span>
            <span className="text-gray-400 mt-2">Browse courses and start learning today!</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyLearning