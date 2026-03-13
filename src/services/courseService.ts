const API_BASE_URL = 'http://localhost:3000/api';

export const formatCourseType = (type: string): string => {
  const formatted: { [key: string]: string } = {
    COMPUTER_PROGRAMMING: 'Computer Programming',
    SOCIAL_MEDIA_BRANDING: 'Social Media Branding',
    ENTREPRENEURSHIP: 'Entrepreneurship',
    TEAM_MANAGEMENT: 'Team Management',
    SRHR: 'SRHR',
  };
  return formatted[type] || type;
};

import { BackendCourse, Course, ExtendedCourse } from '@/types/course';

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  releaseWeek: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: 'video' | 'pdf' | 'text';
  contentUrl: string;
  contentBody: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  totalQuestions: number;
  timeLimit?: number;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

// Instructor interface for course creation
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
}

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('auth_token');
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || localStorage.getItem('token') : null;

    if (!token) {
      throw new Error('Authentication required');
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

      // Backend returns { success: true, data: [...], message: "..." }
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
      console.error('Course fetch error:', err);
      throw new Error(err.message || 'Failed to fetch courses');
    }
  },

  async getLearnerCohortCourses(
    page: number = 1,
    limit: number = 10
  ): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || localStorage.getItem('token') : null;

    if (!token) {
      throw new Error('Authentication required');
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
        throw new Error(errorData.error || 'Failed to fetch courses');
      }

      const data: ApiResponse<Course> = await response.json();

      return {
        courses: data.courses || [],
        pagination: data.pagination || {
          page,
          limit,
          total: data.courses?.length || 0,
          pages: 1,
        },
      };
    } catch (error) {
      const err = error as Error;
      console.error('Course fetch error:', err);
      throw new Error(err.message || 'Failed to fetch courses');
    }
  },

  async getCourseById(id: string): Promise<{ course: Course }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || localStorage.getItem('token') : null;

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

      if (!data.course) {
        throw new Error('Course not found');
      }

      return { course: data.course };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to fetch course');
    }
  },

  async getCourseWithModulesAndLessons(courseId: string): Promise<{ course: Course; modules: Module[]; lessons: Lesson[] }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || localStorage.getItem('token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const courseUrl = `${API_BASE_URL}/courses/${courseId}`;
      const modulesUrl = `${API_BASE_URL}/modules/course/${courseId}`;
      
      console.log('Fetching course from:', courseUrl);
      console.log('Fetching modules from:', modulesUrl);

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
        console.error('Course fetch error:', courseRes.status, errorData);
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
          console.error(`Failed to fetch lessons for module ${mod.id}:`, err);
        }
      }

      return {
        course: courseData.course,
        modules,
        lessons: allLessons,
      };
    } catch (error) {
      const err = error as Error;
      console.error('getCourseWithModulesAndLessons error:', err);
      throw new Error(err.message || 'Failed to fetch course details');
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
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      const data = await handleResponse(response);
      return { 
        courses: data.courses || [], 
        pagination: data.pagination || { page, limit, total: 0, pages: 0 }
      };
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      return { courses: [], pagination: { page, limit, total: 0, pages: 0 } };
    }
  },

  // Legacy method for backward compatibility
  async getAllCoursesLegacy(
    page: number = 1,
    limit: number = 20
  ): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || localStorage.getItem('token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/courses?page=${page}&limit=${limit}`,
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
        throw new Error(errorData.error || 'Failed to fetch courses');
      }

      const data: ApiResponse<Course> = await response.json();

      return {
        courses: data.courses || [],
        pagination: data.pagination || {
          page,
          limit,
          total: data.courses?.length || 0,
          pages: 1,
        },
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to fetch courses');
    }
  },

  // Create a new course
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
      console.error('Failed to create course:', error);
      throw error;
    }
  },

  // Update a course
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
      console.error(`Failed to update course ${id}:`, error);
      throw error;
    }
  },

  // Delete a course
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
      console.error(`Failed to delete course ${id}:`, error);
      throw error;
    }
  },

  // Publish a course
  async publishCourse(id: string): Promise<BackendCourse | null> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${API_BASE_URL}/courses/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await handleResponse(response);
      return data.course || data || null;
    } catch (error) {
      console.error(`Failed to publish course ${id}:`, error);
      throw error;
    }
  },

  // Toggle publish status
  async togglePublish(id: string): Promise<BackendCourse | null> {
    return this.publishCourse(id);
  },

  // Get instructors for course creation
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
      console.error('Failed to fetch instructors:', error);
      return { instructors: [], pagination: { page, limit, total: 0, pages: 0 } };
    }
  },

  // Get modules by course ID for learner course details
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
      console.error(`Failed to fetch modules for course ${courseId}:`, error);
      return [];
    }
  },

  // Get lessons by module ID for learner course details
  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
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
      console.error(`Failed to fetch lessons for module ${moduleId}:`, error);
      return [];
    }
  },

  // Get assessments by course ID for learner course details
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
      console.error(`Failed to fetch assessments for course ${courseId}:`, error);
      return [];
    }
  },
};

// Helper function to format course type for display
export const formatCourseTypeDisplay = (courseType: string | undefined | null): string => {
  if (!courseType) {
    return 'Unknown Type';
  }
  return courseType.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Helper function to format course type for API
export const formatCourseTypeForAPI = (displayType: string): string => {
  return displayType.toUpperCase().replace(/ /g, '_');
};

