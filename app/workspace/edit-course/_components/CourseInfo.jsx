import { Book, Clock, Settings, TrendingUp } from 'lucide-react';
import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function CourseInfo({course}) {
  
    const courseLayout=course?.courseJson?.course;
    const [loading,setLoading]=useState(false);
    const router=useRouter();

      const generateCourseContent = async () => {
        setLoading(true);
        try {
            // Generate content for ALL chapters at once
            const result = await axios.post('/api/generate-course-content', {
                courseJson:courseLayout,
                courseId: course.cid,
                courseName: courseLayout?.name,
                chapters: courseLayout?.chapters || []
            });
            
            console.log('Generated content:', result.data);
            toast.success("Course Generated Successfully!");
            // Handle success (maybe redirect to content view or show success message)
            

        } catch (error) {
            console.error('Error generating content:', error);
            toast.error("Server Side Error, Try Again!");
            // Handle error
        } finally {
            setLoading(false);
            router.replace('/workspace');
        }
    };


    return ( 
    <div className=' md:flex gap-5 justify-between p-5 rounded-2xl shadow'>
        <div className='flex flex-col gap-3'>
            <h2 className='font-bold text-3xl'>{courseLayout?.name}</h2>
            <p className='line-clamp-2 text-gray-500'>{courseLayout?.courseDescription}</p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
                    <Clock className='text-blue-500'/>
                    <section>
                        <h2 className='font-bold'>Duration</h2>
                        <h2>2 Hours</h2>
                    </section>
                </div>
                <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
                    <Book className='text-red-500'/>
                    <section>
                        <h2 className='font-bold'>Chapters</h2>
                        <h2>2 Hours</h2>
                    </section>
                </div>
                <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
                    <TrendingUp  className='text-green-500'/>
                    <section>
                        <h2 className='font-bold'>Difficulty</h2>
                        <h2>{courseLayout?.level}</h2>
                    </section>
                </div>
            </div>
           <Button 
                    className={'max-w-sm'} 
                    onClick={generateCourseContent}
                    disabled={loading}
                >
                    <Settings className="mr-2" />
                    {loading ? 'Generating...' : 'Generate Content'}
                </Button>
        </div>
        <Image src={course?.bannerImage} alt={'banner image'} width={400} height={400} 
        className='w-full h-[240px] rounded-2xl object-cover aspect-auto mt-5 md:mt-0 ' />
    </div>
  )
}

export default CourseInfo