import axios from 'axios';
import { API_BASE_URL } from '../../../../config/api';

const API_URL = API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage');
  }
  return { Authorization: `Bearer ${token}` };
};

// Users Management
export const getUsers = async (page = 1, limit = 10) => {
  try {
    const { data } = await axios.get(`${API_URL}/admin/users`, { 
      headers: getAuthHeaders(),
      params: { page, limit }
    });
    return data;
  } catch (error: any) {
    console.error('getUsers error:', error.response?.data || error.message);
    throw error;
  }
};

export const banUser = async (userId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/admin/users/${userId}/ban`, 
      { banType: 'permanent', reason: 'Banned by admin' }, 
      { headers: getAuthHeaders() }
    );
    return data;
  } catch (error: any) {
    console.error('banUser error:', error.response?.data || error.message);
    throw error;
  }
};

export const unbanUser = async (userId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/admin/users/${userId}/unban`, {}, { headers: getAuthHeaders() });
    return data;
  } catch (error: any) {
    console.error('unbanUser error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: string) => {
  try {
    const { data } = await axios.put(`${API_URL}/admin/users/${userId}/role`, { role }, { headers: getAuthHeaders() });
    return data;
  } catch (error: any) {
    console.error('updateUserRole error:', error.response?.data || error.message);
    throw error;
  }
};

// Requests Management
export const getRequests = async (page = 1, limit = 10) => {
  try {
    const { data } = await axios.get(`${API_URL}/requests`, { 
      headers: getAuthHeaders(),
      params: { type: 'REQUEST', page, limit }
    });
    return data;
  } catch (error: any) {
    console.error('getRequests error:', error.response?.data || error.message);
    throw error;
  }
};

export const approveRequest = async (requestId: string) => {
  try {
    const { data } = await axios.patch(`${API_URL}/requests/approve`, { requestId }, { headers: getAuthHeaders() });
    return data;
  } catch (error: any) {
    console.error('approveRequest error:', error.response?.data || error.message);
    throw error;
  }
};

export const rejectRequest = async (requestId: string) => {
  try {
    const { data } = await axios.patch(`${API_URL}/requests/reject`, { requestId }, { headers: getAuthHeaders() });
    return data;
  } catch (error: any) {
    console.error('rejectRequest error:', error.response?.data || error.message);
    throw error;
  }
};

// Abuse Reports
export const getAbuseReports = async (page = 1, limit = 10) => {
  try {
    const { data } = await axios.get(`${API_URL}/admin/abuse-reports`, { 
      headers: getAuthHeaders(),
      params: { page, limit }
    });
    return data;
  } catch (error: any) {
    console.error('getAbuseReports error:', error.response?.data || error.message);
    throw error;
  }
};

export const resolveAbuseReport = async (reportId: string) => {
  try {
    const { data } = await axios.put(`${API_URL}/admin/abuse-reports/${reportId}/resolve`, {}, { headers: getAuthHeaders() });
    return data;
  } catch (error: any) {
    console.error('resolveAbuseReport error:', error.response?.data || error.message);
    throw error;
  }
};

export const reopenAbuseReport = async (reportId: string) => {
  try {
    const { data } = await axios.put(`${API_URL}/admin/abuse-reports/${reportId}/reopen`, {}, { headers: getAuthHeaders() });
    return data;
  } catch (error: any) {
    console.error('reopenAbuseReport error:', error.response?.data || error.message);
    throw error;
  }
};

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/admin/analytics/dashboard`, { headers: getAuthHeaders() });
    return data;
  } catch (error: any) {
    console.error('getDashboardStats error:', error.response?.data || error.message);
    throw error;
  }
};
