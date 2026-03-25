'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import AssignmentTab from './AssignmentTab';
import QuizTab from './QuizTab';
import DiscussionTab from './discusionTab';
import OverviewTab from './over-view-tab';
import type { Course, Module, Lesson } from '@/services/courseService';
import type { Assessment } from '@/types/assessment';
import type { AssessmentQuestion } from '@/services/assessmentService';

type QuizWithQuestions = {
  assessment: Assessment;
  questions: AssessmentQuestion[];
};

interface LessonContentProps {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
  selectedModuleId: string | null;
  selectedLessonId: string | null;
  assessments: Assessment[];
  quizDetails: QuizWithQuestions[];
}

export default function LessonContent({
  course,
  modules,
  lessons,
  selectedModuleId,
  selectedLessonId,
  assessments,
  quizDetails,
}: LessonContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [completed, setCompleted] = useState(false);

  const selectedModule = modules.find((module) => module.id === selectedModuleId) || null;
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || null;
  const assignments = assessments.filter((assessment) => assessment.type === 'ASSIGNMENT');
  const quizzes = assessments.filter((assessment) => assessment.type === 'QUIZ');

  return (
    <div className="px-4 md:px-8 py-5 md:py-7">
      <div className="mb-5 flex flex-col items-start justify-between gap-3 md:gap-4 sm:flex-row">
        <div>
          <h1 className="font-['Syne'] text-xl font-bold leading-tight md:text-2xl">
            {selectedLesson?.title || selectedModule?.title || course.title || 'Course Overview'}
          </h1>
          <div className="mt-1 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full border border-[#63b3ed]/30 bg-[#63b3ed]/5 px-2.5 py-0.5 font-mono text-[11px] text-[#63b3ed]">
              <Play className="h-3 w-3" />
              {selectedLesson?.contentType?.toUpperCase() || 'LESSON'}
            </span>
            <span className="rounded-full border border-[#f6ad55]/30 bg-[#f6ad55]/5 px-2.5 py-0.5 font-mono text-[11px] text-[#f6ad55]">
              Week {selectedModule?.releaseWeek || 1}
            </span>
            <span className="rounded-full border border-white/[0.07] px-2.5 py-0.5 font-mono text-[11px] text-gray-400">
              {assessments.length} assessments
            </span>
          </div>
        </div>

        <div className="flex w-full flex-shrink-0 gap-2 sm:w-auto">
          <button
            onClick={() => setCompleted(!completed)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition sm:flex-initial md:px-4 ${
              completed
                ? 'border border-[#68d391]/40 bg-[#68d391]/20 text-[#68d391]'
                : 'border border-[#68d391]/20 bg-[#68d391]/10 text-[#68d391] hover:bg-[#68d391]/20'
            }`}
          >
            {completed ? 'Done!' : 'Complete'}
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-0 overflow-x-auto border-b border-white/[0.07]">
        {['overview', 'assignment', 'quiz', 'discussion'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-[13px] font-medium transition md:px-4 ${
              activeTab === tab
                ? 'border-[#63b3ed] text-[#63b3ed]'
                : 'border-transparent text-gray-400 hover:text-[#63b3ed]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab lesson={selectedLesson} />}
      {activeTab === 'assignment' && <AssignmentTab assessments={assignments} />}
      {activeTab === 'quiz' && <QuizTab quizzes={quizzes} quizDetails={quizDetails} />}
      {activeTab === 'discussion' && <DiscussionTab />}
    </div>
  );
}
