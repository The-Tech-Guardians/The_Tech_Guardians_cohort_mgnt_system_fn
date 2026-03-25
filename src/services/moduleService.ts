// Module Service - API interactions for Module Management

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  releaseWeek: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModuleFormData {
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  releaseWeek: number;
}

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || localStorage.getItem('token');
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || error.message || 'Request failed');
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response;
};

export const moduleService = {
  // Get all modules for a specific course
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const endpoints = [
        `${API_BASE_URL}/modules/course/${courseId}`,
        `${API_BASE_URL}/courses/${courseId}/modules`,
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          continue;
        }

        const data = await handleResponse(response);
        return data.modules || data.data || [];
      }

      // Some backends return 404 when no modules exist for a course.
      return [];
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      throw error;
    }
  },

  // Get a single module by ID
  async getModuleById(id: string): Promise<Module | null> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data.module || null;
    } catch (error) {
      console.error(`Failed to fetch module ${id}:`, error);
      throw error;
    }
  },

  // Create a new module
  async createModule(moduleData: ModuleFormData): Promise<Module> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(moduleData),
      });
      const data = await handleResponse(response);
      return data.module;
    } catch (error) {
      console.error('Failed to create module:', error);
      throw error;
    }
  },

  // Update an existing module
  async updateModule(id: string, updates: Partial<ModuleFormData>): Promise<Module> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await handleResponse(response);
      return data.module;
    } catch (error) {
      console.error(`Failed to update module ${id}:`, error);
      throw error;
    }
  },

  // Delete a module
  async deleteModule(id: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      await handleResponse(response);
    } catch (error) {
      console.error(`Failed to delete module ${id}:`, error);
      throw error;
    }
  },
};

