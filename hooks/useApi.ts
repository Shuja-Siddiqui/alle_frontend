/**
 * useApi Hook
 * Reusable hook for API calls with loading, error, and data states
 */

import { useState, useCallback } from 'react';
import { apiClient, ApiConfig, ApiError } from '../lib/api-client';

export interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  token?: string;
}

export interface UseApiResult<T = any> {
  data: T | null;
  error: string | null;
  loading: boolean;
  execute: (endpoint: string, config: ApiConfig) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook for making API calls with loading and error states
 * 
 * @example
 * const { data, loading, error, execute } = useApi();
 * 
 * const handleLogin = async () => {
 *   await execute('/auth/login', {
 *     method: 'POST',
 *     body: { email, password }
 *   });
 * };
 */
export function useApi<T = any>(options?: UseApiOptions): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (endpoint: string, config: ApiConfig): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        // Add token from options if provided
        const finalConfig = {
          ...config,
          token: config.token || options?.token,
        };

        const result = await apiClient<T>(endpoint, finalConfig);
        setData(result);
        
        // Call onSuccess callback if provided
        options?.onSuccess?.(result);
        
        return result;
      } catch (err) {
        const apiError = err instanceof ApiError ? err : new ApiError('Unknown error', 500);
        const errorMessage = apiError.message;
        
        setError(errorMessage);
        setData(null);
        
        // Call onError callback if provided
        options?.onError?.(apiError);
        
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    reset,
  };
}

/**
 * Hook specifically for GET requests
 */
export function useApiGet<T = any>(options?: UseApiOptions) {
  const api = useApi<T>(options);
  
  const get = useCallback(
    (endpoint: string) => {
      return api.execute(endpoint, { method: 'GET' });
    },
    [api]
  );

  return {
    ...api,
    get,
  };
}

/**
 * Hook specifically for POST requests
 */
export function useApiPost<T = any>(options?: UseApiOptions) {
  const api = useApi<T>(options);
  
  const post = useCallback(
    (endpoint: string, body?: any) => {
      return api.execute(endpoint, { method: 'POST', body });
    },
    [api]
  );

  return {
    ...api,
    post,
  };
}

/**
 * Hook specifically for PUT requests
 */
export function useApiPut<T = any>(options?: UseApiOptions) {
  const api = useApi<T>(options);
  
  const put = useCallback(
    (endpoint: string, body?: any) => {
      return api.execute(endpoint, { method: 'PUT', body });
    },
    [api]
  );

  return {
    ...api,
    put,
  };
}

/**
 * Hook specifically for DELETE requests
 */
export function useApiDelete<T = any>(options?: UseApiOptions) {
  const api = useApi<T>(options);
  
  const del = useCallback(
    (endpoint: string) => {
      return api.execute(endpoint, { method: 'DELETE' });
    },
    [api]
  );

  return {
    ...api,
    delete: del,
  };
}

