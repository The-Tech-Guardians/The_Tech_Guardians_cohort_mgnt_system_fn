"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import CourseSidebar from "@/components/learner/my-course/CourseSidebar";
import VideoPlayer from "@/components/learner/my-course/VideoPlayer";
import LessonContent from "@/components/learner/my-course/LessonContent";
import { courseService, type Course, type Module, type Lesson } from "@/services/courseService";

export default function MyLearningPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        setError("No course selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await courseService.getCourseWithModulesAndLessons(courseId as string);
        setCourse(data.course);
        setModules(data.modules.sort((a, b) => a.orderIndex - b.orderIndex));
        setLessons(data.lessons.sort((a, b) => a.orderIndex - b.orderIndex));
      } catch (err: any) {
        console.error("Error fetching course details:", err);
        setError(err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0m-3.535-3.535a5 5 0 1 1 7.072 0m-9.9-3.343l-.707-.707M3 3l1.414 1.414" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Available</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error || "No course data found. Make sure you have enrolled courses."}</p>
          <div className="space-y-3">
            <a href="/learner/my-courses" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all text-center">
              View My Courses
            </a>
            <a href="/learner/cohorts" className="block w-full border-2 border-indigo-200 hover:border-indigo-300 text-indigo-700 font-semibold py-3 px-6 rounded-2xl transition-all text-center bg-indigo-50 hover:bg-indigo-50">
              Browse Cohorts
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block flex-shrink-0 overflow-y-auto w-80">
      <CourseSidebar 
        course={course} 
        modules={modules} 
        lessons={lessons} 
        selectedModuleId={selectedModuleId}
        onModuleSelect={setSelectedModuleId}
        onLessonSelect={setSelectedLessonId}
      />

      </div>

      <main className="flex-1 overflow-y-auto bg-[#F3F4F6] scrollbar-hide">
      <VideoPlayer />
      <LessonContent 
        course={course}
        modules={modules}
        lessons={lessons}
        selectedModuleId={selectedModuleId}
        selectedLessonId={selectedLessonId}
      />

      </main>
    </div>
  );
}
