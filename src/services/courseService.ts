// services/courseService.ts
const API_BASE_URL = 'http://localhost:3000/api';

export interface BackendCourse {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  cohortId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  courseType: 'SOCIAL_MEDIA_BRANDING' | 'COMPUTER_PROGRAMMING' | 'ENTREPRENEURSHIP' | 'TEAM_MANAGEMENT' | 'SRHR';
}

export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  courseId?: string;
}

export interface Lesson {
  id: number;
  title: string;
  type: "video" | "pdf" | "text";
  duration: string;
  moduleId?: number;
  content?: string;
}

// Extended Course interface for frontend use
export interface Course extends Omit<BackendCourse, 'title' | 'courseType'> {
  name: string; // alias for title
  type: string; // formatted courseType
  modules: Module[];
  assessments: number;
  status: "draft" | "published"; // derived from isPublished
}

export interface ApiResponse<T> {
  message?: string;
  course?: T;
  courses?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

export const courseService = {
  // Get all courses with pagination
  async getAllCourses(page = 1, limit = 20): Promise<{ courses: BackendCourse[]; pagination: any }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/courses?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await handleResponse(response);
    return {
      courses: data.courses || [],
      pagination: data.pagination || { page, limit, total: 0, pages: 0 }
    };
  },

  // Get course by ID
  async getCourseById(id: string): Promise<{ course: BackendCourse }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await handleResponse(response);
    return { course: data.course || data };
  },

  // Create a new course
  async createCourse(courseData: {
    title: string;
    description: string;
    instructorId: string;
    cohortId: string;
    courseType: string;
  }): Promise<{ course: BackendCourse }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    const data = await handleResponse(response);
    return { course: data.course || data };
  },

  // Update a course
  async updateCourse(id: string, courseData: {
    title?: string;
    description?: string;
    courseType?: string;
  }): Promise<{ course: BackendCourse }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    const data = await handleResponse(response);
    return { course: data.course || data };
  },

  // Delete a course
  async deleteCourse(id: string): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    await handleResponse(response);
  },

  // Publish/unpublish a course
  async togglePublish(id: string): Promise<{ course: BackendCourse }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/courses/${id}/publish`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await handleResponse(response);
    return { course: data.course || data };
  },

  // Get enrolled learners
  async getEnrolledLearners(id: string, page = 1, limit = 20): Promise<any> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/courses/${id}/learners?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
};

// Helper function to format course type for display
export const formatCourseType = (courseType: string): string => {
  return courseType.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Helper function to format course type for API
export const formatCourseTypeForAPI = (displayType: string): string => {
  return displayType.toUpperCase().replace(/ /g, '_');
};