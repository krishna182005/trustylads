import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Shield, Crown } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useAuthStore } from '../store/useAuthStore';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'user' | 'admin'>('user');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = location.state?.from?.pathname || (authMode === 'admin' ? '/admin' : '/');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'admin') {
        // Admin login
        const response = await apiClient.post('/api/admin/login', {
          email: formData.email,
          password: formData.password
        });

        if (response && (response as any).token) {
          login((response as any).token);
          if ((response as any).refreshToken) {
            localStorage.setItem('trustylads-refresh-token', (response as any).refreshToken);
          }
          toast.success('Admin login successful!');
          navigate('/admin');
        }
      } else {
        // User login/register
        if (isLogin) {
          const response = await apiClient.post<any>('/api/users/login', {
            email: formData.email,
            password: formData.password
          });

          if ((response as any).success) {
            login((response as any).data.token, (response as any).data.user);
            toast.success('Successfully logged in!');
            navigate(from, { replace: true });
          }
        } else {
          const response = await apiClient.post<any>('/api/users/register', {
            name: formData.name,
            email: formData.email,
            password: formData.password
          });

          if ((response as any).success) {
            toast.success('Account created successfully! Please log in.');
            setIsLogin(true);
            setFormData({ email: formData.email, password: '', name: '' });
          }
        }
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error.status === 409) {
        toast.error('An account with this email already exists. Please try logging in instead.');
        setIsLogin(true);
        setFormData({ email: formData.email, password: '', name: '' });
      } else if (error.status === 401) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        toast.error(error.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    toast.success('Successfully signed in with Google!');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TrustyLads</h1>
          <p className="text-white/80">Your lifestyle, your choice</p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1 mb-6">
          <button
            onClick={() => {
              setAuthMode('user');
              setIsLogin(true);
              setFormData({ email: '', password: '', name: '' });
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center space-x-2 ${
              authMode === 'user'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-white hover:text-white/80'
            }`}
          >
            <User className="h-4 w-4" />
            <span>User</span>
          </button>
          <button
            onClick={() => {
              setAuthMode('admin');
              setIsLogin(true);
              setFormData({ email: '', password: '', name: '' });
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center space-x-2 ${
              authMode === 'admin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-white hover:text-white/80'
            }`}
          >
            <Crown className="h-4 w-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Login/Register Card */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Mode Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              authMode === 'admin' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {authMode === 'admin' ? (
                <>
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Admin Access</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span className="font-medium">User Account</span>
                </>
              )}
            </div>
          </div>

          {/* Toggle Buttons (only for user mode) */}
          {authMode === 'user' && (
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
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'user' && !isLogin && (
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
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                authMode === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {authMode === 'admin' ? 'Signing In...' : (isLogin ? 'Signing In...' : 'Creating Account...')}
                </div>
              ) : (
                authMode === 'admin' ? 'Admin Sign In' : (isLogin ? 'Sign In' : 'Create Account')
              )}
            </button>
          </form>

          {/* Google Login (only for user mode) */}
          {authMode === 'user' && (
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
                  variant="outline"
                  size="lg"
                  onSuccess={handleGoogleSuccess}
                />
              </div>
            </>
          )}

          {/* Forgot Password */}
          {authMode === 'user' && isLogin && (
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
    </div>
  );
};

export default LoginPage;
