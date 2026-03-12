const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
  requires_2fa?: boolean;
  token?: string;
  user_id?: string;
}

// Safe localStorage helpers — no-ops during SSR
const storage = {
  get(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  set(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

export const authAPI = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return response.json();
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
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
    const response = await fetch(`${API_BASE_URL}/auth/ForgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return response.json();
  },

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/VerifyResetOtp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    return response.json();
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/ResetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    return response.json();
  },

  async getAdminStats(): Promise<AuthResponse> {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async fixAdminRole(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/fix-admin-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  async getLearnerCourses(): Promise<any> {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/learner/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async getLearnerCohort(): Promise<any> {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/learner/cohort`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async getAvailableCohorts(): Promise<any> {
    const token = tokenManager.getToken();
    const url = `${API_BASE_URL}/learner/available-cohorts`;

    console.debug('[getAvailableCohorts] Fetching:', url);
    console.debug('[getAvailableCohorts] Token present:', !!token);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('[getAvailableCohorts] HTTP error:', response.status, response.statusText);
        return { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }

      return response.json();
    } catch (error: any) {
      // "Failed to fetch" lands here — log the actual cause
      console.error('[getAvailableCohorts] Network error:', error?.message ?? error);
      console.error('[getAvailableCohorts] Attempted URL:', url);
      console.error('[getAvailableCohorts] Is the API server running? Check NEXT_PUBLIC_API_URL in your .env');
      return { success: false, message: 'Network error: could not reach the API server.' };
    }
  },

  async joinCohort(cohort_id: string): Promise<any> {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/cohorts/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ cohort_id }),
    });
    return response.json();
  },
};

// Token management
export const tokenManager = {
  setToken(token: string) {
    storage.set('auth_token', token);
    // Also set a cookie so Next.js middleware can protect routes.
    // Note: httpOnly cookies require a server; this is a best-effort client cookie.
    if (typeof window !== 'undefined') {
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}`;
    }
  },

  getToken(): string | null {
    return storage.get('auth_token');
  },

  removeToken() {
    storage.remove('auth_token');
    if (typeof window !== 'undefined') {
      document.cookie = 'auth_token=; Path=/; Max-Age=0; SameSite=Lax';
    }
  },

  setUser(user: any) {
    storage.set('user_data', JSON.stringify(user));
  },

  getUser(): any {
    const userData = storage.get('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  removeUser() {
    storage.remove('user_data');
  },

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.uuid || payload.user_id || payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (error) {
      console.error('Error decoding token role:', error);
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