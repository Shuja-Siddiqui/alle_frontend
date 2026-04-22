/**
 * API Client Configuration
 * Centralized API client with interceptors and error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiConfig {
  method: ApiMethod;
  headers?: HeadersInit;
  body?: any;
  token?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export class ApiError extends Error {
  statusCode: number;
  response?: any;

  constructor(message: string, statusCode: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

function handleExpiredTokenRedirect(responseData: any, statusCode: number) {
  if (typeof window === 'undefined') return;
  if (statusCode !== 401) return;

  const message = String(responseData?.message || responseData?.error || '').toLowerCase();
  const isExpiredToken =
    message.includes('invalid or expired token') ||
    message.includes('expired token') ||
    message.includes('jwt expired') ||
    message.includes('invalid token');

  if (!isExpiredToken) return;

  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  window.location.href = '/';
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Build request headers
 */
function buildHeaders(config: ApiConfig): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  // Add auth token if available
  const token = config.token || getAuthToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Main API client function
 */
export async function apiClient<T = any>(
  endpoint: string,
  config: ApiConfig
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const requestConfig: RequestInit = {
    method: config.method,
    headers: buildHeaders(config),
  };

  // Add body for non-GET requests
  if (config.body && config.method !== 'GET') {
    requestConfig.body = JSON.stringify(config.body);
  }

  // Log request
  console.log(`🌐 API Request: ${config.method} ${url}`, {
    endpoint,
    method: config.method,
    body: config.body,
    headers: buildHeaders(config),
  });

  try {
    const response = await fetch(url, requestConfig);

    // Parse response
    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Log response
    console.log(`✅ API Response: ${config.method} ${url}`, {
      status: response.status,
      statusText: response.statusText,
      data,
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
      handleExpiredTokenRedirect(data, response.status);
      console.error(`❌ API Error: ${config.method} ${url}`, {
        status: response.status,
        statusText: response.statusText,
        errorMessage,
        responseData: data,
      });
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    // Re-throw ApiError as-is (already logged above)
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      console.error(`❌ Network Error: ${config.method} ${url}`, error);
      throw new ApiError('Network error. Please check your connection.', 0);
    }

    // Handle other errors
    console.error(`❌ Unexpected Error: ${config.method} ${url}`, error);
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    );
  }
}

/**
 * Convenience methods
 */
export const api = {
  get: <T = any>(endpoint: string, token?: string) =>
    apiClient<T>(endpoint, { method: 'GET', token }),

  post: <T = any>(endpoint: string, body?: any, token?: string) =>
    apiClient<T>(endpoint, { method: 'POST', body, token }),

  put: <T = any>(endpoint: string, body?: any, token?: string) =>
    apiClient<T>(endpoint, { method: 'PUT', body, token }),

  patch: <T = any>(endpoint: string, body?: any, token?: string) =>
    apiClient<T>(endpoint, { method: 'PATCH', body, token }),

  delete: <T = any>(endpoint: string, token?: string) =>
    apiClient<T>(endpoint, { method: 'DELETE', token }),
};

