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
    <div className="w-80 bg-gradient-to-b from-secondary to-white h-screen flex flex-col shadow-xl rounded-r-3xl border-r border-gray-200 overflow-hidden">
      {/* Fixed Header */}
      <div className="p-6 flex-shrink-0">
        <h2 className="font-extrabold text-2xl text-primary tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-primary rounded-full"></span>
          Chapters <span className="text-base font-medium text-gray-500">({courseContent?.length})</span>
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-6">
        <Accordion type="single" collapsible className="w-full">
          {courseContent?.map((chapter, index) => (
            <AccordionItem
              className="text-lg font-medium border-none mb-2"
              onClick={() => setSelectedChapterIndex(index)}
              value={chapter?.courseData?.chapterName}
              key={index}
            >
              <AccordionTrigger className={`rounded-lg px-3 py-2 transition-all duration-200 w-full
                ${selectedChapterIndex === index
                  ? 'bg-primary text-white shadow'
                  : 'bg-white text-primary hover:bg-primary/10'}
              `}>
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="font-semibold truncate flex-1 text-left pr-2">
                    {index + 1}. {chapter?.courseData?.chapterName}
                  </span>
                  {completedChapters.includes(index) && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex-shrink-0">
                      ✓
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-2 mt-1 space-y-1">
                  {chapter?.courseData?.topics.map((topic, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg transition-colors duration-200 text-sm break-words
                        ${completedChapters.includes(index)
                          ? 'bg-green-100 text-green-800 font-semibold'
                          : 'bg-gray-50 text-gray-700'}
                      `}
                    >
                      {topic?.topic}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default ChapterListSidebar;