import { User } from '@/types/user';
import { TwoFAMethod } from '@/components/banner/auth/two-fa/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
  success?: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: User;
  };
  requires_2fa?: boolean;
  preferredMethod?: TwoFAMethod;
  qrDataUrl?: string;
  secret?: string;
  setupMode?: boolean;
  token?: string;
  user?: User;
  user_id?: string;
  method?: TwoFAMethod;
}

export interface Select2FAResponse extends AuthResponse {
  method: TwoFAMethod;
  qrDataUrl?: string;
  secret?: string;
  setupMode: boolean;
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

interface TokenManager {
  readonly user: User | null;
  getRedirectPath(searchParams?: any): string;
  setRedirectPath(path: string): void;
  setToken(token: string): void;
  getToken(): string | null;
  removeToken(): void;
  setUser(user: User): void;
  getUser(): User | null;
  removeUser(): void;
  getUserIdFromToken(): string | null;
  getRoleFromToken(): string | null;
  getUsername(): string;
  refreshUser(): Promise<boolean>;
  logout(): void;
}

export const authAPI = {
async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return response.json();
    } catch (error) {
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

async verify2FA(userId: string, method: TwoFAMethod, code: string, tempSecret?: string): Promise<AuthResponse> {
    try {
      const token = tokenManager.getToken();
      const body: any = { user_id: userId, method, code };
      if (tempSecret) body.tempSecret = tempSecret;
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let details: any = null;
        try { details = await response.json(); } catch { details = null; }
        return {
          success: false,
          message: String(details?.error || details?.message || `Server error: ${response.status}`),
        } as any;
      }

      const result = await response.json();
      return { success: true, ...result };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' as any };
    }
  },

  async resend2FA(userId: string, method: TwoFAMethod): Promise<AuthResponse> {
    try {
      const token = tokenManager.getToken();
      const response = await fetch(`${API_BASE_URL}/auth/resend-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, method }),
      });

      if (!response.ok) {
        let details: any = null;
        try { details = await response.json(); } catch { details = null; }
        return { success: false, message: String(details?.error || details?.message || `Server error: ${response.status}`) };
      }

      const result = await response.json();
      return { success: true, ...result };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  async select2FAMethod(userId: string, method: TwoFAMethod): Promise<Select2FAResponse> {
    try {
      const token = tokenManager.getToken();
      const response = await fetch(`${API_BASE_URL}/auth/select-2fa-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, method }),
      });

      if (!response.ok) {
        let details: any = null;
        try { details = await response.json(); } catch { details = null; }
        return { success: false, message: String(details?.error || details?.message || `Server error: ${response.status}`), method, setupMode: false } as Select2FAResponse;
      }

      const result = await response.json();
      return { success: true, method, ...result } as Select2FAResponse;
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.', method, setupMode: false } as Select2FAResponse;
    }
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return response.json();
  },

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    return response.json();
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
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

async getLearnerCohortCourses(): Promise<AuthResponse> {
    const token = tokenManager.getToken();
    if (!token) return { success: false, message: 'No token' };
    const response = await fetch(`${API_BASE_URL}/learner/cohort-courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Keep original for future use
async getLearnerCohortCourses(): Promise<AuthResponse> {
    const token = tokenManager.getToken();
    if (!token) return { success: false, message: 'No token' };
    const response = await fetch(`${API_BASE_URL}/learner/cohort-courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },


async getLearnerCohort(): Promise<AuthResponse> {
    const token = tokenManager.getToken();
    if (!token) return { success: false, message: 'No token' };
    const response = await fetch(`${API_BASE_URL}/learner/cohort`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async getAvailableCohorts(): Promise<any> {
    const token = tokenManager.getToken();
    const url = `${API_BASE_URL}/learner/available-cohorts`;

    // console.debug('[getAvailableCohorts] Fetching:', url);\n    // console.debug('[getAvailableCohorts] Token present:', !!token);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

        if (!response.ok) {
        // console.error('[getAvailableCohorts] HTTP error:', response.status, response.statusText);
        return { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }

      return response.json();
    } catch (error: any) {
      // console.error('[getAvailableCohorts] Network error:', error?.message ?? error);\n      // console.error('[getAvailableCohorts] Attempted URL:', url);\n      // console.error('[getAvailableCohorts] Is the API server running? Check NEXT_PUBLIC_API_URL in your .env');
      return { success: false, message: 'Network error: could not reach the API server.' };
    }
  },

async getMe(): Promise<any> {
    const token = tokenManager.getToken();
    if (!token) {
      return { success: false, message: 'No token' };
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, message: `Server error: ${response.status}` };
    }

    return response.json();
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

import { cohortService } from '@/services/cohortService';

// Token management
export const tokenManager = {
  getRedirectPath(searchParams?: any): string {
    // 1) Prefer explicit redirect query param (Next.js searchParams or URLSearchParams-like)
    try {
      const candidate =
        (typeof searchParams?.get === 'function' ? searchParams.get('redirect') : undefined) ??
        (typeof searchParams?.redirect === 'string' ? searchParams.redirect : undefined);

      if (typeof candidate === 'string' && candidate.trim()) {
        const trimmed = candidate.trim();
        if (trimmed.startsWith('/') && trimmed !== '/login') return trimmed;
      }
    } catch {
      // ignore
    }

    // 2) Fall back to stored redirect
    const stored = storage.get('auth_redirect_path');
    if (stored && stored.startsWith('/') && stored !== '/login') return stored;

    // 3) Default route
    return '/';
  },

  setRedirectPath(path: string): void {
    const trimmed = String(path || '').trim();
    if (!trimmed || !trimmed.startsWith('/') || trimmed === '/login') {
      storage.remove('auth_redirect_path');
      return;
    }
    storage.set('auth_redirect_path', trimmed);
  },
  
  async validateAuth(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Lightweight auth test - try to fetch first cohort page
      await cohortService.getAllCohorts(1, 1);
      return true;
    } catch (error) {
      console.warn('Auth validation failed:', error);
      this.logout();
      return false;
    }
  },


  setToken(token: string) {
    storage.set('auth_token', token);
    // Set cookie for Next.js middleware with proper expiry (24h like JWT)
    if (typeof window !== 'undefined') {
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; Max-Age=86400; SameSite=Lax; Expires=${expires}${secure}`;
    }
  },

  getToken(): string | null {
    return storage.get('auth_token');
  },

  removeToken(): void {
    storage.remove('auth_token');
    if (typeof window !== 'undefined') {
      document.cookie = 'auth_token=; Path=/; Max-Age=0; SameSite=Lax';
    }
  },

  setUser(user: User): void {
    storage.set('user_data', JSON.stringify(user));
  },

  getUser(): User | null {
    const userData = storage.get('user_data');
    if (!userData) return null;
    try {
      return JSON.parse(userData) as User;
    } catch {
      storage.remove('user_data');
      return null;
    }
  },

  removeUser(): void {
    storage.remove('user_data');
  },

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.uuid || payload.user_id || payload.id;
    } catch (error) {
      // console.error('Error decoding token:', error);
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
      // console.error('Error decoding token role:', error);
      return null;
    }
  },

  getUsername(): string {
    const user = this.getUser();
    if (user) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
    }
    return 'User';
  },

  async refreshUser(): Promise<boolean> {
    const result = await authAPI.getMe();
    if (result.success && result.user) {
      (tokenManager as any).setUser(result.user as User);
      // console.log('[auth] Refreshed user from /me:', result.user.role);
      return true;
    }
    // console.error('[auth] Failed to refresh user:', result.message);
    return false;
  },

  logout(): void {
    this.removeToken();
    this.removeUser();
  },
};

