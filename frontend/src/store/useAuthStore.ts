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
  incrementOrderCount: () => void;
  syncOrderCountFromBackend: () => Promise<void>;
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
          console.log('🔄 Refreshing user data...');
          const token = get().token;
          if (!token) {
            console.log('❌ No token found, skipping refresh');
            return;
          }
          
          const response = await fetch('/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('🔍 Refresh response status:', response.status);
          
          if (response.ok) {
            const userData = await response.json();
            console.log('🔍 Refresh response data:', userData);
            
            if (userData?.success && userData?.data?.user) {
              console.log('✅ User data refreshed successfully:', userData.data.user);
              set({ user: userData.data.user });
            } else {
              console.log('❌ Invalid response format:', userData);
            }
          } else {
            console.log('❌ Refresh failed with status:', response.status);
            const errorText = await response.text();
            console.log('❌ Error response:', errorText);
          }
        } catch (error) {
          console.error('❌ Failed to refresh user data:', error);
        }
      },

      incrementOrderCount: () => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            orderCount: (state.user.orderCount || 0) + 1,
          } : null,
        }));
      },

      syncOrderCountFromBackend: async () => {
        try {
          console.log('🔄 Syncing order count from backend...');
          const token = get().token;
          if (!token) {
            console.log('❌ No token found, skipping sync');
            return;
          }
          
          // Get user's orders to calculate the actual count
          const response = await fetch('/api/orders/my-orders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const ordersData = await response.json();
            if (ordersData?.success && ordersData?.data?.orders) {
              const actualOrderCount = ordersData.data.orders.length;
              console.log('🔍 Actual order count from backend:', actualOrderCount);
              
              // Update the user's order count
              set((state) => ({
                user: state.user ? {
                  ...state.user,
                  orderCount: actualOrderCount,
                } : null,
              }));
              
              console.log('✅ Order count synced successfully');
            }
          }
        } catch (error) {
          console.error('❌ Failed to sync order count:', error);
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