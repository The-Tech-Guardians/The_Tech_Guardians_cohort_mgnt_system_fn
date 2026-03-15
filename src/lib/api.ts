const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  users?: any[];
  courses?: any[];
  cohorts?: any[];
  announcements?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || localStorage.getItem('token');
};

export const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  useAuth = true
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const token = useAuth ? getAuthToken() : null;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || error.message || `HTTP ${response.status}`);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    return response as any;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// Convenience wrappers
export const getPaginated = async <T>(endpoint: string, page = 1, limit = 10): Promise<PaginatedResponse<T>> => {
  const data = await apiFetch<ApiResponse<T[]>>(`${endpoint}?page=${page}&limit=${limit}`);
  const getItems = (): any[] => {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.users)) return data.users;
    if (Array.isArray(data.courses)) return data.courses;
    return [];
  };
  return {
    data: getItems(),
    pagination: data.pagination || { page, limit, total: 0, pages: 0 },
  };
};

export const post = async <T>(endpoint: string, body: any): Promise<T> => apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
export const put = async <T>(endpoint: string, body: any): Promise<T> => apiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
export const del = async <T>(endpoint: string): Promise<T> => apiFetch<T>(endpoint, { method: 'DELETE' });

