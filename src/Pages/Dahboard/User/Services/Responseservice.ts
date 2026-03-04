import { API_BASE_URL } from '../../../../config/api';

const API_URL = API_BASE_URL;

export interface CreateResponseData {
  requestId: string;
  content: string;
}

export interface Response {
  id: string;
  requestId: string;
  userId: string;
  content: string;
  status: 'VISIBLE' | 'HIDDEN';
  views: number;
  likes: number;
  likedBy: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseResponse {
  message: string;
  data?: Response | Response[];
}

class ResponseService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async createResponse(data: CreateResponseData): Promise<Response> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      console.log('📤 Creating response:', data);

      const response = await fetch(`${API_BASE_URL}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create response');
      }

      console.log('✅ Response created:', responseData);
      return responseData.data;
    } catch (error: unknown) {
      console.error('❌ Error creating response:', error);
      throw error;
    }
  }

  async getResponsesByRequest(requestId: string): Promise<Response[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/responses/request/${requestId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: ResponseResponse = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }

      return Array.isArray(data.data) ? data.data : [];
    } catch (error: unknown) {
      console.error('❌ Error fetching responses:', error);
      throw error;
    }
  }

  async getResponsesByRequestAuth(requestId: string): Promise<Response[]> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/responses/request/${requestId}/auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: ResponseResponse = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }

      return Array.isArray(data.data) ? data.data : [];
    } catch (error: unknown) {
      console.error('❌ Error fetching responses:', error);
      throw error;
    }
  }

  async getMyResponses(): Promise<Response[]> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/responses/my-responses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        console.warn('⚠️ /my-responses endpoint not found. Returning empty array.');
        return [];
      }

      const data: ResponseResponse = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch your responses');
      }

      return Array.isArray(data.data) ? data.data : [];
    } catch (error: unknown) {
      console.error('❌ Error fetching my responses:', error);

      if (error instanceof Error && (error.message?.includes('404') || error.message?.includes('Not Found'))) {
        console.warn('⚠️ Endpoint not available. Returning empty responses.');
        return [];
      }
      return [];
    }
  }

  async updateResponse(id: string, content: string): Promise<Response> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/responses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update response');
      }

      return data.data;
    } catch (error: unknown) {
      console.error('❌ Error updating response:', error);
      throw error;
    }
  }

  async deleteResponse(id: string): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/responses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete response');
      }

      console.log('✅ Response deleted');
    } catch (error: unknown) {
      console.error('❌ Error deleting response:', error);
      throw error;
    }
  }

  async likeResponse(responseId: string): Promise<number> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/responses/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ responseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to like response');
      }

      return data.likes;
    } catch (error: unknown) {
      console.error('❌ Error liking response:', error);
      throw error;
    }
  }

  async unlikeResponse(responseId: string): Promise<number> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/responses/unlike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ responseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unlike response');
      }

      return data.likes;
    } catch (error: unknown) {
      console.error('❌ Error unliking response:', error);
      throw error;
    }
  }

  async getResponseLikedBy(responseId: string): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/responses/${responseId}/liked-by`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch liked by users');
      }

      return data.users || [];
    } catch (error: unknown) {
      console.error('❌ Error fetching liked by users:', error);
      return [];
    }
  }
}

export default new ResponseService();
