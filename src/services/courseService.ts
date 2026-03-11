// Course Service - Fetch course, modules, lessons, and assessments

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Backend course interface (matches API response)
export interface BackendCourse {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  cohortId: string;
  courseType: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  cohortId: string;
  courseType: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: 'video' | 'pdf' | 'text';
  contentBody: string;
  videoUrl?: string;
  fileUrl?: string;
  orderIndex: number;
  createdAt: string;
}

export interface Assessment {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: 'QUIZ' | 'ASSIGNMENT';
  passMark?: number;
  retakeLimit?: number;
  timeLimitMinutes?: number;
  instantFeedback?: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  assessmentId: string;
  questionText: string;
  type: string;
  points?: number;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

// Instructor interface for course creation
export interface Instructor {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
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
  // Get all courses
  async getAllCourses(page: number = 1, limit: number = 10): Promise<{ courses: BackendCourse[]; pagination: any }> {
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

  // Get course by ID
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      const data = await handleResponse(response);
      return data.course || data || null;
    } catch (error) {
      console.error(`Failed to fetch course ${id}:`, error);
      return null;
    }
  },

  // Get modules for a course
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/modules?courseId=${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      const data = await handleResponse(response);
      return data.modules || data || [];
    } catch (error) {
      console.error(`Failed to fetch modules for course ${courseId}:`, error);
      return [];
    }
  },

  // Get lessons for a module
  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/lessons?moduleId=${moduleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      const data = await handleResponse(response);
      return data.lessons || data || [];
    } catch (error) {
      console.error(`Failed to fetch lessons for module ${moduleId}:`, error);
      return [];
    }
  },

  // Get assessments for a module
  async getAssessmentsByModule(moduleId: string): Promise<Assessment[]> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/assessments?moduleId=${moduleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      const data = await handleResponse(response);
      return data.assessments || data || [];
    } catch (error) {
      console.error(`Failed to fetch assessments for module ${moduleId}:`, error);
      return [];
    }
  },

  // Get all assessments for a course
  async getAssessmentsByCourse(courseId: string): Promise<Assessment[]> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/assessments?courseId=${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      const data = await handleResponse(response);
      return data.assessments || data || [];
    } catch (error) {
      console.error(`Failed to fetch assessments for course ${courseId}:`, error);
      return [];
    }
  },

  // Get questions for an assessment
  async getQuestionsByAssessment(assessmentId: string): Promise<Question[]> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/questions?assessmentId=${assessmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      const data = await handleResponse(response);
      return data.questions || data || [];
    } catch (error) {
      console.error(`Failed to fetch questions for assessment ${assessmentId}:`, error);
      return [];
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
  async publishCourse(id: string): Promise<boolean> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${API_BASE_URL}/courses/${id}/publish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(`Failed to publish course ${id}:`, error);
      throw error;
    }
  },

  // Toggle publish status
  async togglePublish(id: string): Promise<boolean> {
    return this.publishCourse(id);
  },

  // Get instructors for course creation
  async getInstructors(page: number = 1, limit: number = 20, search?: string): Promise<{ instructors: Instructor[]; pagination: any }> {
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
};

// Helper function to format course type for display
export const formatCourseType = (courseType: string | undefined | null): string => {
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