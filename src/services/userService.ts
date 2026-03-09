// User Service - API interactions for User Management

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  cohortId?: string;
  status?: string;
  createdAt?: string;
}

// Helper to get auth token - checks both keys for compatibility
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

export const userService = {
  // Get all users (Admin only)
  async getAllUsers(): Promise<User[]> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await handleResponse(response);
      return data.users || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  // Search users (Admin only)
  async searchUsers(query: string): Promise<User[]> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/users/Search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await handleResponse(response);
      return data.users || [];
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(
    uuid: string,
    updates: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      role: string;
    }>
  ): Promise<User> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/users/${uuid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await handleResponse(response);
      return data.user || data;
    } catch (error) {
      console.error(`Failed to update user ${uuid}:`, error);
      throw error;
    }
  },

  // Delete user (Admin only)
  async deleteUser(uuid: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/users/${uuid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await handleResponse(response);
    } catch (error) {
      console.error(`Failed to delete user ${uuid}:`, error);
      throw error;
    }
  },

  // Invite user (Admin only)
  async inviteUser(email: string, role: string, cohort_id?: string): Promise<any> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/users/Invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
          cohort_id,
        }),
      });
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Failed to invite user:', error);
      throw error;
    }
  },
};

