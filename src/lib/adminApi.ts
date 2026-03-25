const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  cohortId?: string;
  twoFaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
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
  orderIndex?: number;
  releaseWeek?: number;
}

export interface Lesson {
  id: string;
  title: string;
  moduleId: string;
  contentType: 'video' | 'pdf' | 'text';
  contentBody?: string;
  orderIndex: number;
  fileUrl?: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  users?: T;
  courses?: T;
  stats?: T;
  lessons?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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
    // Check both 'auth_token' (preferred) and 'token' for backward compatibility
    return localStorage.getItem('auth_token') || localStorage.getItem('token');
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

  async searchUsers(query: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      return await response.json();
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
  
  // Assessments - Get all assessments from all instructors
  async getAllAssessments(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/assessments`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        console.warn('Admin assessments endpoint not available:', response.status);
        return [];
      }

      const data = await response.json();
      return data.assessments || data.data || data;
    } catch (error) {
      console.error('Failed to fetch admin assessments:', error);
      return [];
    }
  },

  async deleteAssessment(assessmentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/assessments/${assessmentId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      return false;
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
        method: 'PATCH',
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

  // Modules - Get modules for a specific course
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/course/${courseId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }

      const data = await response.json();
      return data.modules || [];
    } catch (error) {
      console.error('Get modules error:', error);
      throw error;
    }
  },

  // Modules - Get single module
  async getModuleById(id: string): Promise<Module | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch module');
      }

      const data = await response.json();
      return data.module || null;
    } catch (error) {
      console.error('Get module error:', error);
      throw error;
    }
  },

  // Modules - Create module
  async createModule(moduleData: {
    courseId: string;
    title: string;
    description?: string;
    orderIndex: number;
    releaseWeek: number;
  }): Promise<Module> {
    try {
      const response = await fetch(`${API_BASE_URL}/modules`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(moduleData),
      });

      if (!response.ok) {
        throw new Error('Failed to create module');
      }

      const data = await response.json();
      return data.module || ({} as Module);
    } catch (error) {
      console.error('Create module error:', error);
      throw error;
    }
  },

  // Modules - Update module
  async updateModule(
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      orderIndex: number;
      releaseWeek: number;
    }>
  ): Promise<Module> {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update module');
      }

      const data = await response.json();
      return data.module || ({} as Module);
    } catch (error) {
      console.error('Update module error:', error);
      throw error;
    }
  },

  // Modules - Delete module
async deleteModule(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete module');
      }
    } catch (error) {
      console.error('Delete module error:', error);
      throw error;
    }
  },

  // Lessons
async getLessonsByModule(moduleId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Lesson>> {
    try {
      const response = await fetch(`${API_BASE_URL}/lessons/module/${moduleId}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }

const data = await response.json() as ApiResponse<Lesson[]>;
      return {
        data: data.data || data.lessons || [],
        pagination: data.pagination || { page, limit, total: 0, pages: 1 },
      };
    } catch (error) {
      console.error('Get lessons error:', error);
      throw error;
    }
  },

  async createLesson(lessonData: FormData): Promise<Lesson> {
    try {
      const headers = new Headers(getHeaders());
      headers.delete('Content-Type'); // Let browser set for FormData

      const response = await fetch(`${API_BASE_URL}/lessons`, {
        method: 'POST',
        headers,
        body: lessonData,
      });

      if (!response.ok) {
        throw new Error('Failed to create lesson');
      }

      const data: ApiResponse<Lesson> = await response.json();
      return data.data || ({} as Lesson);
    } catch (error) {
      console.error('Create lesson error:', error);
      throw error;
    }
  },

  async updateLesson(id: string, lessonData: FormData): Promise<Lesson> {
    try {
      const headers = new Headers(getHeaders());
      headers.delete('Content-Type');

      const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        method: 'PUT',
        headers,
        body: lessonData,
      });

      if (!response.ok) {
        throw new Error('Failed to update lesson');
      }

      const data: ApiResponse<Lesson> = await response.json();
      return data.data || ({} as Lesson);
    } catch (error) {
      console.error('Update lesson error:', error);
      throw error;
    }
  },

  async deleteLesson(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }
    } catch (error) {
      console.error('Delete lesson error:', error);
      throw error;
    }
  },

  // Invitation Management
  async getInvitations(page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/invitations?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get invitations error:', error);
      throw error;
    }
  },

  async getInvitationStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/invitations/stats`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invitation stats');
      }

      const data = await response.json();
      return data; // Return the data directly, not data.stats
    } catch (error) {
      console.error('Get invitation stats error:', error);
      throw error;
    }
  },

  async renewInvitation(invitationId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/invitations/${invitationId}/renew`, {
        method: 'POST',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to renew invitation');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Renew invitation error:', error);
      throw error;
    }
  },

  async resendInvitation(invitationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/invitations/${invitationId}/resend`, {
        method: 'POST',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to resend invitation');
      }
    } catch (error) {
      console.error('Resend invitation error:', error);
      throw error;
    }
  },

  async cancelInvitation(invitationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel invitation');
      }
    } catch (error) {
      console.error('Cancel invitation error:', error);
      throw error;
    }
  },

  // Email Management
  async getAdminEmails(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/admins/emails`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin emails');
      }

      const data = await response.json();
      return data.emails || [];
    } catch (error) {
      console.error('Get admin emails error:', error);
      return [];
    }
  },

  // Moderation Management
  async getModerationReports(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);

      const response = await fetch(`${API_BASE_URL}/moderation/reports?${queryParams}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch moderation reports');
      }

      return await response.json();
    } catch (error) {
      console.error('Get moderation reports error:', error);
      throw error;
    }
  },

  async reviewModerationReport(reportId: string, data: {
    status: string;
    banDuration?: number;
    reviewNote?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/moderation/reports/${reportId}/review`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to review moderation report');
      }

      return await response.json();
    } catch (error) {
      console.error('Review moderation report error:', error);
      throw error;
    }
  },

  async getUserReports(userId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${API_BASE_URL}/moderation/users/${userId}/reports?${queryParams}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user reports');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user reports error:', error);
      throw error;
    }
  },

  async approveInstructorBan(reportId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/moderation/reports/${reportId}/instructor-approve`, {
        method: 'POST',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to approve instructor ban');
      }

      return await response.json();
    } catch (error) {
      console.error('Approve instructor ban error:', error);
      throw error;
    }
  },

  async denyInstructorBan(reportId: string, reason?: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/moderation/reports/${reportId}/instructor-deny`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to deny instructor ban');
      }

      return await response.json();
    } catch (error) {
      console.error('Deny instructor ban error:', error);
      throw error;
    }
  },

  async submitModerationFeedback(feedback: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/moderation/feedback`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      return await response.json();
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  async getPendingInstructorApprovals(params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${API_BASE_URL}/moderation/pending-approvals?${queryParams}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending instructor approvals');
      }

      return await response.json();
    } catch (error) {
      console.error('Get pending instructor approvals error:', error);
      throw error;
    }
  },

  async directBanUser(userId: string, data: {
    reason: string;
    banDuration?: number;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/moderation/direct-ban/${userId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to direct ban user');
      }

      return await response.json();
    } catch (error) {
      console.error('Direct ban user error:', error);
      throw error;
    }
  },

  async sendEmail(emailData: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(emailData),
      });

      return response.ok;
    } catch (error) {
      console.error('Send email error:', error);
      return false;
    }
  },

  async sendBulkEmail(emailData: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/send-bulk`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(emailData),
      });

      return response.ok;
    } catch (error) {
      console.error('Send bulk email error:', error);
      return false;
    }
  },

  // Get all cohorts
  async getCohorts() {
    try {
      const response = await fetch(`${API_BASE_URL}/cohorts`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cohorts');
      }

      return await response.json();
    } catch (error) {
      console.error('Get cohorts error:', error);
      throw error;
    }
  },

  // Get all courses
  async getCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      return await response.json();
    } catch (error) {
      console.error('Get courses error:', error);
      throw error;
    }
  },
};
