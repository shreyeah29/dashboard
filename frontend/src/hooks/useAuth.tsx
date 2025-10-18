import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi, AuthUser } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log('Checking auth...');
      const userData = await authApi.verify();
      console.log('Auth verify result:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (password: string) => {
    try {
      console.log('Attempting login...');
      const result = await authApi.login({ password });
      console.log('Login API result:', result);
      
      // Store token in localStorage as fallback for cross-origin issues
      if (result.token) {
        localStorage.setItem('adminToken', result.token);
        console.log('Token stored in localStorage:', result.token);
      }
      
      await checkAuth();
      console.log('Auth check completed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('adminToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user?.isAdmin
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};