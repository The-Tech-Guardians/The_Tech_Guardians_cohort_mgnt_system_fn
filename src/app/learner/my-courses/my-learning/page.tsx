"use client";

import CourseSidebar from '@/components/learner/my-course/CourseSidebar';
import VideoPlayer from '@/components/learner/my-course/VideoPlayer';
import LessonContent from '@/components/learner/my-course/LessonContent';

export default function MyLearningPage() {
  return (
    <div className="flex-1 flex overflow-hidden ">
      <div className="hidden lg:block">
        <CourseSidebar />
      </div>
      
      <main className="flex-1 overflow-y-auto bg-[#F3F4F6] scrollbar-hide">
        <VideoPlayer />
        <LessonContent />
      </main>
      
     
    </div>
  );
}
