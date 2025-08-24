import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { apiClient } from '../utils/api';
import { initializeGoogleIdentityServices, GOOGLE_CLIENT_ID } from '../utils/firebase';
import toast from 'react-hot-toast';

export const useGoogleAuth = () => {
  const { login, logout, user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Google Identity Services on mount
  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        await initializeGoogleIdentityServices();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Google Identity Services:', error);
        toast.error('Failed to initialize Google authentication');
      }
    };

    initGoogleAuth();
  }, []);

  const signInWithGoogle = async () => {
    if (!isInitialized) {
      // Fallback to redirect flow if GIS not ready
      const apiUrl = import.meta.env.VITE_API_URL || '';
      if (apiUrl) {
        window.location.href = `${apiUrl}/auth/google`;
        return;
      }
      toast.error('Google authentication is not ready yet. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      // Initialize Google Identity Services
      const accounts = await initializeGoogleIdentityServices();
      
      return new Promise((resolve, reject) => {
        // Use One Tap sign-in to get ID token
        accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            if (response.error) {
              console.error('Google OAuth error:', response.error);
              // Fallback to redirect flow if One Tap fails (FedCM restrictions/CORS)
              const apiUrl = import.meta.env.VITE_API_URL || '';
              if (apiUrl) {
                window.location.href = `${apiUrl}/auth/google`;
                return;
              }
              toast.error('Google sign-in failed');
              setIsLoading(false);
              reject(new Error('Google sign-in failed'));
              return;
            }

            try {
              console.log('Google OAuth response:', response);
              
              // Send ID token to backend
              const backendResponse = await apiClient.post<any>('/api/users/loginGoogle', {
                idToken: response.credential,
              });

              if ((backendResponse as any).success) {
                // Store JWT token and user data
                login((backendResponse as any).data.token, (backendResponse as any).data.user);
                toast.success('Successfully signed in with Google!');
                resolve((backendResponse as any).data.user);
              } else {
                reject(new Error('Backend authentication failed'));
              }
            } catch (error: any) {
              console.error('Backend authentication error:', error);
              toast.error(error.response?.data?.message || 'Authentication failed');
              reject(error);
            } finally {
              setIsLoading(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Prompt for Google sign-in
        accounts.id.prompt();
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google');
      setIsLoading(false);
      throw error;
    }
  };

  const signOutUser = async () => {
    setIsLoading(true);
    try {
      logout();
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Sign-out error:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    signOutUser,
    isLoading,
    isInitialized,
    user,
    isAuthenticated,
  };
};

export default useGoogleAuth;
