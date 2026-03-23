// Notification service for API interactions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'announcement' | 'course' | 'assignment' | 'grade' | 'system';
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UnreadCountResponse {
  unreadCount: number;
}

const getAuthHeaders = (): HeadersInit => {
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' };
  }
  const token = localStorage.getItem('auth_token');
  console.log('[NotificationService] Token:', token ? 'present' : 'MISSING');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const notificationService = {
  // Get all notifications for the current user
  getNotifications: async (page: number = 1, limit: number = 20): Promise<NotificationsResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/notifications?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    
    return response.json();
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/notifications/unread-count`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      }
    );
    
    if (!response.ok) {
      // Suppress console noise
      return { unreadCount: 0 };
    }
    
    return response.json();
  },

  // Mark a single notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/notifications/read-all`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  },
};

