/**
 * Context Usage Examples
 * Examples of how to use AuthContext and UIContext
 */

"use client";

import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useState } from 'react';

// ============================================
// Example 1: Login Component with Auth Context
// ============================================

export function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isLoading } = useAuth();
  const { showSuccess, showError, showLoader, hideLoader } = useUI();

  const handleLogin = async () => {
    try {
      showLoader('Logging in...');
      await login(email, password);
      hideLoader();
      showSuccess('Login successful!');
      // Redirect to dashboard
      window.location.href = '/student/dashboard';
    } catch (error: any) {
      hideLoader();
      showError(error.message || 'Login failed');
    }
  };

  return (
    <div>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password"
      />
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}

// ============================================
// Example 2: Display User Info
// ============================================

export function UserProfileDisplay() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showSuccess } = useUI();

  if (!isAuthenticated || !user) {
    return <p>Please log in</p>;
  }

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
  };

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.level && <p>Level: {user.level}</p>}
      {user.xp && <p>XP: {user.xp}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// ============================================
// Example 3: Update User Profile
// ============================================

export function UpdateProfileExample() {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError, showLoader, hideLoader } = useUI();
  
  const [name, setName] = useState(user?.name || '');

  const handleUpdate = async () => {
    try {
      showLoader('Updating profile...');
      
      // Update locally
      updateUser({ name });
      
      // Call API to update on server
      // await api.put(`/students/${user?.id}`, { name });
      
      hideLoader();
      showSuccess('Profile updated successfully!');
    } catch (error: any) {
      hideLoader();
      showError(error.message || 'Update failed');
    }
  };

  return (
    <div>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Name"
      />
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
}

// ============================================
// Example 4: Protected Component
// ============================================

export function ProtectedComponent() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <p>Access denied. Please log in.</p>;
  }

  return (
    <div>
      <h2>Protected Content</h2>
      <p>Welcome, {user?.name}!</p>
    </div>
  );
}

// ============================================
// Example 5: Role-Based Access
// ============================================

export function AdminOnlyComponent() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <p>Admin access only</p>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {/* Admin content */}
    </div>
  );
}

// ============================================
// Example 6: Using UI Context - Toasts
// ============================================

export function ToastExamples() {
  const { showSuccess, showError, showWarning, showInfo } = useUI();

  return (
    <div className="flex gap-2">
      <button onClick={() => showSuccess('Success message!')}>
        Show Success
      </button>
      <button onClick={() => showError('Error message!')}>
        Show Error
      </button>
      <button onClick={() => showWarning('Warning message!')}>
        Show Warning
      </button>
      <button onClick={() => showInfo('Info message!')}>
        Show Info
      </button>
    </div>
  );
}

// ============================================
// Example 7: Using UI Context - Loader
// ============================================

export function LoaderExample() {
  const { showLoader, hideLoader } = useUI();

  const handleLongOperation = async () => {
    showLoader('Processing...');
    
    // Simulate long operation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    hideLoader();
  };

  return (
    <button onClick={handleLongOperation}>
      Start Long Operation
    </button>
  );
}

// ============================================
// Example 8: Using UI Context - Sidebar
// ============================================

export function SidebarToggleExample() {
  const { isSidebarOpen, toggleSidebar, openSidebar, closeSidebar } = useUI();

  return (
    <div>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <button onClick={openSidebar}>Open Sidebar</button>
      <button onClick={closeSidebar}>Close Sidebar</button>
      <p>Sidebar is {isSidebarOpen ? 'open' : 'closed'}</p>
    </div>
  );
}

// ============================================
// Example 9: Using UI Context - Theme
// ============================================

export function ThemeToggleExample() {
  const { theme, toggleTheme, setTheme } = useUI();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}

// ============================================
// Example 10: Complete Registration Flow
// ============================================

export function RegistrationExample() {
  const { register } = useAuth();
  const { showLoader, hideLoader, showSuccess, showError } = useUI();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as 'student' | 'teacher',
  });

  const handleRegister = async () => {
    try {
      showLoader('Creating account...');
      await register(formData);
      hideLoader();
      showSuccess('Account created successfully!');
      // Redirect to dashboard
      window.location.href = '/student/dashboard';
    } catch (error: any) {
      hideLoader();
      showError(error.message || 'Registration failed');
    }
  };

  return (
    <div>
      <input 
        type="text"
        value={formData.name} 
        onChange={(e) => setFormData({...formData, name: e.target.value})} 
        placeholder="Name"
      />
      <input 
        type="email"
        value={formData.email} 
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
        placeholder="Email"
      />
      <input 
        type="password"
        value={formData.password} 
        onChange={(e) => setFormData({...formData, password: e.target.value})} 
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

