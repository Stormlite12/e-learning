import React, { useContext, useState } from 'react'
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";

import YouTube from 'react-youtube';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader, Loader2Icon, X } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';


function ChapterContent({ courseInfo, refreshData }) {
  const { courseId } = useParams();
  const {course, enrollCourse} = courseInfo ?? '';
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);
  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;
  let completedChapter = enrollCourse?.completedChapters ?? [];
  const [loading,setLoading]=useState(false);

  const markChapterCompleted = async () => {
    setLoading(true);
      
      completedChapter.push(selectedChapterIndex);
      const result = await axios.put('/api/enroll-course', {
        courseId: courseId,
        completedChapter: completedChapter
      });
      console.log(result);
      refreshData();
      toast.success('Chapter Marked Completed! ')
        setLoading(false);


  }
  const markChapterIncomplete = async () => {
    setLoading(true);
      const completeChap= completedChapter.filter(item=>item!=selectedChapterIndex);
      const result = await axios.put('/api/enroll-course', {
        courseId: courseId,
        completedChapter: completeChap
      });
      console.log(result);
      refreshData();
      toast.success('Chapter Marked Incomplete! ');
       setLoading(false);


  }



  return (
    <div className='mt-20'>

      <div className='flex justify-between items-center'>
        <h2 className='font-bold'>{selectedChapterIndex + 1}.{courseContent?.[selectedChapterIndex]?.courseData?.chapterName}</h2>
        {!completedChapter?.includes(selectedChapterIndex)?
        <Button onClick={markChapterCompleted}
        disabled={loading}>
        {loading?<Loader2Icon className='animate-spin'/>:<CheckCircle />}Mark as Completed
        </Button>:
        <Button 
        onClick={markChapterIncomplete}
        disabled={loading}>
           {loading?<Loader2Icon className='animate-spin'/
           >:<X/>}Mark Incomplete</Button>
        }
      </div>

      <h2 className='my-2 font-bold text-lg'>
        Related Videos
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {videoData?.map((video, index) => index < 2 && (
          <div key={index}>
            <YouTube
              videoId={video?.videoId}
              opts={{
                height: '250',
                width: '440',
              }}>

            </YouTube>
          </div>

        ))}
      </div>

      <div className='mt-7'>
        {topics?.map((topic, index) => (
          <div key={index} className='mt-10 bg-secondary rounded-2xl p-5'>
            <h2 className='font-bold text-lg'>{topic?.topic}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: topic?.content }}
              className='prose max-w-none'
              style={{
                lineHeight: '2.5'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChapterContent;
