import type { ActiveUser, CategoryData, DashboardData, ResolutionRates, SystemUsage, TimeBasedData } from "./Types/types";
import { API_BASE_URL } from '../../../../config/api';

const API_URL = API_BASE_URL;

class AnalyticsService {
  private getAuthToken(): string | null {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  }

  private async fetchWithAuth(url: string): Promise<Response> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  async getRequestsByCategory(): Promise<CategoryData[]> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/admin/analytics/requests-by-category`);
      const data = await response.json();
      return data.requestsByCategory || [];
    } catch (error) {
      console.error('Error fetching requests by category:', error);
      throw error;
    }
  }

  
  async getMostActiveUsers(limit: number = 10): Promise<ActiveUser[]> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/admin/analytics/most-active-users?limit=${limit}`);
      const data = await response.json();
      return data.mostActiveUsers || [];
    } catch (error) {
      console.error('Error fetching most active users:', error);
      throw error;
    }
  }

  async getResolutionRates(): Promise<ResolutionRates> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/admin/analytics/resolution-rates`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching resolution rates:', error);
      throw error;
    }
  }

  async getSystemUsage(): Promise<SystemUsage> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/admin/analytics/system-usage`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching system usage:', error);
      throw error;
    }
  }


  async getTimeBasedActivity(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    range: number = 7
  ): Promise<{ period: string; data: TimeBasedData[] }> {
    try {
      const response = await this.fetchWithAuth(
        `${API_BASE_URL}/admin/analytics/time-based-activity?period=${period}&range=${range}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching time-based activity:', error);
      throw error;
    }
  }

  async getComprehensiveDashboard(): Promise<DashboardData> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/admin/analytics/dashboard`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching comprehensive dashboard:', error);
      throw error;
    }
  }

  async exportToCSV(type: 'requests' | 'users' | 'responses' | 'reports'): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/admin/analytics/export/csv?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }


  async exportToJSON(type: 'requests' | 'users' | 'responses' | 'reports'): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/admin/analytics/export/json?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();
