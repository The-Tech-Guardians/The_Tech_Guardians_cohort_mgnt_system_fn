"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Eye, Edit, Plus, Play, FileText, BookOpen } from "lucide-react";
const Button = ({ className, children, variant = "default", size = "md", ...props }: any) => (
  <button className={`px-4 py-2 rounded-lg font-medium transition-all ${
    variant === "ghost" ? "text-gray-700 hover:bg-gray-100" :
    variant === "outline" ? "border border-gray-300 text-gray-700 hover:bg-gray-50" :
    "bg-blue-600 text-white hover:bg-blue-700"
  } ${size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"} ${className || ""}`} {...props}>
    {children}
  </button>
);
const Badge = ({ variant = "default", children }: { variant?: string; children: React.ReactNode }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
    variant === "secondary" ? "bg-gray-100 text-gray-800" : "bg-emerald-100 text-emerald-800"
  }`}>
    {children}
  </span>
);
import { authAPI, tokenManager } from "@/lib/auth";

interface Course {
  id: string;
  title: string;
  enrolled: string;
  modules: number;
  lessons: number;
  cohort: string;
  published: boolean;
  completion: number;
  modules_data: Array<{
    id: string;
    week: string;
    title: string;
    lessons: number;
    published: boolean;
  }>;
}

interface InstructorCourse {
  _id: string;
  title: string;
  enrolledCount: number;
  moduleCount: number;
  lessonCount: number;
  cohortName: string;
  isPublished: boolean;
  completionRate: number;
  modules: any[]; // Backend structure
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstructorCourses();
  }, []);

  const loadInstructorCourses = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        console.error('No token found');
        return;
      }

      // Use existing backend endpoint or new /instructor/courses
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/instructor/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform backend data to UI format
        const uiCourses: Course[] = (data.data || data.courses || data).map((course: InstructorCourse) => ({
          id: course._id,
          title: course.title,
          enrolled: course.enrolledCount.toString(),
          modules: course.moduleCount,
          lessons: course.lessonCount,
          cohort: course.cohortName,
          published: course.isPublished,
          completion: course.completionRate || 0,
          modules_data: course.modules?.map((m: any) => ({
            id: m._id,
            week: m.week || 'W1',
            title: m.title,
            lessons: m.lessonCount || 0,
            published: m.isPublished || false,
          })) || [],
        }));
        setCourses(uiCourses);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      // Fallback demo data
      setCourses([
        {
          id: "1",
          title: "React Advanced",
          enrolled: "245",
          modules: 12,
          lessons: 89,
          cohort: "COHORT-2025-A",
          published: true,
          completion: 67,
          modules_data: [
            { id: "1", week: "W1", title: "React Hooks", lessons: 8, published: true },
            { id: "2", week: "W2", title: "State Management", lessons: 7, published: true },
            { id: "3", week: "W3", title: "Performance", lessons: 6, published: false }
          ]
        },
        {
          id: "2",
          title: "TypeScript Deep Dive",
          enrolled: "156",
          modules: 10,
          lessons: 67,
          cohort: "COHORT-2025-B",
          published: false,
          completion: 34,
          modules_data: [
            { id: "1", week: "W1", title: "Basics", lessons: 5, published: true },
            { id: "2", week: "W2", title: "Advanced Types", lessons: 8, published: false }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading your courses...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Course
        </Button>
      </div>
      {courses.map((c) => (
        <div key={c.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-5 border-b border-gray-100 flex-wrap">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xl font-black flex-shrink-0">
              {c.title[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-black text-gray-900" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {c.title}
                </h3>
                <Badge variant={c.published ? "default" : "secondary"}>
                  {c.published ? "● Published" : "Draft"}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                <span>{c.enrolled} learners</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{c.modules}M · {c.lessons}L</span>
                <Badge variant="secondary">{c.cohort}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${c.completion}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 flex-shrink-0">{c.completion}%</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 flex-wrap">
              <Button variant="outline" size="sm" className="h-8 px-3">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-3">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course Structure</span>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                Add Module
              </Button>
            </div>
            <div className="space-y-2">
              {c.modules_data.map((m) => {
                const k = `${c.id}-${m.id}`;
                const isOpen = open === k;
                return (
                  <div key={m.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div 
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setOpen(isOpen ? null : k)}
                    >
                      <span className="text-xs font-mono bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-lg">
                        {m.week}
                      </span>
                      <span className="text-sm font-semibold text-gray-800 flex-1">{m.title}</span>
                      <span className="text-xs text-gray-400 hidden sm:block">{m.lessons} lessons</span>
                      <Badge variant={m.published ? "default" : "secondary"}>
                        {m.published ? "Live" : "Draft"}
                      </Badge>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                    {isOpen && (
                      <div className="p-3 space-y-1.5 border-t border-gray-100">
                        {Array.from({ length: m.lessons }, (_, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              {i % 3 === 0 ? (
                                <Play className="w-3.5 h-3.5 text-gray-600" />
                              ) : i % 3 === 1 ? (
                                <FileText className="w-3.5 h-3.5 text-gray-600" />
                              ) : (
                                <BookOpen className="w-3.5 h-3.5 text-gray-600" />
                              )}
                            </div>
                            <span className="text-sm text-gray-600 flex-1">
                              Lesson {i + 1}: {["Intro", "Core Concepts", "Deep Dive", "Practice", "Review", "Project"][i % 6]}
                            </span>
                            <div className="hidden group-hover:flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                Edit
                              </Button>
                              <span className="text-gray-200">|</span>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                Preview
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs justify-start w-full">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Lesson
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

