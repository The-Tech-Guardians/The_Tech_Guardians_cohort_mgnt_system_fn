

import { API_BASE_URL } from '../../../../config/api';

const API_URL = API_BASE_URL;

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  categories: Category[];
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      console.log(` Attempt ${i + 1}/${maxRetries + 1} to fetch categories...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
      
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`⚠️ Attempt ${i + 1} failed:`, lastError.message);
      
      if (i === maxRetries) {
        throw error;
      }
      const waitTime = (i + 1) * 10000; 
      console.log(`⏳ Waiting ${waitTime/1000}s before retry...`);
      await sleep(waitTime);
    }
  }
  
  throw lastError || new Error('Request failed');
}

class CategoryService {
  async getCategories(): Promise<Category[]> {
    try {
      console.log('📤 Fetching categories from:', `${API_BASE_URL}/categories`);

      const response = await fetchWithRetry(
        `${API_BASE_URL}/categories`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data: CategoryResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.categories ? 'Failed to fetch categories' : 'Invalid response format');
      }

      console.log('✅ Categories fetched:', data.categories?.length || 0);
      return data.categories || [];
    } catch (error: unknown) {
      console.error('❌ Error fetching categories:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. The server might be starting up. Please try again.');
        }
        
        if (error.message === 'Failed to fetch' || error.message?.includes('NetworkError')) {
          throw new Error('Cannot connect to server. It might be waking up. Please wait and try again.');
        }
      }
      
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch category');
      }

      return data.category;
    } catch (error: unknown) {
      console.error('❌ Error fetching category:', error);
      throw error;
    }
  }

  async createCategory(categoryData: { name: string; description: string }): Promise<Category> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      return data.category;
    } catch (error: unknown) {
      console.error('❌ Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, categoryData: { name: string; description: string }): Promise<Category> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update category');
      }

      return data.category;
    } catch (error: unknown) {
      console.error('❌ Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }
    } catch (error: unknown) {
      console.error('❌ Error deleting category:', error);
      throw error;
    }
  }
}

export default new CategoryService();