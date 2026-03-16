const API_BASE_URL = 'http://localhost:3000/api';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export const announcementService = {
  getLearnerAnnouncements: async () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/announcements/learner`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch announcements');
    
    return response.json();
  },
};
