'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Clock, GraduationCap } from 'lucide-react';
import AssignmentTab from './AssignmentTab';
import QuizTab from './QuizTab';
import DiscussionTab from './discusionTab';
import OverviewTab from './over-view-tab';
import type { Course, Module, Lesson } from '@/services/courseService';

interface LessonContentProps {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
  selectedModuleId: string | null;
  selectedLessonId: string | null;
}

export default function LessonContent({ course, modules, lessons, selectedModuleId, selectedLessonId }: LessonContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [completed, setCompleted] = useState(false);

  return (
    <div className="px-4 md:px-8 py-5 md:py-7 ">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 md:gap-4 mb-5">
          <div>
            <h1 className="font-['Syne'] text-xl md:text-2xl font-bold leading-tight">
              {modules.find(m => m.id === selectedModuleId)?.title || course.title || 'Course Overview'}
            </h1>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full border border-[#63b3ed]/30 text-[#63b3ed] bg-[#63b3ed]/5 flex items-center gap-1">
                <Play className="w-3 h-3" />
                Video
              </span>
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full border border-[#f6ad55]/30 text-[#f6ad55] bg-[#f6ad55]/5">
                Week {modules.find(m => m.id === selectedModuleId)?.releaseWeek || 1}
              </span>
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full border border-white/[0.07] text-gray-400">
                25 min
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-[13px] font-medium border border-white/[0.07] text-gray-400 hover:bg-[#181c24] hover:text-white hover:border-white/[0.12] transition flex-1 sm:flex-initial">
              ← Prev
            </button>
          <button
            onClick={() => setCompleted(!completed)}
            className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-[13px] font-medium transition flex-1 sm:flex-initial ${
              completed
                ? 'bg-[#68d391]/20 border border-[#68d391]/40 text-[#68d391]'
                : 'bg-[#68d391]/10 border border-[#68d391]/20 text-[#68d391] hover:bg-[#68d391]/20'
            }`}
          >
            ✓ {completed ? 'Done!' : 'Complete'}
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-[13px] font-medium bg-[#63b3ed] text-[#0a0b0f] hover:bg-[#90cdf4] transition flex-1 sm:flex-initial">
            Next →
          </button>
        </div>
      </div>

      

      <div className="flex gap-0 border-b border-white/[0.07] mb-6 overflow-x-auto">
        {['overview', 'assignment', 'quiz', 'discussion'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 md:px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition whitespace-nowrap ${
              activeTab === tab
                ? 'text-[#63b3ed] border-[#63b3ed]'
                : 'text-gray-400 border-transparent hover:text-[#63b3ed]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'assignment' && <AssignmentTab />}
      {activeTab === 'quiz' && <QuizTab />}
      {activeTab === 'discussion' && <DiscussionTab />}
    </div>
  );
}








