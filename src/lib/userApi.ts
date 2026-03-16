import { User, InvitationRequest } from '@/types/user';
import type { ApiResponse } from '@/lib/api';
import { apiFetch, post, put, del } from '@/lib/api';

export const userApi = {
  listUsers: async (): Promise<User[]> => {
    const data: ApiResponse<User[]> = await apiFetch('/users');
    return data.users || [];
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const endpoint = `/users/Search?query=${encodeURIComponent(query)}`;
    const data: ApiResponse<User[]> = await apiFetch(endpoint);
    return data.users || [];
  },

  createInvitation: async (invitation: InvitationRequest): Promise<any> => {
    return post('/users/Invite', invitation);
  },

  deleteUser: async (uuid: string): Promise<any> => {
    return del(`/users/${uuid}`);
  },

  updateUser: async (uuid: string, updates: Partial<User> & { admin_id?: string }): Promise<any> => {
    return put(`/users/${uuid}`, updates);
  },
};

