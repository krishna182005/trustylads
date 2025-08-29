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
  isGoogleOAuth: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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