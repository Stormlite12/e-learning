
'use client'
import React, { Suspense } from 'react'
import EditCourse from '../../edit-course/[courseId]/page'
import { Skeleton } from '@/components/ui/skeleton'

function ViewCourseLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Course Info Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Skeleton className="h-64 w-full rounded-xl mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>

      {/* Chapters Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-xl p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewCourse() {
  return ( 
    <div>
      <Suspense fallback={<ViewCourseLoading />}>
        <EditCourse viewCourse={true}/>
      </Suspense>
    </div>
  )
}

export default ViewCourse