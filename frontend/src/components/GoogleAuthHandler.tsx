import React, { useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const GoogleAuthHandler: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  const handleGoogleAuth = useCallback(async () => {
    const loginStatus = searchParams.get('login');

    if (loginStatus === 'success') {
      try {
        // The token is now in an httpOnly cookie, so we need to verify the user is authenticated
        // by making a request to the backend to get user info
        const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://backend-91cb.onrender.com');
        const response = await fetch(`${apiUrl}/api/users/me`, {
          credentials: 'include', // Include cookies
        });
        
        if (response.ok) {
          const payload = await response.json();
          
          // Support both { data: { user: {...} } } and legacy { data: {...} }
          const payloadData = payload?.data || {};
          const userFromApi = payloadData.user || payloadData;

          if (payload?.success && userFromApi) {
            const user = {
              uid: userFromApi.id || userFromApi._id,
              email: userFromApi.email,
              name: userFromApi.name || 'Google User',
              orderCount: userFromApi.orderCount || 0,
            };
            login('google-oauth', user);
          }
          
          // User is authenticated, redirect to the stored path or home
          toast.success('Successfully signed in with Google!');
          const redirectPath = sessionStorage.getItem('googleAuthRedirect') || '/';
          sessionStorage.removeItem('googleAuthRedirect');
          navigate(redirectPath, { replace: true });
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Error processing Google auth:', error);
        toast.error('Failed to process Google authentication');
        navigate('/login', { replace: true });
      }
    } else if (loginStatus === 'failed') {
      toast.error('Google authentication failed. Please try again.');
      navigate('/login', { replace: true });
    } else {
      // No auth parameters, redirect to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, login, navigate]);

  // Handle the OAuth callback
  useEffect(() => {
    if (searchParams.get('login') === 'success') {
      handleGoogleAuth();
    }
  }, [handleGoogleAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Processing Google authentication...</p>
      </div>
    </div>
  );
};

export default GoogleAuthHandler;
