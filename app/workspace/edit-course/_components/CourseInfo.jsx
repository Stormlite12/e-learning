import { Book, Clock, PlayCircle, Settings, TrendingUp, Loader2, CheckCircle } from 'lucide-react';
import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

function CourseInfo({course,viewCourse}) {
  
    const courseLayout=course?.courseJson?.course;
    const [loading,setLoading]=useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState('');
    const router=useRouter();

    const generateCourseContent = async () => {
        setLoading(true);
        setProgress(0);
        
        try {
            // Simulate progress steps
            setCurrentStep('Initializing AI models...');
            setProgress(10);
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setCurrentStep('Generating course content...');
            setProgress(30);
            
            // Generate content for ALL chapters at once
            const result = await axios.post('/api/generate-course-content', {
                courseJson:courseLayout,
                courseId: course.cid,
                courseName: courseLayout?.name,
                chapters: courseLayout?.chapters || []
            });
            
            setProgress(70);
            setCurrentStep('Processing videos and resources...');
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setProgress(90);
            setCurrentStep('Finalizing course...');
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            setProgress(100);
            setCurrentStep('Course generated successfully!');
            
            console.log('Generated content:', result.data);
            toast.success("Course Generated Successfully!");
            
            setTimeout(() => {
                router.replace('/workspace');
            }, 1000);

        } catch (error) {
            console.error('Error generating content:', error);
            toast.error("Server Side Error, Try Again!");
            setProgress(0);
            setCurrentStep('');
        } finally {
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
                setCurrentStep('');
            }, 1000);
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
                            <h2>{courseLayout?.chapters?.length || 0}</h2>
                        </section>
                    </div>
                    <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
                        <TrendingUp className='text-green-500'/>
                        <section>
                            <h2 className='font-bold'>Difficulty</h2>
                            <h2>{courseLayout?.level}</h2>
                        </section>
                    </div>
                </div>
                
                {/* Loading Progress Section */}
                {loading && (
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4'>
                        <div className='flex items-center gap-3 mb-3'>
                            <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
                            <span className='font-medium text-blue-800'>Generating Course Content</span>
                        </div>
                        <Progress value={progress} className='mb-2' />
                        <p className='text-sm text-blue-600'>{currentStep}</p>
                        <p className='text-xs text-blue-500 mt-1'>{progress}% complete</p>
                    </div>
                )}
                
                {!viewCourse ? (
                    <Button 
                        className='max-w-sm' 
                        onClick={generateCourseContent}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Settings className="mr-2" />
                                Generate Content
                            </>
                        )}
                    </Button>
                ) : (
                    <Link href={'/course/'+course?.cid}>
                        <Button>
                            <PlayCircle className="mr-2" />
                            Continue Learning
                        </Button>
                    </Link>
                )}
            </div>
            
            <Image 
                src={course?.bannerImage || '/placeholder-course.png'} 
                alt='banner image' 
                width={400} 
                height={400} 
                className='w-full h-[240px] rounded-2xl object-cover aspect-auto mt-5 md:mt-0' 
            />
        </div>
    )
}

export default CourseInfo