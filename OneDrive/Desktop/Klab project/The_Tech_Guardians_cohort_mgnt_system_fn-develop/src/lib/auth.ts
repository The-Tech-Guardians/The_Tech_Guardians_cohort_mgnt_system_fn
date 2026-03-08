const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

export const authAPI = {
  async login(data: LoginData): Promise<any> {
    try {
      console.log('🔵 Login attempt:', { url: `${API_BASE_URL}/api/auth/Login`, email: data.email });
      
      const response = await fetch(`${API_BASE_URL}/api/auth/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('🔵 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Login response:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      if (error.message?.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure backend is running on port 3000.');
      }
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async verify2FA(email: string, code: string): Promise<AuthResponse> {
    try {
      const userId = tokenManager.getUserIdFromToken();
      
      if (!userId) {
        return { success: false, message: 'User ID not found in token. Please login again.' };
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/Verify2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, token: code }),
      });

      if (!response.ok) {
        return { success: false, message: `Server error: ${response.status}` };
      }
      
      const result = await response.json();
      return { success: true, ...result };
    } catch (error) {
      console.error('2FA API error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/ForgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      return response.json();
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/VerifyResetOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      return response.json();
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/ResetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      return response.json();
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  async getAdminStats(): Promise<AuthResponse> {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async getLearnerCourses(): Promise<any> {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/learner/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async getLearnerCohort(): Promise<any> {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/learner/cohort`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async getAvailableCohorts(): Promise<any> {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/learner/available-cohorts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async joinCohort(cohort_id: string): Promise<any> {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/cohorts/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cohort_id })
    });
    return response.json();
  },
};

// Token management
export const tokenManager = {
  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken() {
    localStorage.removeItem('auth_token');
  },

  setUser(user: any) {
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  getUser(): any {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  removeUser() {
    localStorage.removeItem('user_data');
  },

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      // Decode JWT token (without verification for client-side)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.uuid || payload.user_id || payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  getUsername(): string {
    const user = this.getUser();
    if (user) {
      return `${user.firstName} ${user.lastName}`.trim() || user.email || 'User';
    }
    return 'User';
  },

  logout() {
    this.removeToken();
    this.removeUser();
  },
};