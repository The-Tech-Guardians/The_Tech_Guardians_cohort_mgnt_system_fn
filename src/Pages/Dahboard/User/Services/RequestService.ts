// services/RequestService.ts

import { API_BASE_URL } from '../../../../config/api';

const API_URL = API_BASE_URL;

export interface CreateRequestData {
  title: string;
  description: string;
  type: 'REQUEST' | 'OFFER';
  location: string;
  categoryId: string;
}

export interface Request {
  id: string;
  userId: string;
  username?: string;
  categoryId: string;
  title: string;
  description: string;
  type: 'REQUEST' | 'OFFER';
  location: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminApproved: boolean;
  canOfferService: boolean;
  approvedBy?: string;
  approvedAt?: string;
  views: number;
  likes: number;
  likedBy: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RequestResponse {
  message: string;
  request?: Request;
  requests?: Request[];
  count?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

class RequestService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async createRequest(data: CreateRequestData): Promise<Request> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      console.log('📤 Creating request:', data);

      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create request');
      }

      console.log('✅ Request created:', responseData);
      return responseData.request;
    } catch (error: unknown) {
      console.error('❌ Error creating request:', error);
      throw error;
    }
  }

  async getAllRequests(type: 'REQUEST' | 'OFFER'): Promise<Request[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests?type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: RequestResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch requests');
      }

      return data.requests || [];
    } catch (error: unknown) {
      console.error('❌ Error fetching requests:', error);
      throw error;
    }
  }

  async getMyRequests(
    type?: 'REQUEST' | 'OFFER',
    status?: 'PENDING' | 'APPROVED' | 'REJECTED',
    page: number = 1,
    limit: number = 10
  ): Promise<RequestResponse> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      let url = `${API_BASE_URL}/requests/my-requests?page=${page}&limit=${limit}`;
      if (type) url += `&type=${type}`;
      if (status) url += `&status=${status}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: RequestResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch your requests');
      }

      return data;
    } catch (error: unknown) {
      console.error('❌ Error fetching my requests:', error);
      throw error;
    }
  }

  async getApprovedRequests(type: 'REQUEST' | 'OFFER'): Promise<Request[]> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/requests/approved?type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: RequestResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch approved requests');
      }

      return data.requests || [];
    } catch (error: unknown) {
      console.error('❌ Error fetching approved requests:', error);
      throw error;
    }
  }

  async getRequestById(id: string): Promise<Request> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch request');
      }

      return data.request;
    } catch (error: unknown) {
      console.error('❌ Error fetching request:', error);
      throw error;
    }
  }

  async updateRequest(id: string, updateData: Partial<CreateRequestData>): Promise<Request> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update request');
      }

      return data.request;
    } catch (error: unknown) {
      console.error('❌ Error updating request:', error);
      throw error;
    }
  }

  async deleteRequest(id: string): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete request');
      }

      console.log('✅ Request deleted');
    } catch (error: unknown) {
      console.error('❌ Error deleting request:', error);
      throw error;
    }
  }

  async likeRequest(requestId: string): Promise<number> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/requests/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to like request');
      }

      return data.likes;
    } catch (error: unknown) {
      console.error('❌ Error liking request:', error);
      throw error;
    }
  }

  async unlikeRequest(requestId: string): Promise<number> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/requests/unlike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unlike request');
      }

      return data.likes;
    } catch (error: unknown) {
      console.error('❌ Error unliking request:', error);
      throw error;
    }
  }

  async getRequestsByCategory(
    categoryId: string,
    type?: 'REQUEST' | 'OFFER',
    status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  ): Promise<Request[]> {
    try {
      let url = `${API_BASE_URL}/requests/category/${categoryId}`;
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (status) params.append('status', status);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch requests by category');
      }

      return data.requests || [];
    } catch (error: unknown) {
      console.error('❌ Error fetching requests by category:', error);
      throw error;
    }
  }

  async getRequestLikedBy(requestId: string): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/liked-by`, {
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

export default new RequestService();
