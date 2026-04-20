/**
 * API Hook Usage Examples
 * 
 * This file demonstrates how to use the useApi hook in components
 */

"use client";

import { useState } from 'react';
import { useApi, useApiPost, useApiGet } from '../hooks/useApi';
import { authApi, studentApi } from '../services/api-services';

// ============================================
// Example 1: Basic useApi with execute
// ============================================

export function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { data, loading, error, execute } = useApi({
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // Save token to localStorage
      localStorage.setItem('auth_token', data.token);
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    }
  });

  const handleLogin = async () => {
    await execute('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <p>Welcome, {data.user.name}!</p>}
    </div>
  );
}

// ============================================
// Example 2: Using useApiPost hook
// ============================================

export function RegisterExample() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const { loading, error, post } = useApiPost({
    onSuccess: (data) => {
      console.log('Registration successful:', data);
      // Redirect to login or dashboard
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await post('/auth/register', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Name"
        value={formData.name} 
        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
      />
      <input 
        placeholder="Email"
        value={formData.email} 
        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
      />
      <input 
        type="password"
        placeholder="Password"
        value={formData.password} 
        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

// ============================================
// Example 3: Using useApiGet hook
// ============================================

export function ProfileExample({ studentId }: { studentId: string }) {
  const { data: profile, loading, error, get } = useApiGet();

  // Fetch profile on mount
  useState(() => {
    get(`/students/${studentId}`);
  });

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!profile) return null;

  return (
    <div>
      <h2>{profile.name}</h2>
      <p>Level: {profile.level}</p>
      <p>XP: {profile.xp}</p>
    </div>
  );
}

// ============================================
// Example 4: Using API service functions
// ============================================

export function UpdateMascotExample({ studentId }: { studentId: string }) {
  const [mascotParts, setMascotParts] = useState({
    face: 'head1',
    hair: 'hair1',
    body: 'body1',
    hairColor: '#E451FE',
  });

  const { loading, error, execute } = useApi({
    onSuccess: () => {
      alert('Mascot updated successfully!');
    }
  });

  const handleSave = async () => {
    // Using the API service function
    await execute(`/students/${studentId}/mascot`, {
      method: 'PUT',
      body: mascotParts
    });
  };

  return (
    <div>
      {/* Mascot creation UI */}
      <button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save Mascot'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

// ============================================
// Example 5: Multiple API calls in one component
// ============================================

export function DashboardExample({ studentId }: { studentId: string }) {
  const profileApi = useApiGet();
  const coursesApi = useApiGet();
  const progressApi = useApiGet();

  useState(() => {
    // Fetch multiple endpoints in parallel
    profileApi.get(`/students/${studentId}`);
    coursesApi.get('/courses/enrolled');
    progressApi.get(`/students/${studentId}/progress`);
  });

  const isLoading = profileApi.loading || coursesApi.loading || progressApi.loading;
  const hasError = profileApi.error || coursesApi.error || progressApi.error;

  if (isLoading) return <p>Loading dashboard...</p>;
  if (hasError) return <p>Error loading data</p>;

  return (
    <div>
      <h1>Welcome, {profileApi.data?.name}!</h1>
      <div>
        <h2>Your Courses</h2>
        {coursesApi.data?.map((course: any) => (
          <div key={course.id}>{course.title}</div>
        ))}
      </div>
      <div>
        <h2>Your Progress</h2>
        {/* Display progress data */}
      </div>
    </div>
  );
}

// ============================================
// Example 6: With authentication token
// ============================================

export function ProtectedResourceExample() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const { data, loading, error, execute } = useApi({
    token: token || undefined,
  });

  const fetchProtectedData = async () => {
    await execute('/protected-resource', {
      method: 'GET',
    });
  };

  return (
    <div>
      <button onClick={fetchProtectedData} disabled={loading}>
        Fetch Protected Data
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

