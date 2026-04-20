/**
 * Public Route Component
 * Redirects to dashboard if user is already authenticated
 * Use for login/register pages
 */

"use client";

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their dashboard
      if (user.role === 'student') {
        router.push('/student/dashboard');
      } else if (user.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Already authenticated - will redirect
  if (isAuthenticated) {
    return null;
  }

  // Not authenticated - show page
  return <>{children}</>;
}

