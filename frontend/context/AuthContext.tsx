'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in and fetch user data
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      fetchUser();
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user, accessToken } = await authService.login({ email, password });
      localStorage.setItem('accessToken', accessToken);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const fetchUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await authService.register({
        name,
        email,
        password,
      });
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      // Even if API call fails, clear local state
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
