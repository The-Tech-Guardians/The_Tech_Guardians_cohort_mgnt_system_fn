export type { BackendCourse } from '@/types/course';
import type { BackendCourse, Course, ExtendedCourse } from '@/types/course';
import type { Module } from './moduleService';
export type { Module } from './moduleService';
import type { BackendLesson } from '@/types/lesson';
export type Lesson = BackendLesson;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  dataSource?: 'live' | 'fallback';
}

export interface QuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

import type { Assessment } from '@/types/assessment';

export interface CourseAssessment extends Omit<Assessment, 'questions'> {
  totalQuestions: number;
  orderIndex: number;
}

export interface Instructor {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ApiResponse<T> {
  courses?: T[];
  course?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
  data?: any;
  success?: boolean;
}

import { FALLBACK_BACKEND_COURSES } from "@/lib/course-data";

// Use consistent auth_token only
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};



const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || error.message || 'Request failed');
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response;
};

export const courseService = {
  // Get learner enrolled courses (learner view)
  async getLearnerEnrolledCourses(
    page: number = 1,
    limit: number = 20
  ): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    const token = getAuthToken();

    if (!token) {
      console.warn('No auth token for course details - returning empty');
      return { courses: [], pagination: { page, limit, total: 0, pages: 0 } };
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/learner/courses?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch courses');
      }

      const data = await response.json();
      const coursesData = data.data || [];
      
      return {
        courses: coursesData,
        pagination: data.pagination || {
          page,
          limit,
          total: coursesData.length,
          pages: 1,
        },
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to fetch courses');
    }
  },

  async getLearnerCohortCourses(
    page: number = 1,
    limit: number = 10
  ): Promise<{ courses: Course[]; pagination: PaginationInfo; cohortCourseType?: string }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || localStorage.getItem('token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/learner/cohort-courses?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to fetch cohort courses');
      }

      const data = await response.json();
      // Backend returns { success: true, data: [...], message, cohortCourseType }
      const coursesData = data.data || [];

      return {
        courses: coursesData,
        pagination: data.pagination || {
          page,
          limit,
          total: coursesData.length,
          pages: 1,
        },
        cohortCourseType: data.cohortCourseType,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to fetch cohort courses');
    }
  },

  async getCourseById(id: string): Promise<{ course: Course | null }> {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch course');
      }

      const data: ApiResponse<Course> = await response.json();

      return { course: data.course || null };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to fetch course');
    }
  },

