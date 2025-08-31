import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    uid: string;
    email: string;
    name: string;
    orderCount: number;
  } | null;
  login: (token: string, user?: any) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
  refreshUser: () => Promise<void>;
  isGoogleOAuth: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      isGoogleOAuth: false,

      login: (token: string, user?: any) => {
        set({ 
          token, 
          isAuthenticated: true,
          user: user || null,
          isGoogleOAuth: token === 'google-oauth'
        });
      },

      logout: () => {
        set({ 
          token: null, 
          isAuthenticated: false,
          user: null,
          isGoogleOAuth: false
        });
      },

      setToken: (token: string | null) => {
        set({ 
          token, 
          isAuthenticated: !!token 
        });
      },

      setUser: (user: any) => {
        set({ user });
      },

      refreshUser: async () => {
        try {
          const response = await fetch('/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${get().token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            set({ user: userData.data });
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      },
    }),
    {
      name: 'trustylads-auth',
      partialize: (state) => ({ 
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isGoogleOAuth: state.isGoogleOAuth
      }),
    }
  )
);

export default useAuthStore;