"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { tokenManager } from './auth';

interface AuthContextType {
  user: any;
  token: string | null;
  role: string | null;
  loading: boolean;
  tokenManager: typeof tokenManager;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children 
}: { 
  children: ReactNode; 
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Sync from localStorage on mount
    const syncAuth = () => {
      const token = tokenManager.getToken();
      const userData = tokenManager.getUser();
      
      setToken(token);
      setUser(userData);
      setLoading(false);
    };

    syncAuth();

    // Listen for storage changes (other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        syncAuth();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logout = () => {
    tokenManager.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    role: tokenManager.getRoleFromToken(),
    loading,
    tokenManager,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// App-wide provider wrapper
export const useAuthProvider = AuthProvider;

