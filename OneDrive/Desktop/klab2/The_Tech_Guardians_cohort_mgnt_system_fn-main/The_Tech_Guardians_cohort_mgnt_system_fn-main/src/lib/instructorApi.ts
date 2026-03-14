'use client'

import type { Course, Module, Lesson, Learner, ApiResponse } from '../types/instructor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const token = getToken();
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API call to: ${API_BASE_URL}${endpoint}`);
    console.log('Request config:', config);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(errorText || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result);
    return result;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return { success: false, message: (error as Error).message };
  }
};

// ── COHORTS ──
export const cohorts = {
  fetchCohorts: async () => {
    // Backend returns { cohorts: [...] } (see cohortController.listCohorts)
    const response = await apiCall<{ cohorts: any[] }>(`/cohorts`);
    return response.cohorts ?? [];
  },
};

// ── COURSES ──
export const courses = {
  fetchInstructorCourses: async (page = 1, limit = 20): Promise<Course[]> => {
    try {
      const response = await apiCall<{ courses: Course[] }>(`/courses/instructor/courses?page=${page}&limit=${limit}`);
      console.log('API Response for courses:', response);
      
      if (response.success === false) {
        console.error('API Error:', response.message);
        return [];
      }
      
      // Handle different response structures
      const coursesData = response.courses || response.data?.courses || response || [];
      console.log('Courses data extracted:', coursesData);
      return Array.isArray(coursesData) ? coursesData : [];
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      return [];
    }
  },
  fetchCourse: async (id: string): Promise<Course | null> => {
    const response = await apiCall<{ course: Course }>(`/courses/${id}`);
    return response.course ?? null;
  },
  createCourse: async (data: FormData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('Creating course with FormData:', Object.fromEntries(data.entries()));
      
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Course creation failed:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Course creation response:', result);
      return result;
    } catch (error) {
      console.error('Failed to create course:', error);
      return { success: false, message: (error as Error).message };
    }
  },
  updateCourse: async (
    id: string,
    data: Partial<{ title: string; description: string; courseType: string; cohortId: string; instructorId: string }>
  ) => {
    return apiCall(`/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
  deleteCourse: (id: string) => apiCall(`/courses/${id}`, { method: 'DELETE' }),
  publishCourse: (id: string) => apiCall(`/courses/${id}/publish`, { method: 'PATCH' }),
  getEnrolledLearners: async (courseId: string, page = 1, limit = 20) => {
    const response = await apiCall<{ learners: Learner[] }>(`/courses/${courseId}/learners?page=${page}&limit=${limit}`);
    return response.learners ?? [];
  },
};

// ── MODULES ──
export const modules = {
  fetchModulesByCourse: async (courseId: string) => {
    const response = await apiCall<{ modules: Module[] }>(`/modules/course/${courseId}`);
    return response.modules ?? [];
  },
  fetchModuleById: async (id: string) => {
    const response = await apiCall<{ module: Module }>(`/modules/${id}`);
    return response.module ?? null;
  },
  createModule: async (data: FormData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('Creating module with FormData:', Object.fromEntries(data.entries()));
      
      const response = await fetch(`${API_BASE_URL}/modules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Module creation failed:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Module creation response:', result);
      return result;
    } catch (error) {
      console.error('Failed to create module:', error);
      return { success: false, message: (error as Error).message };
    }
  },
  updateModule: (id: string, data: FormData) => fetch(`${API_BASE_URL}/modules/${id}`, { method: 'PUT', body: data }).then(r => r.json()),
  deleteModule: (id: string) => apiCall(`/modules/${id}`, { method: 'DELETE' }),
};

// ── LESSONS ──
export const lessons = {
  fetchLessonsByModule: async (moduleId: string) => {
    const response = await apiCall<{ lessons: Lesson[] }>(`/lessons/module/${moduleId}`);
    return response.lessons ?? [];
  },
  fetchLessonById: async (id: string) => {
    const response = await apiCall<{ lesson: Lesson }>(`/lessons/${id}`);
    return response.lesson ?? null;
  },
  createLesson: async (data: FormData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('Creating lesson with FormData:', Object.fromEntries(data.entries()));
      
      const response = await fetch(`${API_BASE_URL}/lessons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lesson creation failed:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Lesson creation response:', result);
      return result;
    } catch (error) {
      console.error('Failed to create lesson:', error);
      return { success: false, message: (error as Error).message };
    }
  },
  updateLesson: (id: string, data: FormData) => fetch(`${API_BASE_URL}/lessons/${id}`, { method: 'PUT', body: data }).then(r => r.json()),
  deleteLesson: (id: string) => apiCall(`/lessons/${id}`, { method: 'DELETE' }),
};

// ── LEARNERS ──
export const learners = {
  fetchAllLearners: async () => {
    try {
      // Get all courses for this instructor first
      const coursesResponse = await courses.fetchInstructorCourses();
      
      if (!coursesResponse || coursesResponse.length === 0) {
        return [];
      }
      
      // Get learners for each course and deduplicate
      const allLearners = [];
      const seenLearners = new Set();
      
      for (const course of coursesResponse) {
        try {
          const courseLearners = await apiCall<{ learners: Learner[] }>(`/courses/${course.id}/learners`);
          const learnersList = courseLearners.success ? (courseLearners as any).learners || [] : [];
          for (const learner of learnersList) {
            if (!seenLearners.has(learner.id)) {
              seenLearners.add(learner.id);
              allLearners.push(learner);
            }
          }
        } catch (error) {
          console.error(`Failed to fetch learners for course ${course.id}:`, error);
        }
      }
      
      return allLearners;
    } catch (error) {
      console.error('Failed to fetch all learners:', error);
      return [];
    }
  },
  fetchEnrolledLearners: async (courseId: string, page = 1, limit = 20) => {
    const response = await apiCall<{ learners: Learner[]; pagination?: any }>(`/courses/${courseId}/learners?page=${page}&limit=${limit}`);
    return response.learners ?? [];
  },
};

// ── PROGRESS (Instructor) ──
export const progress = {
  fetchCourseLearnerProgress: async (courseId: string, page = 1, limit = 20) => {
    const response = await apiCall<{ learnerProgress: any[]; pagination?: any }>(`/progress/instructor/course/${courseId}?page=${page}&limit=${limit}`);
    return response.learnerProgress ?? [];
  },
};

// ── ASSESSMENTS ──
export const assessments = {
  createAssignment: async (data: FormData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('Creating assignment with FormData:', Object.fromEntries(data.entries()));
      
      const response = await fetch(`${API_BASE_URL}/assessments/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Assignment creation failed:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Assignment creation response:', result);
      return result;
    } catch (error) {
      console.error('Failed to create assignment:', error);
      return { success: false, message: (error as Error).message };
    }
  },
  createQuiz: async (data: FormData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('Creating quiz with FormData:', Object.fromEntries(data.entries()));
      
      const response = await fetch(`${API_BASE_URL}/assessments/quizzes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Quiz creation failed:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Quiz creation response:', result);
      return result;
    } catch (error) {
      console.error('Failed to create quiz:', error);
      return { success: false, message: (error as Error).message };
    }
  },
  fetchAssessmentsByModule: async (moduleId: string, page = 1, limit = 20) => {
    const response = await apiCall<{ assessments: any[] }>(`/assessments/module/${moduleId}?page=${page}&limit=${limit}`);
    return response.assessments ?? [];
  },
};

// ── MODERATION ──
export const moderation = {
  fetchBanRequests: () => apiCall(`/moderation/ban-requests`),
  approveBanRequest: (id: string) => apiCall(`/moderation/ban-requests/${id}/approve`, { method: 'POST' }),
  denyBanRequest: (id: string, feedback: string) => apiCall(`/moderation/ban-requests/${id}/deny`, {
    method: 'POST',
    body: JSON.stringify({ feedback }),
  }),
};

// ── ANALYTICS ──
export const analytics = {
  fetchInstructorAnalytics: async (timeRange: '7d' | '30d' | '90d' = '30d') => {
    const response = await apiCall<{ analytics: any }>(`/analytics/instructor?timeRange=${timeRange}`);
    return response.analytics ?? {};
  },
};

export default {
  cohorts,
  courses,
  modules,
  lessons,
  learners,
  progress,
  assessments,
  moderation,
  analytics,
};

