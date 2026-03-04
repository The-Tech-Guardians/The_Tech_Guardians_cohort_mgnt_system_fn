import type { AuthResponse, RegisterData } from "./Types/types";
import { API_BASE_URL } from '../../../config/api';

export class RegisterService {

 async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📤 Sending registration request:', { 
        name: data.name, 
        email: data.email,
        url: `${API_BASE_URL}/auth/register`
      });

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      
      console.log('📥 Registration response:', {
        status: response.status,
        data: responseData
      });

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Registration failed');
      }

      if (responseData.token) {
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        console.log('✅ Token saved to localStorage');
      }
      
      return responseData;
    } catch (error: unknown) {
      console.error('❌ Registration error details:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. The server might be starting up. Please try again in 30 seconds.');
        }
        
        if (error.message === 'Failed to fetch' || error.message?.includes('NetworkError')) {
          throw new Error('Cannot connect to server. It might be waking up (Render free tier). Please wait 30 seconds and try again.');
        }
      }
      
      throw error;
    }
  }
}
