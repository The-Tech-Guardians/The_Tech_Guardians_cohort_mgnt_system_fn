import type { AuthResponse, LoginData } from "./Types/types";
import { API_BASE_URL } from '../../../config/api';

export class LoginService {
     async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('📤 Sending login request:', { 
        email: data.email,
        url: `${API_BASE_URL}/auth/login`
      });

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      
      console.log('📥 Login response:', {
        status: response.status,
        data: responseData
      });

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Login failed');
      }

      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        console.log('✅ Token saved to localStorage');
      }
      
      return responseData;
    } catch (error: unknown) {
      console.error('❌ Login error details:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }

        if (error.message === 'Failed to fetch' || error.message?.includes('NetworkError')) {
          throw new Error('Cannot connect to server. Please check your connection or try again in a moment.');
        }
      }
      
      throw error;
    }
  }
}