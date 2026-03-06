import axios from 'axios';
import { User, InvitationRequest } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userApi = {
  listUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    return data.users;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const { data } = await api.get('/users/Search', { params: { query } });
    return data.users;
  },

  createInvitation: async (invitation: InvitationRequest) => {
    const { data } = await api.post('/users/Invite', invitation);
    return data;
  },

  deleteUser: async (uuid: string) => {
    const { data } = await api.delete(`/users/${uuid}`);
    return data;
  },

  updateUser: async (uuid: string, updates: Partial<User> & { admin_id?: string }) => {
    const { data } = await api.put(`/users/${uuid}`, updates);
    return data;
  },
};
