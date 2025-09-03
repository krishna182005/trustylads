/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  uid: string;
  email: string;
  name: string;
  orderCount: number;
}

interface Order {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface OrdersResponse {
  success?: boolean;
  data?: {
    orders: Order[];
  };
  orders?: Order[];
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  // eslint-disable-next-line no-unused-vars
  login: (token: string, user?: User) => void;
  logout: () => void;
  // eslint-disable-next-line no-unused-vars
  setToken: (token: string | null) => void;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: User) => void;
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

      login: (token: string, user?: User) => {
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

      setUser: (user: User) => {
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
            if (import.meta.env.DEV) {
              console.log('🔍 Refresh response status:', userData?.success);
            }
            
            if (userData?.success && userData?.data?.user) {
              if (import.meta.env.DEV) {
                console.log('✅ User data refreshed successfully');
              }
              set({ user: userData.data.user });
            } else {
              if (import.meta.env.DEV) {
                console.log('❌ Invalid response format');
              }
            }
          } else {
            if (import.meta.env.DEV) {
              console.log('❌ Refresh failed with status:', response.status);
            }
            const errorText = await response.text();
            if (import.meta.env.DEV) {
              console.log('❌ Error response:', errorText);
            }
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
          
          // Import apiClient dynamically to avoid circular dependencies
          const { apiClient } = await import('../utils/api');
          
          // Get user's orders to calculate the actual count using apiClient
          const ordersData = await apiClient.get<OrdersResponse>('/api/orders/my-orders');
          
          // Normalize the response format (same as MyOrdersPage)
          const orders = ordersData?.orders || ordersData?.data?.orders || [];
          
          if (Array.isArray(orders)) {
            const actualOrderCount = orders.length;
            console.log('🔍 Actual order count from backend:', actualOrderCount);
            
            // Update the user's order count
            set((state) => ({
              user: state.user ? {
                ...state.user,
                orderCount: actualOrderCount,
              } : null,
            }));
            
            console.log('✅ Order count synced successfully');
          } else {
            console.log('❌ Invalid orders data format:', orders);
          }
        } catch (error: unknown) {
          console.error('❌ Failed to sync order count:', error);
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status === 401) {
              console.log('🔐 Token appears to be invalid or expired');
              // Optionally clear the token and log out the user
              // set({ token: null, isAuthenticated: false, user: null });
            }
          }
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
