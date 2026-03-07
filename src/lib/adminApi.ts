const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface DashboardStats {
  totalUsers: number;
  totalCohorts: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsers: number;
  instructors: number;
  admins: number;
  activeCohorts: number;
  completedEnrollments: number;
  completionRate: number;
}

export interface User {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  status: 'active' | 'banned';
  createdAt: string;
  twoFAEnabled?: boolean;
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
  modules?: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  users?: T;
  courses?: T;
  stats?: T;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const adminApi = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data: ApiResponse<DashboardStats> = await response.json();
      return data.data || ({} as DashboardStats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  },

  // Users
  async listUsers(page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: ApiResponse<User[]> = await response.json();
      return {
        data: data.users || [],
        pagination: {
          page,
          limit,
          total: (data.users as any)?.length || 0,
          pages: 1,
        },
      };
    } catch (error) {
      console.error('List users error:', error);
      throw error;
    }
  },

  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/Search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const data: ApiResponse<User[]> = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  },

  async updateUser(
    uuid: string,
    updates: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      status: string;
    }>
  ): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uuid}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data: ApiResponse<User> = await response.json();
      return data.data || ({} as User);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  async deleteUser(uuid: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uuid}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  async inviteUser(email: string, role: string, cohort_id?: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/Invite`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          email,
          role,
          cohort_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to invite user');
      }

      const data: ApiResponse<User> = await response.json();
      return data.data || ({} as User);
    } catch (error) {
      console.error('Invite user error:', error);
      throw error;
    }
  },

  // Courses
  async listCourses(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Course>> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data: any = await response.json();
      return {
        data: data.courses || [],
        pagination: data.pagination || {
          page,
          limit,
          total: data.courses?.length || 0,
          pages: 1,
        },
      };
    } catch (error) {
      console.error('List courses error:', error);
      throw error;
    }
  },

  async createCourse(courseData: {
    title: string;
    description: string;
    instructorId: string;
    cohortId: string;
    courseType: string;
  }): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const data: ApiResponse<Course> = await response.json();
      return data.data || ({} as Course);
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  },

  async updateCourse(
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      courseType: string;
      isPublished: boolean;
    }>
  ): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const data: ApiResponse<Course> = await response.json();
      return data.data || ({} as Course);
    } catch (error) {
      console.error('Update course error:', error);
      throw error;
    }
  },

  async deleteCourse(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  },

  async publishCourse(id: string): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}/publish`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to publish course');
      }

      const data: ApiResponse<Course> = await response.json();
      return data.data || ({} as Course);
    } catch (error) {
      console.error('Publish course error:', error);
      throw error;
    }
  },
};
