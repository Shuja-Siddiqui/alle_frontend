/**
 * Auth Context
 * Manages authentication state and user data across the application
 */

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api-client';
import { ApiError } from '../lib/api-client';
import { resolvePhonemeCode } from '../lib/phonemeCatalog';

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

  // Global badge catalog (all badges + locked/unlocked icons)
  allBadges: {
    id: string;
    title: string;
    description?: string | null;
    iconActive?: string | null;
    iconInactive?: string | null;
    rarity?: string | null;
  }[];

  // Daily streak cache
  streakData: {
    streakDayCounter: number;
    maxStreak: number;
    motivationalLine: string;
    nextReward: string;
    dateKey: string;
  } | null;
  isStreakLoading: boolean;
  streakErrorMessage: string;
  fetchStreakData: (forceRefresh?: boolean) => Promise<void>;

  // Phoneme catalog cache
  phonemeCatalog: {
    chart: {
      code: string;
      ipa: string;
      example: string;
      group?: string;
    }[];
    allowedCodes: string[];
  } | null;
  isPhonemeCatalogLoading: boolean;
  phonemeCatalogError: string;
  fetchPhonemeCatalog: (forceRefresh?: boolean) => Promise<void>;

  // Auth actions
  login: (email: string, password: string) => Promise<User>;
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
  const [allBadges, setAllBadges] = useState<
    {
      id: string;
      title: string;
      description?: string | null;
      iconActive?: string | null;
      iconInactive?: string | null;
      rarity?: string | null;
    }[]
  >([]);
  const [streakData, setStreakData] = useState<{
    streakDayCounter: number;
    maxStreak: number;
    motivationalLine: string;
    nextReward: string;
    dateKey: string;
  } | null>(null);
  const [isStreakLoading, setIsStreakLoading] = useState(false);
  const [streakErrorMessage, setStreakErrorMessage] = useState('');
  const STREAK_CACHE_KEY = 'streak_data_cache';
  const [phonemeCatalog, setPhonemeCatalog] = useState<{
    chart: {
      code: string;
      ipa: string;
      example: string;
      group?: string;
    }[];
    allowedCodes: string[];
  } | null>(null);
  const [isPhonemeCatalogLoading, setIsPhonemeCatalogLoading] = useState(false);
  const [phonemeCatalogError, setPhonemeCatalogError] = useState('');

  const getTodayDateKey = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  };

  // Load token and user from localStorage on mount
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');

        if (storedToken && storedUser) {
          setTokenState(storedToken);
          setUser(JSON.parse(storedUser));
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

  // Load streak cache from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STREAK_CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === 'object' &&
        typeof parsed.streakDayCounter === 'number' &&
        typeof parsed.maxStreak === 'number' &&
        typeof parsed.dateKey === 'string'
      ) {
        setStreakData({
          streakDayCounter: parsed.streakDayCounter,
          maxStreak: parsed.maxStreak,
          motivationalLine: String(parsed.motivationalLine || ''),
          nextReward: String(parsed.nextReward || ''),
          dateKey: parsed.dateKey,
        });
      }
    } catch (error) {
      console.error('Error loading streak cache:', error);
      localStorage.removeItem(STREAK_CACHE_KEY);
    }
  }, []);

  // Load global badge catalog once per session
  useEffect(() => {
    let cancelled = false;
    const loadBadges = async () => {
      try {
        const response = await api.get<any>('/badges');
        const data = response?.data ?? response;
        if (!cancelled && Array.isArray(data)) {
          setAllBadges(data);
        }
      } catch (error) {
        console.error('Error loading badge catalog:', error);
      }
    };
    loadBadges();
    return () => {
      cancelled = true;
    };
  }, []);

  // Login function - returns user so callers can redirect by role
  const login = async (email: string, password: string): Promise<User> => {
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
      return userData;
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
    // Invalidate session on backend (if token/session exists)
    api.post('/auth/logout').catch((error) => {
      console.error('Error calling logout API:', error);
    });

    // Clear ALL localStorage for this origin (tokens, user data, cached settings, etc.)
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }

    // Clear in-memory auth state
    setTokenState(null);
    setUser(null);
    setStreakData(null);
    setStreakErrorMessage('');
    setIsStreakLoading(false);
  };

  const fetchStreakData = async (forceRefresh: boolean = false) => {
    const todayKey = getTodayDateKey();

    if (!forceRefresh && streakData?.dateKey === todayKey) {
      return;
    }

    setIsStreakLoading(true);
    setStreakErrorMessage('');

    try {
      const response = await api.get<{ data?: any }>('/streaks/my-streak');
      const payload = response?.data || {};
      const normalized = {
        streakDayCounter: Number(payload.streakDayCounter || 0),
        maxStreak: Number(payload.maxStreak || 0),
        motivationalLine: String(payload.motivationalLine || ''),
        nextReward: String(payload.nextReward || ''),
        dateKey: todayKey,
      };
      setStreakData(normalized);
      localStorage.setItem(STREAK_CACHE_KEY, JSON.stringify(normalized));
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        try {
          const created = await api.post<{ data?: any }>('/streaks/update', { xpEarned: 0 });
          const payload = created?.data || {};
          const normalized = {
            streakDayCounter: Number(payload.streakDayCounter || 0),
            maxStreak: Number(payload.maxStreak || 0),
            motivationalLine: String(payload.motivationalLine || ''),
            nextReward: String(payload.nextReward || ''),
            dateKey: todayKey,
          };
          setStreakData(normalized);
          localStorage.setItem(STREAK_CACHE_KEY, JSON.stringify(normalized));
        } catch {
          setStreakErrorMessage('Could not create streak record right now.');
        }
      } else {
        setStreakErrorMessage('Could not load streak data. Please try again.');
      }
    } finally {
      setIsStreakLoading(false);
    }
  };

  const fetchPhonemeCatalog = async (forceRefresh: boolean = false) => {
    if (!forceRefresh && phonemeCatalog) return;

    setIsPhonemeCatalogLoading(true);
    setPhonemeCatalogError('');
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
    const normalizeSkillFocusToCode = (entry: unknown): string | null => {
      const raw = String(entry ?? '').trim();
      if (!raw) return null;
      const withoutPrefix = raw.replace(/^sound\s+/i, '').trim();
      if (!withoutPrefix) return null;
      const token = withoutPrefix.split(/[\s,/|]+/).filter(Boolean)[0] || '';
      return token ? token.toUpperCase() : null;
    };

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const catalogResponse = await fetch(`${apiBaseUrl}/testing/speech/phonemes`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const catalogJson = await catalogResponse.json().catch(() => ({}));
      if (!catalogResponse.ok || catalogJson?.success === false) {
        throw new Error(catalogJson?.message || 'Failed to load phoneme catalog');
      }
      const nextChart = Array.isArray(catalogJson?.chart) ? catalogJson.chart : [];

      const allowedResponse = await fetch(`${apiBaseUrl}/lessons/progress/catalog-phonemes`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const allowedJson = await allowedResponse.json().catch(() => ({}));
      if (!allowedResponse.ok || allowedJson?.success === false) {
        throw new Error(allowedJson?.message || 'Failed to load catalog phonemes');
      }

      const rawAllowedPhonemes = allowedJson?.data?.phonemes ?? allowedJson?.phonemes ?? [];
      const allowedCodes = Array.isArray(rawAllowedPhonemes)
        ? rawAllowedPhonemes
            .map((entry: unknown) => normalizeSkillFocusToCode(entry))
            .filter((value: string | null): value is string => Boolean(value))
            .map((code) => resolvePhonemeCode(code))
            .filter(Boolean)
        : [];

      setPhonemeCatalog({
        chart: nextChart,
        allowedCodes: Array.from(new Set(allowedCodes)),
      });
    } catch (error: any) {
      setPhonemeCatalogError(error?.message || 'Failed to load phoneme catalog');
    } finally {
      setIsPhonemeCatalogLoading(false);
    }
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
      const response = await api.get<any>('/users/me', token);
      const userData = response?.data ?? response;
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
    allBadges,
    streakData,
    isStreakLoading,
    streakErrorMessage,
    fetchStreakData,
    phonemeCatalog,
    isPhonemeCatalogLoading,
    phonemeCatalogError,
    fetchPhonemeCatalog,
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

