/**
 * Auth Context
 * Manages authentication state and user data across the application
 */

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api-client';

// ============================================
// Types
// ============================================

import { User } from '../app/types/user';

export interface AuthContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;

  // Token management
  setToken: (token: string) => void;
  clearToken: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
  languagePreference?: string;
  mascot?: User['mascot'];
}

interface LoginResponse {
  token: string;
  user: User;
}

// ============================================
// Context Creation
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');

        if (storedToken && storedUser) {
          setTokenState(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Optionally refresh user data from server
          // await refreshUserFromServer(storedToken);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('🔐 AuthContext: Calling login API...');
      
      const response = await api.post<any>('/auth/login', { email, password });
      
      console.log('🔐 AuthContext: API response:', response);
      
      // Handle different response structures
      let newToken = response.accessToken || response.data?.accessToken || response.token;
      let userData = response.user || response.data?.user;
      
      if (!newToken || !userData) {
        throw new Error('Invalid response from server');
      }
      
      console.log('🔐 AuthContext: Saving token and user data...');
      
      // Save to localStorage
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Update state
      setTokenState(newToken);
      setUser(userData);
      
      console.log('✅ AuthContext: Login successful, user authenticated');
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await api.post<LoginResponse>('/auth/register', data);
      
      // Save token and user data
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setTokenState(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Clear state
    setTokenState(null);
    setUser(null);

    // Optionally call logout API
    // api.post('/auth/logout').catch(console.error);
  };

  // Update user data locally
  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
  };

  // Refresh user data from server
  const refreshUser = async () => {
    if (!token) return;

    try {
      const userData = await api.get<User>('/auth/me', token);
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If token is invalid, logout
      if ((error as any).statusCode === 401) {
        logout();
      }
    }
  };

  // Set token
  const setToken = (newToken: string) => {
    localStorage.setItem('auth_token', newToken);
    setTokenState(newToken);
  };

  // Clear token
  const clearToken = () => {
    localStorage.removeItem('auth_token');
    setTokenState(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    token,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    setToken,
    clearToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// Custom Hook
// ============================================

/**
 * Hook to use auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// ============================================
// Helper Hooks
// ============================================

/**
 * Hook to check if user has specific role
 */
export function useHasRole(role: User['role']) {
  const { user } = useAuth();
  return user?.role === role;
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);
  
  return { isAuthenticated, isLoading };
}

