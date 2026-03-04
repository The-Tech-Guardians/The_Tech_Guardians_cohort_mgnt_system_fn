import { API_BASE_URL } from '../../../../config/api';

const API_URL = API_BASE_URL;

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  user: {
    id: string;
    name: string;
    email: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

class MessageService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      return data.conversations || [];
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  }

  async getMessages(userId: string): Promise<Message[]> {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      return data.messages || [];
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  async markAsRead(userId: string): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Not authenticated');

      await fetch(`${API_BASE_URL}/messages/read/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  }
  async getAllUsers(): Promise<{ id: string; name: string; email: string }[]> {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/messages/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      return data.users || [];
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }
}

export default new MessageService();
