const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8080/api'
  : 'https://community-support-flatform-backend-1-0ghf.onrender.com/api';

export const SOCKET_URL = isDevelopment
  ? 'http://localhost:8080'
  : 'https://community-support-flatform-backend-1-0ghf.onrender.com';

console.log('🔧 API Configuration (production):', {
  API_BASE_URL,
  SOCKET_URL
});
