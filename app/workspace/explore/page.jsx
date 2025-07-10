'use client'

import CourseCard from '@/app/workspace/_components/CourseCard'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Filter, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs';
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    user && GetCourseList()
  }, [user])

  useEffect(() => {
    // If no search term, show all courses
    if (!searchTerm.trim()) {
      setFilteredCourses(courseList);
      return;
    }

    // Enhanced search that includes name, category, and tags
    const filtered = courseList.filter(course => {
      const searchLower = searchTerm.toLowerCase().trim();
      
      // Search in course name
      const nameMatch = course?.courseName?.toLowerCase().includes(searchLower);
      
      // Search in category
      const categoryMatch = course?.category?.toLowerCase().includes(searchLower);
      
      // Search in tags (handle both string and array formats)
      let tagsMatch = false;
      if (course?.tags) {
        if (Array.isArray(course.tags)) {
          tagsMatch = course.tags.some(tag => 
            tag?.toString().toLowerCase().includes(searchLower)
          );
        } else if (typeof course.tags === 'string') {
          tagsMatch = course.tags.toLowerCase().includes(searchLower);
        }
      }
      
      // Search in description if available
      const descriptionMatch = course?.description?.toLowerCase().includes(searchLower);
      
      // Search in course topics/chapters if available
      let topicsMatch = false;
      if (course?.courseJson?.course?.chapters) {
        topicsMatch = course.courseJson.course.chapters.some(chapter => {
          // Check chapter name
          const chapterNameMatch = chapter?.chapterName?.toLowerCase().includes(searchLower);
          
          // Check topics within chapter
          const chapterTopicsMatch = chapter?.topics?.some(topic => 
            topic?.toString().toLowerCase().includes(searchLower)
          );
          
          return chapterNameMatch || chapterTopicsMatch;
        });
      }
      
      return nameMatch || categoryMatch || tagsMatch || descriptionMatch || topicsMatch;
    });
    
    setFilteredCourses(filtered);
  }, [searchTerm, courseList]);

  const GetCourseList = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get('/api/courses?courseId=0');
      console.log('Course List:', result.data);
      const courses = Array.isArray(result.data) ? result.data : [];
      setCourseList(courses);
      // Initialize filtered courses to all courses
      setFilteredCourses(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourseList([]);
      setFilteredCourses([]);
    }
    setIsLoading(false);
  }

  // Debug function to see course structure
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debug: Log the first course to see its structure
    if (courseList.length > 0) {
      console.log('Sample course structure:', courseList[0]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-extrabold text-4xl text-gray-900 mb-4 flex items-center justify-center gap-3">
            <BookOpen className="text-primary" size={40} />
            Explore Courses
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover amazing courses created by our community. Search by name, category, tags, or topics.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder='Search by name, category, tags, or topics...' 
                className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filters
              </Button>
              <Button className="gap-2">
                <TrendingUp size={16} />
                Popular
              </Button>
            </div>
          </div>
          
          {/* Search Suggestions */}
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-500">
              <span className="font-medium">Searching in:</span> Course names, categories, tags, descriptions, and topics
            </div>
          )}
        </div>

        {/* Stats Section */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-gray-900">{filteredCourses.length}</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Matching Courses' : 'Available Courses'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-gray-900">{courseList.length}</h3>
                  <p className="text-gray-600">Total Courses</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Search className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-gray-900">AI-Powered</h3>
                  <p className="text-gray-600">Content Generation</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Grid Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-gray-900">
              {searchTerm ? `Search Results for "${searchTerm}" (${filteredCourses.length})` : 'All Courses'}
            </h2>
            {!isLoading && filteredCourses.length > 0 && (
              <span className="text-gray-500 text-sm">
                Showing {filteredCourses.length} of {courseList.length} course{courseList.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading
              ? [0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
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
              : filteredCourses.length > 0
                ? filteredCourses.map((course, index) => (
                    <CourseCard
                      course={course}
                      key={course.id || index}
                      className="hover:scale-105 transition-transform duration-200"
                    />
                  ))
                : (
                    <div className="col-span-full text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-gray-400" size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {searchTerm ? 'No courses found' : 'No courses available'}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {searchTerm 
                          ? `No courses match "${searchTerm}". Try searching for course names, categories, tags, or topics.`
                          : 'Check back later for new courses or create your own!'
                        }
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSearchTerm('')}
                          className="gap-2"
                        >
                          <Search size={16} />
                          Clear Search
                        </Button>
                      )}
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