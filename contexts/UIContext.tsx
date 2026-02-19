/**
 * UI Context
 * Manages global UI states like loading, modals, toasts, etc.
 */

"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// ============================================
// Types
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface Modal {
  id: string;
  title?: string;
  content: ReactNode;
  onClose?: () => void;
}

export interface UIContextType {
  // Loading state
  isLoading: boolean;
  loadingMessage?: string;
  setLoading: (loading: boolean, message?: string) => void;
  showLoader: (message?: string) => void;
  hideLoader: () => void;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;

  // Modal management
  modals: Modal[];
  showModal: (content: ReactNode, title?: string, onClose?: () => void) => string;
  hideModal: (id: string) => void;
  hideAllModals: () => void;

  // Sidebar state (for responsive layouts)
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // Theme (optional)
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// ============================================
// Context Creation
// ============================================

const UIContext = createContext<UIContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal state
  const [modals, setModals] = useState<Modal[]>([]);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // ============================================
  // Loading Functions
  // ============================================

  const setLoading = (loading: boolean, message?: string) => {
    setIsLoading(loading);
    setLoadingMessage(message);
  };

  const showLoader = (message?: string) => {
    setIsLoading(true);
    setLoadingMessage(message);
  };

  const hideLoader = () => {
    setIsLoading(false);
    setLoadingMessage(undefined);
  };

  // ============================================
  // Toast Functions
  // ============================================

  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message: string) => showToast(message, 'success');
  const showError = (message: string) => showToast(message, 'error', 5000);
  const showWarning = (message: string) => showToast(message, 'warning');
  const showInfo = (message: string) => showToast(message, 'info');

  // ============================================
  // Modal Functions
  // ============================================

  const showModal = (content: ReactNode, title?: string, onClose?: () => void): string => {
    const id = `modal-${Date.now()}-${Math.random()}`;
    const newModal: Modal = { id, content, title, onClose };
    
    setModals((prev) => [...prev, newModal]);
    
    return id;
  };

  const hideModal = (id: string) => {
    const modal = modals.find((m) => m.id === id);
    if (modal?.onClose) {
      modal.onClose();
    }
    setModals((prev) => prev.filter((m) => m.id !== id));
  };

  const hideAllModals = () => {
    modals.forEach((modal) => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    setModals([]);
  };

  // ============================================
  // Sidebar Functions
  // ============================================

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // ============================================
  // Theme Functions
  // ============================================

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  const value: UIContextType = {
    isLoading,
    loadingMessage,
    setLoading,
    showLoader,
    hideLoader,
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    modals,
    showModal,
    hideModal,
    hideAllModals,
    isSidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    theme,
    toggleTheme,
    setTheme,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// ============================================
// Custom Hook
// ============================================

/**
 * Hook to use UI context
 * @throws Error if used outside UIProvider
 */
export function useUI(): UIContextType {
  const context = useContext(UIContext);
  
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
}

