const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const announcementApi = {
  // Create a new announcement
  async createAnnouncement(data: {
    type: 'COHORT' | 'COURSE';
    cohortId?: string;
    courseId?: string;
    title: string;
    content: string;
    sendEmailNotification?: boolean;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create announcement');
      }

      return await response.json();
    } catch (error) {
      console.error('Create announcement error:', error);
      throw error;
    }
  },

  // Get announcements for the logged-in learner
  async getLearnerAnnouncements(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/learner?page=${page}&limit=${limit}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch learner announcements');
      }

      return await response.json();
    } catch (error) {
      console.error('Get learner announcements error:', error);
      throw error;
    }
  },

  // Get announcements for the logged-in instructor
  async getInstructorAnnouncements(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/instructor?page=${page}&limit=${limit}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch instructor announcements');
      }

      return await response.json();
    } catch (error) {
      console.error('Get instructor announcements error:', error);
      throw error;
    }
  },

  // Get announcements by cohort ID
  async getCohortAnnouncements(cohortId: string, page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/cohort/${cohortId}?page=${page}&limit=${limit}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch cohort announcements');
      }

      return await response.json();
    } catch (error) {
      console.error('Get cohort announcements error:', error);
      throw error;
    }
  },

  // Get announcements by course ID
  async getCourseAnnouncements(courseId: string, page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/course/${courseId}?page=${page}&limit=${limit}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch course announcements');
      }

      return await response.json();
    } catch (error) {
      console.error('Get course announcements error:', error);
      throw error;
    }
  },

  // Delete an announcement (Admin only)
  async deleteAnnouncement(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete announcement');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete announcement error:', error);
      throw error;
    }
  },

  // Get all announcements (Admin only - for management)
  async getAllAnnouncements(page = 1, limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/all?page=${page}&limit=${limit}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch all announcements');
      }

      return await response.json();
    } catch (error) {
      console.error('Get all announcements error:', error);
      throw error;
    }
  }
};
