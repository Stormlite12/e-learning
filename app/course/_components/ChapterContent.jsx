import React, { useContext, useState } from 'react'
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import YouTube from 'react-youtube';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2Icon, X } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

function ChapterContent({ courseInfo, refreshData }) {
  const { courseId } = useParams();
  const { course, enrollCourse } = courseInfo ?? '';
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);
  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;
  let completedChapter = enrollCourse?.completedChapters ?? [];
  const [loading, setLoading] = useState(false);

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
    const completeChap = completedChapter.filter(item => item != selectedChapterIndex);
    const result = await axios.put('/api/enroll-course', {
      courseId: courseId,
      completedChapter: completeChap
    });
    console.log(result);
    refreshData();
    toast.success('Chapter Marked Incomplete! ');
    setLoading(false);
  }

  // Function to remove duplicate heading from content
  const cleanContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove first h1, h2, or h3 if it exists
    const firstHeading = tempDiv.querySelector('h1, h2, h3');
    if (firstHeading) {
      firstHeading.remove();
    }
    
    return tempDiv.innerHTML;
  }

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      {/* Chapter Header */}
      <div className='flex justify-between items-center mb-6 pb-4 border-b'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Chapter {selectedChapterIndex + 1}: {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
        </h1>
        {!completedChapter?.includes(selectedChapterIndex) ?
          <Button 
            onClick={markChapterCompleted}
            disabled={loading}
            className="gap-2"
          >
            {loading ? <Loader2Icon className='animate-spin' size={18} /> : <CheckCircle size={18} />}
            Mark Complete
          </Button> :
          <Button
            onClick={markChapterIncomplete}
            disabled={loading}
            variant="outline"
            className="gap-2"
          >
            {loading ? <Loader2Icon className='animate-spin' size={18} /> : <X size={18} />}
            Mark Incomplete
          </Button>
        }
      </div>

      {/* Related Videos Section */}
      {videoData && videoData.length > 0 && (
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4 text-gray-800'>
            📺 Related Videos
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {videoData?.map((video, index) => index < 2 && (
              <div key={index} className='rounded-lg overflow-hidden shadow-md'>
                <YouTube
                  videoId={video?.videoId}
                  opts={{
                    height: '250',
                    width: '100%',
                    playerVars: {
                      modestbranding: 1,
                    }
                  }}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Content Topics */}
      <div className='space-y-6'>
        <h2 className='text-xl font-semibold mb-4 text-gray-800'>
          📚 Chapter Content
        </h2>
        
        {topics?.map((topic, index) => (
          <div key={index} className='bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow'>
            <h3 className='text-lg font-semibold text-primary mb-4 pb-2 border-b border-gray-200'>
              {topic?.topic}
            </h3>
            <div
              dangerouslySetInnerHTML={{ __html: cleanContent(topic?.content) }}
              className='prose prose-gray max-w-none'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChapterContent;