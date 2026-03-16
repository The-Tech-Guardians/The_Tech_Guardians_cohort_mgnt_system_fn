// Lesson Service - API interactions for Lesson Management

import { BackendLesson, LessonFormData } from '@/types/lesson';
import { moduleService, Module } from './moduleService';
import { courseService } from './courseService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || localStorage.getItem('token');
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

export const lessonService = {
  // Get all lessons (paginated - assumes backend supports page/limit on /lessons)
  async getAllLessons(page: number = 1, limit: number = 100): Promise<{ lessons: BackendLesson[]; pagination: any }> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/lessons?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return { 
        lessons: data.lessons || data || [], 
        pagination: data.pagination || { page, limit, total: 0, pages: 0 }
      };
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      throw error;
    }
  },

  // Get lessons for a module
  async getLessonsByModule(moduleId: string): Promise<BackendLesson[]> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/lessons/module/${moduleId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data.lessons || [];
    } catch (error) {
      console.error(`Failed to fetch lessons for module ${moduleId}:`, error);
      throw error;
    }
  },

  // Get single lesson
  async getLessonById(id: string): Promise<BackendLesson | null> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data.lesson || null;
    } catch (error) {
      console.error(`Failed to fetch lesson ${id}:`, error);
      return null;
    }
  },

  // Create lesson (supports file upload via FormData)
  async createLesson(formData: FormData): Promise<BackendLesson> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/lessons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,  // FormData - no Content-Type
      });
      const data = await handleResponse(response);
      return data.lesson;
    } catch (error) {
      console.error('Failed to create lesson:', error);
      throw error;
    }
  },

  // Update lesson (supports file upload)
  async updateLesson(id: string, formData: FormData): Promise<BackendLesson> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await handleResponse(response);
      return data.lesson;
    } catch (error) {
      console.error(`Failed to update lesson ${id}:`, error);
      throw error;
    }
  },

  // Delete lesson
  async deleteLesson(id: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      await handleResponse(response);
    } catch (error) {
      console.error(`Failed to delete lesson ${id}:`, error);
      throw error;
    }
  },

  // Get modules for dropdown (reuse)
  async getModules(): Promise<Module[]> {
    // Aggregate all modules across courses - simplistic, enhance if needed
    try {
      const courses = await courseService.getAllCourses(1, 50).then(r => r.courses);
      const modules: Module[] = [];
      for (const course of courses) {
        const courseModules = await moduleService.getModulesByCourse(course.id);
        modules.push(...courseModules);
      }
      return modules;
    } catch {
      return [];
    }
  },
};

