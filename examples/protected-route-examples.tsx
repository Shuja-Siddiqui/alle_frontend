/**
 * Example: Protected Student Dashboard
 * Only accessible to authenticated students
 */

"use client";

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute 
      redirectTo="/student/login" 
      allowedRoles={['student']}
    >
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}

function StudentDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <p>Level: {user?.level}</p>
      <p>XP: {user?.xp}</p>
    </div>
  );
}

