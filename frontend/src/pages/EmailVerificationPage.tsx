import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const EmailVerificationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setIsError(true);
        setErrorMessage('No verification token provided');
        setIsVerifying(false);
        return;
      }

      try {
        // Use direct axios call instead of apiClient to get the full response
        const response = await fetch(`/api/users/verify/${token}`);
        const responseData = await response.json();
        
        console.log('Verification response:', responseData);
        
        if (responseData?.success) {
          setIsSuccess(true);
          
          // Check if we have user data and token to auto-login
          if (responseData?.data?.user && responseData?.data?.token) {
            const userData = responseData.data.user;
            const authToken = responseData.data.token;
            
            console.log('Auto-login data:', { userData, authToken });
            
            // Auto-login the user with the proper auth token
            login(authToken, {
              uid: userData.uid,
              email: userData.email,
              name: userData.name,
              orderCount: userData.orderCount || 0
            });
            
            console.log('Login called, checking auth state...');
            
            // Wait a bit longer to ensure auth state is properly set
            setTimeout(() => {
              const authState = useAuthStore.getState();
              console.log('Auth state after login:', {
                isAuthenticated: authState.isAuthenticated,
                hasToken: !!authState.token,
                hasUser: !!authState.user,
                user: authState.user
              });
              
              // Also check localStorage
              const storedAuth = localStorage.getItem('trustylads-auth');
              console.log('Stored auth in localStorage:', storedAuth ? JSON.parse(storedAuth) : 'null');
              
              // Double-check auth state before redirect
              if (authState.isAuthenticated && authState.token && authState.user) {
                console.log('Auth state confirmed, redirecting to homepage...');
                toast.success('Email verified successfully! You are now logged in.');
                // Force a full page reload to ensure auth state is properly loaded
                window.location.href = '/';
              } else {
                console.log('Auth state not properly set, trying to fix...');
                
                // Try to manually set the auth state if it's not properly set
                if (authToken && userData) {
                  console.log('Manually setting auth state...');
                  useAuthStore.getState().login(authToken, {
                    uid: userData.uid,
                    email: userData.email,
                    name: userData.name,
                    orderCount: userData.orderCount || 0
                  });
                  
                  // Wait a bit more and check again
                  setTimeout(() => {
                    const newAuthState = useAuthStore.getState();
                    console.log('Auth state after manual fix:', {
                      isAuthenticated: newAuthState.isAuthenticated,
                      hasToken: !!newAuthState.token,
                      hasUser: !!newAuthState.user,
                      user: newAuthState.user
                    });
                    
                    if (newAuthState.isAuthenticated && newAuthState.token && newAuthState.user) {
                      console.log('Manual fix successful, redirecting to homepage...');
                      toast.success('Email verified successfully! You are now logged in.');
                      window.location.href = '/';
                    } else {
                      console.log('Manual fix failed, redirecting to login...');
                      toast.success('Email verified successfully! Please log in.');
                      navigate('/login');
                    }
                  }, 200);
                } else {
                  console.log('No token or user data available, redirecting to login...');
                  toast.success('Email verified successfully! Please log in.');
                  navigate('/login');
                }
              }
            }, 500); // Increased timeout to 500ms
          } else {
            toast.success('Email verified successfully! You can now log in.');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        } else {
          setIsError(true);
          setErrorMessage(responseData?.message || 'Verification failed. Please try again.');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setIsError(true);
        setErrorMessage(error.message || 'Verification failed. The link may be expired or invalid.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <>
      <SEO 
        title="Email Verification - TrustyLads"
        description="Verify your email address to complete your TrustyLads account setup"
        canonical="https://www.trustylads.tech/verify"
        noindex={true}
      />
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/src/assets/images/logo.png" 
                alt="TrustyLads Logo" 
                className='w-16 h-16 sm:w-20 sm:h-20 object-contain' 
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">TrustyLads</h1>
            <p className="text-white/80">Email Verification</p>
          </div>

        {/* Verification Card */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          {isVerifying && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto"></div>
              <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {isSuccess && (
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                        <h2 className="text-xl font-semibold text-gray-900">Email Verified! 🎉</h2>
          <p className="text-gray-600">
            Your email has been successfully verified and you are now logged in! Welcome to TrustyLads!
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
            >
              Start Shopping
            </Link>
            <Link
              to="/shop"
              className="inline-block w-full text-gray-600 hover:text-yellow-500 transition-colors text-center"
            >
              Browse Products
            </Link>
            <p className="text-sm text-gray-500">
              You will be redirected to the homepage automatically in a few seconds...
            </p>
          </div>
            </div>
          )}

          {isError && (
            <div className="space-y-4">
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900">Verification Failed</h2>
              <p className="text-gray-600">{errorMessage}</p>
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="inline-block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
                >
                  Try Again
                </Link>
                <Link
                  to="/"
                  className="inline-block w-full text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Mail className="h-4 w-4 mr-2" />
              Need help? Contact us at support@trustylads.com
            </div>
          </div>
        </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default EmailVerificationPage;
