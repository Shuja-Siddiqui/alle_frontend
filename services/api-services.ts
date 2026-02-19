/**
 * API Service Examples
 * Example implementations for different API endpoints
 */

import { api } from '../lib/api-client';

// ============================================
// Authentication APIs
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    name: string;
  };
}

export const authApi = {
  login: (credentials: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', credentials),

  register: (data: { email: string; password: string; name: string; role: string }) =>
    api.post('/auth/register', data),

  logout: () =>
    api.post('/auth/logout'),

  getCurrentUser: (token: string) =>
    api.get('/auth/me', token),
};

// ============================================
// Student APIs
// ============================================

export interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  mascot?: {
    face: string;
    hair: string;
    body: string;
    hairColor: string;
  };
  level: number;
  xp: number;
}

export const studentApi = {
  getProfile: (studentId: string) =>
    api.get<Student>(`/students/${studentId}`),

  updateProfile: (studentId: string, data: Partial<Student>) =>
    api.put<Student>(`/students/${studentId}`, data),

  updateMascot: (studentId: string, mascot: Student['mascot']) =>
    api.put(`/students/${studentId}/mascot`, mascot),

  updateAvatar: (studentId: string, avatarUrl: string) =>
    api.patch(`/students/${studentId}/avatar`, { avatarUrl }),
};

// ============================================
// Course APIs
// ============================================

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  progress?: number;
}

export const courseApi = {
  getAllCourses: () =>
    api.get<Course[]>('/courses'),

  getCourseById: (courseId: string) =>
    api.get<Course>(`/courses/${courseId}`),

  enrollInCourse: (courseId: string) =>
    api.post(`/courses/${courseId}/enroll`),

  getEnrolledCourses: () =>
    api.get<Course[]>('/courses/enrolled'),
};

// ============================================
// Lesson APIs
// ============================================

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  completed?: boolean;
}

export const lessonApi = {
  getLessonsByCourse: (courseId: string) =>
    api.get<Lesson[]>(`/courses/${courseId}/lessons`),

  getLessonById: (lessonId: string) =>
    api.get<Lesson>(`/lessons/${lessonId}`),

  markLessonComplete: (lessonId: string) =>
    api.post(`/lessons/${lessonId}/complete`),
};

// ============================================
// Progress APIs
// ============================================

export interface Progress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  lastAccessedAt: string;
}

export const progressApi = {
  getStudentProgress: (studentId: string) =>
    api.get<Progress[]>(`/students/${studentId}/progress`),

  getCourseProgress: (studentId: string, courseId: string) =>
    api.get<Progress>(`/students/${studentId}/progress/${courseId}`),

  updateProgress: (studentId: string, courseId: string, data: Partial<Progress>) =>
    api.put(`/students/${studentId}/progress/${courseId}`, data),
};

// ============================================
// Leaderboard APIs
// ============================================

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
}

export const leaderboardApi = {
  getGlobalLeaderboard: (limit: number = 10) =>
    api.get<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`),

  getCourseLeaderboard: (courseId: string, limit: number = 10) =>
    api.get<LeaderboardEntry[]>(`/leaderboard/course/${courseId}?limit=${limit}`),
};