async getCourseWithModulesAndLessons(courseId: string): Promise<{ course: Course; modules: Module[]; lessons: BackendLesson[] }> {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const courseUrl = `${API_BASE_URL}/courses/${courseId}`;
      const modulesUrl = `${API_BASE_URL}/modules/course/${courseId}`;
      
      const [courseRes, modulesRes] = await Promise.all([
        fetch(courseUrl, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }),
        fetch(modulesUrl, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }),
      ]);

      if (!courseRes.ok) {
        const errorData = await courseRes.json().catch(() => ({}));
        throw new Error(`Failed to fetch course: ${courseRes.status}`);
      }

      const courseData = await courseRes.json();
      const modulesData = modulesRes.ok ? await modulesRes.json() : { modules: [] };

      const modules = modulesData.modules || [];
      const allLessons: Lesson[] = [];

      for (const mod of modules) {
        try {
          const lessonsRes = await fetch(`${API_BASE_URL}/lessons/module/${mod.id}`, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          });
          if (lessonsRes.ok) {
            const lessonsData = await lessonsRes.json();
            allLessons.push(...(lessonsData.lessons || []));
          }
        } catch (err) {
          // Silent fail for individual modules
        }
      }

      return {
        course: courseData.course,
        modules,
        lessons: allLessons,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to fetch course details');
    }
  },

  // Get courses for current instructor
  async getInstructorCourses(instructorId: string): Promise<{ courses: BackendCourse[]; pagination: PaginationInfo }> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch(`${API_BASE_URL}/admin/instructors/${instructorId}?page=1&limit=100`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Instructor courses API unavailable:', response.status);
        return { courses: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } };
      }
      
      const data = await response.json();
      return { 
        courses: data.courses || [], 
        pagination: { page: 1, limit: 100, total: data.courses?.length || 0, pages: 1 }
      };
    } catch (error) {
      console.warn('Instructor courses fetch failed:', error);
      return { courses: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } };
    }
  },

  // Get all courses (admin/instructor view)
  async getAllCourses(page: number = 1, limit: number = 10): Promise<{ courses: BackendCourse[]; pagination: PaginationInfo }> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/courses?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        console.warn('Courses API unavailable:', response.status);
        return { courses: [], pagination: { page, limit, total: 0, pages: 0 } };
      }
      const data = await response.json();
      return { 
        courses: data.courses || [], 
        pagination: data.pagination || { page, limit, total: 0, pages: 0 }
      };
    } catch (error) {
      console.warn('Courses fetch failed:', error);
      return { courses: [], pagination: { page, limit, total: 0, pages: 0 } };
    }
  },

  async createCourse(courseData: Partial<BackendCourse>): Promise<{ course: BackendCourse } | null> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      const data = await handleResponse(response);
      return data.course ? { course: data.course } : null;
    } catch (error) {
      throw error;
    }
  },

  async updateCourse(id: string, courseData: Partial<BackendCourse>): Promise<{ course: BackendCourse } | null> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      const data = await handleResponse(response);
      return data.course ? { course: data.course } : null;
    } catch (error) {
      throw error;
    }
  },

  async deleteCourse(id: string): Promise<boolean> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await handleResponse(response);
      return true;
    } catch (error) {
      throw error;
    }
  },

  async publishCourse(id: string): Promise<boolean> {
    const token = getAuthToken();
    if (!token) {
      console.error('No token for publishCourse');
      return false;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}/publish`, {
        method: 'PUT', // Changed from PATCH to PUT to avoid CORS issues
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        return true;
      } else {
        console.error('Publish failed:', response.status, await response.text());
        return false;
      }
    } catch (error) {
      console.error(`Failed to publish course ${id}:`, error);
      return false;
    }
  },

  async togglePublish(id: string): Promise<BackendCourse | null> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      
      const courseRes = await fetch(`${API_BASE_URL}/courses/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const course = await courseRes.json();
      const targetStatus = !course.course?.isPublished;
      const endpoint = targetStatus ? 'publish' : 'unpublish';
      
      const response = await fetch(`${API_BASE_URL}/courses/${id}/${endpoint}`, {
        method: 'PUT', // Changed from PATCH to PUT to avoid CORS issues
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await handleResponse(response);
      return data.course ? data.course : null;
    } catch (error) {
      console.error('Toggle publish failed:', error);
      return null;
    }
  },

  async getInstructors(page: number = 1, limit: number = 20, search?: string): Promise<{ instructors: Instructor[]; pagination: PaginationInfo }> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      
      let url = `${API_BASE_URL}/courses/instructors?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await handleResponse(response);
      return {
        instructors: data.instructors || [],
        pagination: data.pagination || { page, limit, total: 0, pages: 0 }
      };
    } catch (error) {
      return { instructors: [], pagination: { page, limit, total: 0, pages: 0 } };
    }
  },

  async getModulesByCourse(courseId: string): Promise<Module[]> {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_BASE_URL}/modules/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await handleResponse(response);
      return data.modules || [];
    } catch (error) {
      return [];
    }
  },

async getLessonsByModule(moduleId: string): Promise<BackendLesson[]> {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_BASE_URL}/lessons/module/${moduleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await handleResponse(response);
      return data.lessons || [];
    } catch (error) {
      return [];
    }
  },

  async getAssessmentsByCourse(courseId: string): Promise<Assessment[]> {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_BASE_URL}/assessments/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await handleResponse(response);
      return data.assessments || [];
    } catch (error) {
      return [];
    }
  },
};

export const formatCourseType = (type: string): string => {
  const formatted: Record<string, string> = {
    COMPUTER_PROGRAMMING: 'Computer Programming',
    SOCIAL_MEDIA_BRANDING: 'Social Media Branding',
    ENTREPRENEURSHIP: 'Entrepreneurship',
    TEAM_MANAGEMENT: 'Team Management',
    SRHR: 'SRHR',
  };
  return formatted[type as keyof typeof formatted] || type;
};

export const formatCourseTypeDisplay = (courseType: string | undefined | null): string => {
  if (!courseType) {
    return 'Unknown Type';
  }
  return courseType.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const formatCourseTypeForAPI = (displayType: string): string => {
  return displayType.toUpperCase().replace(/ /g, '_');
};


