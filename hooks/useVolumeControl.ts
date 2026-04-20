/**
 * useVolumeControl Hook
 * Manages volume state and persists to backend
 */

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApiPost } from './useApi';

interface UseVolumeControlResult {
  volume: number;
  setVolume: (volume: number) => void;
  saveVolume: (volume: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useVolumeControl(): UseVolumeControlResult {
  const { user, updateUser } = useAuth();
  const { post, loading, error } = useApiPost();
  
  // Initialize volume from user metadata or default to 0
  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      // Try to get from localStorage first (immediate)
      const stored = localStorage.getItem('volume');
      if (stored) return parseInt(stored, 10);
    }
    // Then check user metadata (backend source of truth)
    return user?.metadata?.volume ?? 0;
  });

  // Update localStorage when volume changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('volume', volume.toString());
    }
  }, [volume]);

  // Sync with user metadata when user changes
  useEffect(() => {
    if (user?.metadata?.volume !== undefined) {
      setVolumeState(user.metadata.volume);
    }
  }, [user?.metadata?.volume]);

  const setVolume = (newVolume: number) => {
    // Clamp between 0-100
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    setVolumeState(clampedVolume);
  };

  const saveVolume = async (newVolume: number) => {
    try {
      const clampedVolume = Math.max(0, Math.min(100, newVolume));
      
      console.log('🔊 Saving volume:', clampedVolume);

      // Update backend
      await post('/users/profile', {
        metadata: {
          volume: clampedVolume,
        },
      });

      // Update local state
      setVolumeState(clampedVolume);
      
      // Update auth context
      if (user) {
        updateUser({
          metadata: {
            ...user.metadata,
            volume: clampedVolume,
          },
        });
      }

      console.log('✅ Volume saved successfully');
    } catch (err) {
      console.error('❌ Error saving volume:', err);
      throw err;
    }
  };

  return {
    volume,
    setVolume,
    saveVolume,
    isLoading: loading,
    error,
  };
}

