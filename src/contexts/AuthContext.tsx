'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  uuid: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize user from localStorage on mount and listen for storage changes
  useEffect(() => {
    const loadUserFromStorage = () => {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData) as User;
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to parse user data from localStorage:', error);
          localStorage.removeItem('user_data');
        }
      } else {
        setCurrentUser(null);
      }
    };

    // Load initial user data
    loadUserFromStorage();

    // Listen for storage changes (in case tokenManager updates localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_data') {
        loadUserFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('user_data', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
