'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen } from 'lucide-react'
import { useUser } from '@clerk/nextjs';
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import CourseCard from '@/app/workspace/_components/CourseCard'

function Explore() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      GetAvailableCourses();
    }
  }, [user])

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
  } catch (error) {
    console.error('Error fetching courses:', error);
    setAvailableCourses([]);
  }
  setIsLoading(false);
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="font-extrabold text-4xl text-gray-900 mb-4 flex items-center justify-center gap-3">
            <BookOpen className="text-primary" size={40} />
            Explore New Courses
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover courses you haven't enrolled in yet.
          </p>
        </div>

        {/* Stats Section */}
        {!isLoading && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 max-w-md mx-auto">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-3xl text-gray-900">{availableCourses.length}</h3>
                <p className="text-gray-600">Available Course{availableCourses.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        )}

        {/* Available Courses Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-gray-900">
              Courses to Explore
            </h2>
            {!isLoading && availableCourses.length > 0 && (
              <span className="text-gray-500 text-sm">
                {availableCourses.length} course{availableCourses.length !== 1 ? 's' : ''} available
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading
              ? [0, 1, 2, 3, 4].map((item) => (
                  <div key={item} className="rounded-2xl border border-gray-200 overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between items-center mt-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))
              : availableCourses.length > 0
                ? availableCourses.map((course, index) => (
                    <CourseCard
                      course={course}
                      key={course.cid || index}
                      onEnrollSuccess={GetAvailableCourses} // Refresh list after enrollment
                    />
                  ))
                : (
                    <div className="col-span-full text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-gray-400" size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        All courses enrolled!
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Great job! You've enrolled in all available courses. Check back later for new ones.
                      </p>
                    </div>
                  )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore