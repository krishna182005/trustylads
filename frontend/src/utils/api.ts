import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { captureApiError } from './sentry';

// Resolve API base URL: use VITE_API_URL, else fallback to backend in production, else '' in dev (Vite proxy)
const resolvedBaseURL = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim().length > 0)
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? '' : 'https://api.trustylads.tech'); // Use custom backend domain in production

// Debug logging for API configuration
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  DEV: import.meta.env.DEV,
  resolvedBaseURL,
  currentOrigin: window.location.origin
});

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check for admin token first, then regular user token
    const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('trustylads-admin-token');
    const userToken = useAuthStore.getState().token;
    
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    
    // For Google OAuth users, include credentials to send httpOnly cookies
    if (useAuthStore.getState().isGoogleOAuth || (useAuthStore.getState().isAuthenticated && !adminToken && !userToken)) {
      config.withCredentials = true;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const originalRequest: any = error.config || {};

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('trustylads-refresh-token');
          if (refreshToken) {
            const response = await axios.post(`${api.defaults.baseURL}/api/admin/refresh`, {
              refreshToken
            });

            const { token } = response.data.data;

            localStorage.setItem('adminToken', token);
            localStorage.setItem('trustylads-admin-token', token);
            useAuthStore.getState().setToken(token);

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch {
          useAuthStore.getState().logout();
          localStorage.removeItem('trustylads-refresh-token');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('trustylads-admin-token');

          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        }
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Request throttling to prevent rate limiting
class RequestThrottler {
  private requests: Map<string, number> = new Map();
  private readonly delay = 1000; // 1 second delay between requests to same endpoint

  async throttle(endpoint: string): Promise<void> {
    const lastRequest = this.requests.get(endpoint);
    const now = Date.now();
    
    if (lastRequest && (now - lastRequest) < this.delay) {
      const waitTime = this.delay - (now - lastRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requests.set(endpoint, Date.now());
  }
}

// API client wrapper with better error handling
class ApiClient {
  private api: AxiosInstance;
  private throttler: RequestThrottler;

  constructor(axiosInstance: AxiosInstance) {
    this.api = axiosInstance;
    this.throttler = new RequestThrottler();
  }

  private containsSensitiveData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential', 'jwt'];
    const dataStr = JSON.stringify(data).toLowerCase();
    
    return sensitiveKeys.some(key => dataStr.includes(key));
  }

  private handleResponse<T>(response: AxiosResponse<any>): T {
    // Only log in development mode and avoid logging sensitive data
    if (import.meta.env.DEV) {
      console.log('🔍 API Response status:', response.status);
      console.log('🔍 Raw response data:', response.data);
    }
    
    // Backend returns { success: true, data: actualData } format
    if (response.data && response.data.success === true) {
      const result = response.data.data || response.data;
      // Only log non-sensitive data in development
      if (import.meta.env.DEV && !this.containsSensitiveData(result)) {
        console.log('🔍 API Response processed:', result);
      }
      if (import.meta.env.DEV) {
        console.log('🔍 Returning processed result:', result);
        console.log('🔍 Result type:', typeof result);
        console.log('🔍 Result keys:', Object.keys(result || {}));
      }
      return result;
    }
    
    // Handle case where success is false
    if (response.data && response.data.success === false) {
      throw new Error(response.data.message || 'API request failed');
    }
    
    // Fallback to direct response data
    if (import.meta.env.DEV && !this.containsSensitiveData(response.data)) {
      console.log('🔍 API Response fallback:', response.data);
    }
    if (import.meta.env.DEV) {
      console.log('🔍 Returning fallback data:', response.data);
      console.log('🔍 Fallback data type:', typeof response.data);
      console.log('🔍 Fallback data keys:', Object.keys(response.data || {}));
    }
    return response.data;
  }

  private handleError(error: unknown): never {
    if (import.meta.env.DEV) {
      console.log('🔍 API Client handleError called:', error);
    }
    
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as any)?.message || error.message || 'Request failed';
      const status = error.response?.status ?? 0;
      
      if (import.meta.env.DEV) {
        console.log('🔍 Axios error:', { message, status, data: error.response?.data });
      }
      
      // Capture API errors in Sentry
      captureApiError(error, 'api-client');
      
      throw {
        message,
        status,
        data: error.response?.data,
        isApiError: true,
      };
    }

    const fallbackMessage = (error as any)?.message || 'An unexpected error occurred';
    
    if (import.meta.env.DEV) {
      console.log('🔍 Unknown error:', fallbackMessage);
    }
    
    // Capture unknown errors in Sentry
    captureApiError(error, 'api-client-unknown');
    
    throw {
      message: fallbackMessage,
      status: 0,
      isUnknownError: true,
    };
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      await this.throttler.throttle(url);
      const response = await this.api.get(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      await this.throttler.throttle(url);
      if (import.meta.env.DEV) {
        console.log('🔄 API Client POST:', url, data);
      }
      const response = await this.api.post(url, data, config);
      if (import.meta.env.DEV) {
        console.log('🔄 API Client POST response received:', response.status);
      }
      const result = this.handleResponse<T>(response);
      if (import.meta.env.DEV) {
        console.log('🔄 API Client POST result:', result);
      }
      return result;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('🔄 API Client POST error:', error);
      }
      return this.handleError(error);
    }
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      await this.throttler.throttle(url);
      const response = await this.api.put(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      await this.throttler.throttle(url);
      const response = await this.api.patch(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      await this.throttler.throttle(url);
      const response = await this.api.delete(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Upload file with progress
  async uploadFile<T = unknown>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Download file
  async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.api.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get raw axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(api);

// Export the raw axios instance for direct usage if needed
export { api };

// Utility functions for common API patterns
export const createApiHook = <T>(url: string) => {
  return {
    get: () => apiClient.get<T>(url),
    post: (data: unknown) => apiClient.post<T>(url, data),
    put: (data: unknown) => apiClient.put<T>(url, data),
    delete: () => apiClient.delete<T>(url),
  };
};

// Error type guards
export const isApiError = (error: unknown): error is { message: string; status: number; data: unknown; isApiError: true } => {
  return typeof error === 'object' && error !== null && 'isApiError' in error && (error as any).isApiError === true;
};

export const isNetworkError = (error: unknown): error is { message: string; status: 0; isNetworkError: true } => {
  return typeof error === 'object' && error !== null && 'isNetworkError' in error && (error as any).isNetworkError === true;
};

export const isUnknownError = (error: unknown): error is { message: string; status: 0; isUnknownError: true } => {
  return typeof error === 'object' && error !== null && 'isUnknownError' in error && (error as any).isUnknownError === true;
};

export default apiClient;