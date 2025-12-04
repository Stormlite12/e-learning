import React, { Suspense } from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import CourseList from "./_components/CourseList";
import EnrollCourseList from "./_components/EnrollCourseList";
import { Skeleton } from "@/components/ui/skeleton";

function EnrollCourseListSkeleton() {
    return (
        <div className="p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-xl p-6 animate-pulse">
                        <Skeleton className="h-48 w-full rounded-lg mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-4" />
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CourseListSkeleton() {
    return (
        <div className="p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-xl p-6 animate-pulse">
                        <Skeleton className="h-48 w-full rounded-lg mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function Workspace(){
    return(
        <div>
            <WelcomeBanner/>
            
            <Suspense fallback={<EnrollCourseListSkeleton />}>
                <EnrollCourseList/>
            </Suspense>
            
            <Suspense fallback={<CourseListSkeleton />}>
                <CourseList/>
            </Suspense>
        </div>
    )
}

export default Workspace