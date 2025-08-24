import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

interface RefreshTokenResponse {
  token: string;
}

/**
 * Custom hook for authentication management
 */
export const useAuth = () => {
  const { token, isAuthenticated, login: loginStore, logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();

  /**
   * Login mutation
   */
  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      return apiClient.post('/api/auth/login', credentials);
    },
    onSuccess: (data) => {
      loginStore(data.token);
      
      // Store refresh token in httpOnly cookie via API call
      apiClient.post('/api/auth/set-refresh-token', {
        refreshToken: data.refreshToken
      });
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast.success('Login successful');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post('/api/auth/logout');
    },
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Even if API call fails, logout locally
      logoutStore();
      queryClient.clear();
      toast.success('Logged out');
    },
  });

  /**
   * Refresh token mutation
   */
  const refreshTokenMutation = useMutation<RefreshTokenResponse, Error>({
    mutationFn: async () => {
      return apiClient.post('/api/auth/refresh');
    },
    onSuccess: (data) => {
      loginStore(data.token);
    },
    onError: () => {
      // If refresh fails, logout user
      logoutStore();
      queryClient.clear();
    },
  });

  /**
   * Fetch current user data
   */
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => apiClient.get('/api/auth/me'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if unauthorized
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string): boolean => {
    return (user as any)?.role === role;
  };

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  /**
   * Auto-refresh token before expiry
   */
  const setupTokenRefresh = () => {
    if (!token) return;

    try {
      // Decode JWT to get expiry time
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      
      // Refresh token 5 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
      
      if (refreshTime > 0) {
        setTimeout(() => {
          refreshTokenMutation.mutate();
        }, refreshTime);
      }
    } catch {
      console.error('Error setting up token refresh');
    }
  };

  // Setup token refresh on mount and token change
  React.useEffect(() => {
    setupTokenRefresh();
  }, [token]);

  /**
   * Login function
   */
  const login = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  /**
   * Logout function
   */
  const logout = () => {
    logoutMutation.mutate();
  };

  /**
   * Refresh token function
   */
  const refreshToken = () => {
    refreshTokenMutation.mutate();
  };

  /**
   * Check if token is expired
   */
  const isTokenExpired = (): boolean => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      return Date.now() >= expiryTime;
    } catch {
      return true;
    }
  };

  /**
   * Get token expiry time
   */
  const getTokenExpiry = (): Date | null => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  };

  return {
    // State
    isAuthenticated,
    user,
    token,
    isLoadingUser,
    
    // Actions
    login,
    logout,
    refreshToken,
    
    // Loading states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshTokenMutation.isPending,
    
    // Utilities
    hasRole,
    isAdmin,
    isTokenExpired,
    getTokenExpiry,
    
    // Errors
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    refreshError: refreshTokenMutation.error,
  };
};

export default useAuth;