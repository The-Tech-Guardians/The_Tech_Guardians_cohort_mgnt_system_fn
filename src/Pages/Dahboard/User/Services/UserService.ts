import { API_BASE_URL } from '../../../../config/api';

const API_URL = API_BASE_URL;

class UserService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  }

  async getUserById(userId: string): Promise<{ id: string; name: string } | null> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        console.warn('No auth token found for getUserById');
        return { id: userId, name: 'Anonymous User' };
      }

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch user ${userId}: ${response.status}`);
        return { id: userId, name: 'Anonymous User' };
      }

      const data = await response.json();
      console.log('User data fetched:', data);
      return { id: data.user?.id || userId, name: data.user?.name || 'Anonymous User' };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { id: userId, name: 'Anonymous User' };
    }
  }
}

export default new UserService();
