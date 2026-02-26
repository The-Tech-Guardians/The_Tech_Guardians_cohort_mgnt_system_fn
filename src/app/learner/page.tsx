import TopNav from '@/components/learner/TopNav';
import CourseSidebar from '@/components/learner/CourseSidebar';
import VideoPlayer from '@/components/learner/VideoPlayer';
import LessonContent from '@/components/learner/LessonContent';
import RightPanel from '@/components/learner/RightPanel';

export default function LearnerCoursePage() {
  return (
    <div className="h-screen bg-[#0F0C29] text-white flex flex-col overflow-hidden">
      <TopNav />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block">
          <CourseSidebar />
        </div>
        
        <main className="flex-1 overflow-y-auto bg-[#0a0b0f] scrollbar-hide">
          <VideoPlayer />
          <LessonContent />
        </main>
        
        <RightPanel />
      </div>
    </div>
  );
}
