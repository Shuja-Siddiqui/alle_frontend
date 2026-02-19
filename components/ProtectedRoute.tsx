/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */

"use client";

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  allowedRoles?: ('student' | 'teacher' | 'admin')[];
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/',  // Changed from '/login' to '/' (root is the login page)
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check role-based access
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        if (user.role === 'student') {
          router.push('/student/home');
        } else if (user.role === 'teacher') {
          router.push('/teacher/dashboard');
        } else if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, allowedRoles]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Check role access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
}

