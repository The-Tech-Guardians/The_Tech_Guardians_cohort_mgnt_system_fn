"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSidebar } from '../layout';
import { courseService, type Course } from '@/services/courseService';
import { authAPI } from '@/lib/auth';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

interface LearnerCohort {
  id: string;
  name: string;
  currentStudents: number;
  cohortId?: string;
}

interface ExtendedCourse extends Course {
  progress?: number;
  instructor?: string;
  modules?: number;
  lessons?: number;
}

export default function LearnerMyCoursesPage() {
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'not-started'>('all');
  const [courses, setCourses] = useState<ExtendedCourse[]>([]);
  const [cohort, setCohort] = useState<LearnerCohort | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { collapsed } = useSidebar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const cohortRes = await authAPI.getLearnerCohort();
        if (cohortRes.success) {
          setCohort(cohortRes.data || null);
        }

        const { courses: enrolledCourses } = await courseService.getLearnerEnrolledCourses();
        // Extend with mock data for demo
        const extendedCourses = enrolledCourses.map(course => ({
          ...course,
          progress: course.id === enrolledCourses[0]?.id ? 45 : 0,
          instructor: 'Tech Guardians Team',
          modules: 8,
          lessons: 42
        })) as ExtendedCourse[];
        setCourses(extendedCourses);
      } catch (err: unknown) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setCourses([]);
        setCohort(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = courses.filter(c => 
    filter === 'all' || 
    (filter === 'in-progress' && c.progress && c.progress > 0 && c.progress < 100) ||
    (filter === 'not-started' && (!c.progress || c.progress === 0))
  );

  if (loading) {
    return (
      <div className={`transition-all duration-300 space-y-6 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div>
            <h1 className='text-2xl font-black text-gray-900' style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>My Courses</h1>
            <p className='text-sm text-gray-500 mt-1'>Loading your courses...</p>
          </div>
        </div>
        <div className='grid md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-2xl animate-pulse'>
          {[1,2,3].map(i => (
            <div key={i} className='bg-white rounded-2xl border border-gray-200 shadow-sm h-80'>
              <div className='h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-2xl'></div>
              <div className='p-6 space-y-4'>
                <div className='h-6 bg-gray-200 rounded-lg'></div>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='space-y-2'>
                  <div className='h-2 bg-gray-200 rounded-full'></div>
                  <div className='h-2 bg-gray-200 rounded-full w-4/5'></div>
                </div>
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
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div>
            <h1 className='text-2xl font-black text-gray-900' style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>My Courses</h1>
            <p className='text-sm text-red-500 mt-1'>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className='inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition'
          >
            Retry
          </button>
        </div>
        <div className='text-center py-12'>
          <Link href='/learner/cohorts' className='inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition'>
            Browse Cohorts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 space-y-6 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div>
          <h1 className='text-2xl font-black text-gray-900' style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>My Courses</h1>
          <p className='text-sm text-gray-500 mt-1'>{cohort ? `Courses in ${cohort.name}` : 'Join a cohort to get started'}</p>
        </div>
        <div className='flex gap-2 flex-wrap'>
          {['all', 'in-progress', 'not-started'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f as 'all' | 'in-progress' | 'not-started')}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all capitalize ${
                filter === f 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-md'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {cohort && (
        <div className='bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-indigo-100 rounded-2xl'>
              <Users className='w-6 h-6 text-indigo-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600'>Students in <span className='font-bold text-gray-900'>{cohort.name}</span></p>
              <p className='text-3xl font-black text-indigo-600'>{cohort.currentStudents}</p>
            </div>
          </div>
        </div>
      )}

      {courses.length === 0 ? (
        <div className='text-center py-20 px-8'>
          <div className='w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-2xl mx-auto mb-6 shadow-2xl'>
            <GraduationCap className='w-12 h-12 text-white' />
          </div>
          <h2 className='text-2xl font-black text-gray-900 mb-3' style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>
            No Courses Yet
          </h2>
          <p className='text-gray-500 text-lg mb-8 max-w-md mx-auto leading-relaxed'>
            {cohort 
              ? 'No courses available in your cohort yet. Check back soon!'
              : 'Join a cohort to access courses and start learning.' 
            }
          </p>
          <Link 
            href='/learner/cohorts' 
            className='inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:from-indigo-700 transition-all text-lg'
          >
            Browse Cohorts
          </Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filtered.map((course) => (
            <Link 
              key={course.id} 
              href={`/courses/${course.id}`}
              className='group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full'
            >
              <div className='relative h-48 bg-gradient-to-br from-gray-900 to-gray-800 group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-500 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
                <div className='absolute -right-4 -top-4 w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all'>
                  <span className='text-2xl font-black text-white drop-shadow-lg'>{course.title?.charAt(0)?.toUpperCase() || 'C'}</span>
                </div>
                <div className='absolute bottom-4 right-4 text-right'>
                  <div className='inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl text-white font-bold text-sm border border-white/30'>
                    {course.progress || 0}%
                  </div>
                </div>
              </div>

              <div className='p-6 space-y-4'>
                <div>
                  <h3 className='font-black text-xl text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2' style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>
                    {course.title}
                  </h3>
                  <p className='text-sm text-gray-500 mt-1'>by {course.instructor || 'Tech Guardians Instructor'}</p>
                </div>

                <div className='grid grid-cols-3 gap-4 text-xs text-gray-500'>
                  <div className='text-center'>
                    <div className='font-bold text-lg text-gray-900 mb-1'>{course.modules || 0}</div>
                    <div>Modules</div>
                  </div>
                  <div className='text-center'>
                    <div className='font-bold text-lg text-gray-900 mb-1'>{course.lessons || 0}</div>
                    <div>Lessons</div>
                  </div>
                  <div className='text-center'>
                    <div className='w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden'>
                      <div 
                        className='bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all' 
                        style={{width: `${course.progress || 0}%`}}
                      />
                    </div>
                    <div className='text-right mt-1 text-gray-900 font-medium text-xs'>Progress</div>
                  </div>
                </div>

                {course.progress && course.progress > 0 && (
                  <div className='bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200'>
                    <div className='flex items-center gap-2 text-xs text-emerald-700 font-medium mb-1'>
                      <BookOpen className='w-3 h-3' />
                      Next up
                    </div>
                    <div className='text-sm font-semibold text-gray-900'>Module 1: Getting Started</div>
                  </div>
                )}

                <div className='flex gap-2 pt-2'>
                  <button className='flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl group-hover:scale-[1.02]'>
                    {course.progress && course.progress > 0 ? 'Continue Course' : 'Start Learning'}
                  </button>
                  <button className='p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group-hover:bg-gray-50'>
                    <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'/>
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
