import React, { useContext } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";

function ChapterListSidebar({ courseInfo }) {
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
  let completedChapters = enrollCourse?.completedChapters ?? [];
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);

  return (
    <div className="w-80 bg-gradient-to-b from-secondary to-white h-screen p-6 shadow-xl rounded-r-3xl border-r border-gray-200">
      <h2 className="my-4 font-extrabold text-2xl text-primary tracking-tight flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-primary rounded-full mr-2"></span>
        Chapters <span className="text-base font-medium text-gray-500 ml-2">({courseContent?.length})</span>
      </h2>
      <Accordion type="single" collapsible>
        {courseContent?.map((chapter, index) => (
          <AccordionItem
            className="text-lg font-medium border-none mb-2"
            onClick={() => setSelectedChapterIndex(index)}
            value={chapter?.courseData?.chapterName}
            key={index}
          >
            <AccordionTrigger className={`rounded-lg px-3 py-2 transition-all duration-200
              ${selectedChapterIndex === index
                ? 'bg-primary text-white shadow'
                : 'bg-white text-primary hover:bg-primary/10'}
            `}>
              <span className="font-semibold">{index + 1}. {chapter?.courseData?.chapterName}</span>
              {completedChapters.includes(index) && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  Completed
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent asChild>
              <div className="pl-2">
                {chapter?.courseData?.topics.map((topic, idx) => (
                  <h2
                    key={idx}
                    className={`p-3 my-1 rounded-lg transition-colors duration-200
                      ${completedChapters.includes(index)
                        ? 'bg-green-100 text-green-800 font-semibold'
                        : 'bg-gray-50 text-gray-700'}
                    `}
                  >
                    {topic?.topic}
                  </h2>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default ChapterListSidebar;