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
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 font-semibold">{error || "Course not found"}</p>
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
      <VideoPlayer lessonId={selectedLessonId || ''} />
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
