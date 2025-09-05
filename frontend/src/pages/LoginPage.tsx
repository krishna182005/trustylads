import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import VerificationModal from '../components/VerificationModal';
import { useAuthStore } from '../store/useAuthStore';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationType, setVerificationType] = useState<'success' | 'info' | 'error'>('info');
  const [isResending, setIsResending] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = location.state?.from?.pathname || '/';

  // Resend verification email
  const handleResendVerification = async () => {
    if (!verificationEmail) return;
    
    setIsResending(true);
    try {
      await apiClient.post('/api/users/resend-verification', {
        email: verificationEmail
      });
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  // Warn if cookies are disabled (sign-in requires cookies)
  useEffect(() => {
    try {
      if (typeof navigator !== 'undefined' && navigator.cookieEnabled === false) {
        toast.error('Cookies are disabled in your browser. Please enable cookies to sign in.');
      }
    } catch {}
  }, []);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // With apiClient wrapper, responses are already unwrapped to data
      if (isLogin) {
        const response: any = await apiClient.post('/api/users/login', {
          email: formData.email,
          password: formData.password
        });

        // Handle both direct response and nested data response
        const responseData = response?.data || response;
        if (responseData?.token && responseData?.user) {
          login(responseData.token, responseData.user);
          toast.success('Successfully logged in!');
          navigate(from, { replace: true });
        } else {
          toast.error('Unexpected login response. Please try again.');
        }
      } else {
        const response: any = await apiClient.post('/api/users/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        // Handle both direct response and nested data response for registration
        const responseData = response?.data || response;
        if (responseData?.token && responseData?.user) {
          login(responseData.token, responseData.user);
          toast.success('Welcome! Account created.');
          navigate(from, { replace: true });
        } else {
          // New verification flow - show professional modal
          setVerificationEmail(formData.email);
          setVerificationType('success');
          setShowVerificationModal(true);
          setIsLogin(true);
          setFormData({ email: formData.email, password: '', name: '' });
        }
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error.status === 409) {
        toast.error('An account with this email already exists. Please try logging in instead.');
        setIsLogin(true);
        setFormData({ email: formData.email, password: '', name: '' });
      } else if (error.status === 401) {
        if (error.message?.includes('verify your email')) {
          toast.error('Please verify your email before logging in. Check your inbox for a verification link.');
        } else {
          toast.error('Invalid email or password. Please try again.');
        }
      } else {
        // Check if it's an email sending error
        if (error.message?.includes('email') || error.message?.includes('SMTP')) {
          setVerificationEmail(formData.email);
          setVerificationType('error');
          setShowVerificationModal(true);
        } else {
          toast.error(error.message || 'Authentication failed');
        }
        console.error('Login error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <SEO 
        title="Login - TrustyLads"
        description="Sign in to your TrustyLads account to access your orders, wishlist, and exclusive offers."
        canonical="https://www.trustylads.tech/login"
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
              src="/logo.svg" 
              alt="TrustyLads Logo" 
              className='w-16 h-16 sm:w-20 sm:h-20 object-contain' 
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">TrustyLads</h1>
          <p className="text-white/80">Your lifestyle, your choice</p>
        </div>



        {/* Login/Register Card */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Google Login */}
          <>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="mb-6">
              <GoogleLoginButton
                className="w-full"
              >
                Sign in with Google
              </GoogleLoginButton>
            </div>
          </>

          {/* Forgot Password */}
          {isLogin && (
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-yellow-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-yellow-500 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={verificationEmail}
        type={verificationType}
        onResend={handleResendVerification}
        isResending={isResending}
      />
    </div>
    </>
  );
};

export default LoginPage;
