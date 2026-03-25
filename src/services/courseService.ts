export type { BackendCourse } from '@/types/course';
import type { BackendCourse, Course } from '@/types/course';
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
  data?: unknown;
  success?: boolean;
}

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

const parseJsonSafe = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }
  return response.json().catch(() => null);
};

const extractCoursePayload = <T>(payload: { course?: T; data?: T } | T | null): T | null => {
  if (!payload) return null;
  if (typeof payload === 'object' && ('course' in payload || 'data' in payload)) {
    const wrapped = payload as { course?: T; data?: T };
    return wrapped.course || wrapped.data || null;
  }
  return payload as T;
};

const extractCollectionPayload = <T>(
  payload: { data?: T[]; lessons?: T[]; modules?: T[]; items?: T[] } | T[] | null,
  preferredKey?: 'lessons' | 'modules'
): T[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (preferredKey && Array.isArray(payload[preferredKey])) {
    return payload[preferredKey] || [];
  }
  return payload.data || payload.lessons || payload.modules || payload.items || [];
};

const fetchLessonsForModule = async (moduleId: string, token: string): Promise<BackendLesson[]> => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const lessonEndpoints = [
    `${API_BASE_URL}/lessons/module/${moduleId}`,
    `${API_BASE_URL}/modules/${moduleId}/lessons`,
    `${API_BASE_URL}/learner/modules/${moduleId}/lessons`,
  ];

  for (const endpoint of lessonEndpoints) {
    try {
      const response = await fetch(endpoint, { headers });
      if (response.status === 404) {
        continue;
      }
      if (!response.ok) {
        continue;
      }

      const payload = await parseJsonSafe(response);
      const lessons = extractCollectionPayload<BackendLesson>(
        payload as { data?: BackendLesson[]; lessons?: BackendLesson[] } | BackendLesson[] | null,
        'lessons'
      );

      if (lessons.length > 0) {
        return lessons;
      }
    } catch {
      // Try the next lesson endpoint.
    }
  }

  return [];
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
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
      const courseEndpoints = [
        `${API_BASE_URL}/learner/courses/${courseId}`,
        `${API_BASE_URL}/courses/${courseId}`,
      ];

      let course: Course | null = null;
      let lastCourseError = 'Failed to fetch course';

      for (const endpoint of courseEndpoints) {
        const response = await fetch(endpoint, { headers });
        if (!response.ok) {
          const errorData = await parseJsonSafe(response);
          lastCourseError =
            (errorData as { error?: string; message?: string } | null)?.error ||
            (errorData as { error?: string; message?: string } | null)?.message ||
            `Failed to fetch course: ${response.status}`;
          continue;
        }

        const payload = await parseJsonSafe(response);
        course = extractCoursePayload<Course>(payload);
        if (course) break;
      }

      if (!course) {
        throw new Error(lastCourseError);
      }

      const moduleEndpoints = [
        `${API_BASE_URL}/modules/course/${courseId}`,
        `${API_BASE_URL}/courses/${courseId}/modules`,
      ];

      let modules: Module[] = [];
      for (const endpoint of moduleEndpoints) {
        const response = await fetch(endpoint, { headers });
        if (response.status === 404) {
          continue;
        }
        if (!response.ok) {
          continue;
        }

        const payload = await parseJsonSafe(response);
        modules = extractCollectionPayload<Module>(
          payload as { modules?: Module[]; data?: Module[] } | Module[] | null,
          'modules'
        );
        break;
      }

      const allLessons: Lesson[] = [];

      for (const mod of modules) {
        try {
          const moduleLessons = await fetchLessonsForModule(mod.id, token);
          allLessons.push(...moduleLessons);
        } catch {
          // Silent fail for individual modules
        }
      }

      return {
        course,
        modules,
        lessons: allLessons,
      };
    } catch (error) {
      throw error;
    }
  },

  async getLearnerCourseDetails(courseId: string): Promise<{ course: Course; modules: Module[]; lessons: Lesson[] }> {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/learner/courses/${courseId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Course not found: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        course: data.course,
        modules: data.modules || [],
        lessons: data.lessons || [],
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to fetch learner course details');
    }
  },

  // Get courses for current instructor
  async getInstructorCourses(): Promise<{ courses: BackendCourse[]; pagination: PaginationInfo }> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      
      const userRes = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!userRes.ok) {
        throw new Error('Failed to get current user');
      }
      
      const userData = await userRes.json();
      console.log('User data from /users/me:', userData);
      const instructorId = userData.user?.uuid;
      
      if (!instructorId) {
        return { courses: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } };
      }
      
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
      
      const instructorData = await response.json();
      console.log('Instructor data from /admin/instructors:', instructorData);
      
      const data = instructorData.instructor || {};
      return { 
        courses: data.courses || data.instructor?.courses || [], 
        pagination: { page: 1, limit: 100, total: data.courses?.length || data.instructor?.courses?.length || 0, pages: 1 }
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
      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch(`${API_BASE_URL}/courses?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        await response.text().catch(() => '');
        return { courses: [], pagination: { page, limit, total: 0, pages: 0 } };
      }
      
      const data = await response.json();
      return { 
        courses: data.courses || [], 
        pagination: data.pagination || { page, limit, total: 0, pages: 0 }
      };
    } catch {
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
      
      const courseRes = await fetch(`${API_BASE_URL}/instructor/courses/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const course = await courseRes.json();
      const targetStatus = !course.course?.isPublished;
      const endpoint = targetStatus ? 'publish' : 'unpublish';
      
      const response = await fetch(`${API_BASE_URL}/instructor/courses/${id}/${endpoint}`, {
        method: 'PUT',
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
    } catch {
      return { instructors: [], pagination: { page, limit, total: 0, pages: 0 } };
    }
  },

  async getModulesByCourse(courseId: string): Promise<Module[]> {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const endpoints = [
        `${API_BASE_URL}/modules/course/${courseId}`,
        `${API_BASE_URL}/courses/${courseId}/modules`,
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint, { headers });
        if (response.status === 404) {
          continue;
        }
        if (!response.ok) {
          continue;
        }

        const payload = await parseJsonSafe(response);
        const modules = extractCollectionPayload<Module>(
          payload as { modules?: Module[]; data?: Module[] } | Module[] | null,
          'modules'
        );

        if (modules.length > 0) {
          return modules;
        }
      }

      return [];
    } catch {
      return [];
    }
  },

async getLessonsByModule(moduleId: string): Promise<BackendLesson[]> {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    try {
      return await fetchLessonsForModule(moduleId, token);
    } catch {
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
    } catch {
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

