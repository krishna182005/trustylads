import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGoogleAuth = () => {
  const navigate = useNavigate();

  const signInWithGoogle = useCallback(async () => {
    try {
      // Store the current path for redirect after auth
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/') {
        sessionStorage.setItem('googleAuthRedirect', currentPath);
      }

      // Redirect to backend OAuth endpoint
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-91cb.onrender.com');
      window.location.href = `${apiUrl}/auth/google`;
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
      throw error;
    }
  }, [navigate]);

  return {
    signInWithGoogle,
  };
};
