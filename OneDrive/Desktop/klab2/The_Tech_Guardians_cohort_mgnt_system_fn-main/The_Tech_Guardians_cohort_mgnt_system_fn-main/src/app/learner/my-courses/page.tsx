"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSidebar } from "../layout";
import { courseService, type Course } from "@/services/courseService";
import { GraduationCap, BookOpen } from "lucide-react";

const API_BASE_URL = 'http://localhost:3000/api';

interface Cohort {
  id: string;
  cohortId: string;
  name: string;
}

interface CourseDisplay extends Course {
  color?: string;
  progress?: number;
  modules?: number;
  lessons?: number;
  nextLesson?: string;
  status?: string;
  thumbnail?: string;
}

export default function LearnerMyCoursesPage() {
  const [filter, setFilter] = useState("all");
  const [courses, setCourses] = useState<CourseDisplay[]>([]);
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { collapsed } = useSidebar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        // First, get the learner's cohort
        const cohortResponse = await fetch(`${API_BASE_URL}/learner/cohort`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        let cohortId = null;
        if (cohortResponse.ok) {
          const cohortData = await cohortResponse.json();
          if (cohortData.success && cohortData.data) {
            setCohort(cohortData.data);
            // Get cohortId - handle both formats from API
            cohortId = cohortData.data.cohortId || cohortData.data.id;
          }
        }

        // Only fetch courses if learner is enrolled in a cohort
        if (cohortId) {
          const coursesResponse = await fetch(`${API_BASE_URL}/courses?cohortId=${cohortId}&page=1&limit=50`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (coursesResponse.ok) {
            const data = await coursesResponse.json();
            const coursesData = data.courses || [];
            
            if (coursesData && coursesData.length > 0) {
              const transformedCourses = coursesData.map((course: Course) => {
                const colors = [
                  'bg-gradient-to-br from-blue-500 to-blue-600',
                  'bg-gradient-to-br from-purple-500 to-purple-600',
                  'bg-gradient-to-br from-pink-500 to-pink-600',
                  'bg-gradient-to-br from-green-500 to-green-600',
                  'bg-gradient-to-br from-orange-500 to-orange-600',
                ];
                const colorIndex = Math.abs(course.title.charCodeAt(0)) % colors.length;
                
                return {
                  ...course,
                  color: colors[colorIndex],
                  progress: 0,
                  modules: 0,
                  lessons: 0,
                  nextLesson: 'Getting Started',
                  status: 'not-started',
                  thumbnail: course.title?.charAt(0).toUpperCase() || 'C'
                };
              });
              setCourses(transformedCourses);
            } else {
              setCourses([]);
            }
          } else {
            setCourses([]);
          }
        } else {
          // Not enrolled in any cohort
          setCourses([]);
        }
      } catch (err: unknown) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = courses.filter(c => 
    filter === "all" || 
    (filter === "in-progress" && c.progress && c.progress > 0 && c.progress < 100) ||
    (filter === "not-started" && (!c.progress || c.progress === 0))
  );

  if (loading) {
    return (
      <div className={`transition-all duration-300 space-y-6 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>My Courses</h1>
            <p className="text-sm text-gray-500 mt-1">Loading your courses...</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm animate-pulse">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`transition-all duration-300 space-y-6 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>My Courses</h1>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // If not enrolled in any cohort, show a message to enroll
  if (!cohort) {
    return (
      <div className={`transition-all duration-300 space-y-6 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>My Courses</h1>
            <p className="text-sm text-gray-500 mt-1">Join a cohort to access courses</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-full mb-6">
            <GraduationCap className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Cohort Joined</h2>
          <p className="text-gray-500 text-center max-w-md mb-6">
            You need to join a cohort to access your courses. Browse available cohorts and enroll to start learning.
          </p>
          <Link 
            href="/learner/cohorts"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Browse Cohorts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 space-y-6 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>My Courses</h1>
          <p className="text-sm text-gray-500 mt-1">Courses available in your cohort</p>
        </div>
        <div className="flex gap-2">
          {["all", "in-progress", "not-started"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl capitalize transition-colors
                ${filter === f ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-200"}`}>
              {f.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-2">
        {filtered.map(course => (
         
          <div key={course._id || course.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer">
            <div className={`relative h-32 ${course.color} flex items-center justify-center`}>
              <span className="text-6xl font-black text-white/20" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>{course.thumbnail}</span>
              <div className="absolute top-3 right-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  course.progress && course.progress > 0 ? "bg-green-500 text-white" : "bg-white/20 text-white"
                }`}>
                  {course.progress || 0}%
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-black text-gray-900 mb-2 group-hover:text-gray-700 transition-colors" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>
                {course.title}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>{course.courseType || 'Course'}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span>{course.modules || 0} Modules</span>
                <span>•</span>
                <span>{course.lessons || 0} Lessons</span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold">{course.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all" style={{width: `${course.progress || 0}%`}}/>
                </div>
              </div>

              {course.progress && course.progress > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="text-xs text-gray-400 mb-1">Next Lesson</div>
                  <div className="text-sm font-semibold text-gray-800">{course.nextLesson}</div>
                </div>
              )}

              <div className="flex gap-2">
               
               
                <button className={`flex-1  text-white ${course.color} text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity`}>
                  <Link href={`my-courses/my-learning?courseId=${course.id}`}> {course.progress && course.progress > 0 ? "Continue" : "Start Course"}</Link>
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-gray-400 text-lg font-semibold">
            {courses.length === 0 ? "No courses available in your cohort yet" : "No courses match your filter"}
          </div>
        </div>
      )}
    </div>
  );
}
              )}

              <div className="flex gap-2">
               
               
                <button className={`flex-1  text-white ${course.color} text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity`}>
                  <Link href={`my-courses/my-learning?courseId=${course.id}`}> {course.progress && course.progress > 0 ? "Continue" : "Start Course"}</Link>
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-gray-400 text-lg font-semibold">
            {courses.length === 0 ? "No courses available in your cohort yet" : "No courses match your filter"}
          </div>
        </div>
      )}
    </div>
  );
}

