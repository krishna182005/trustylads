import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User, LogOut, X, Home, ShoppingCart, Truck, Shield, Package } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import useGoogleAuth from '../hooks/useGoogleAuth';
import GoogleLoginButton from './GoogleLoginButton';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const location = useLocation();
  const { getItemsCount, openCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { signOutUser } = useGoogleAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemsCount = getItemsCount();

  // Check if user is admin by looking for admin token
  const isAdmin = !!localStorage.getItem('adminToken') || !!localStorage.getItem('trustylads-admin-token');

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    logout();
    signOutUser();
    // Also clear admin tokens
    localStorage.removeItem('adminToken');
    localStorage.removeItem('trustylads-admin-token');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/shop', label: 'Shop', icon: ShoppingCart },
    { path: '/track', label: 'Track Order', icon: Truck },
  ];

  return (
    <motion.header 
      className="bg-white shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => { closeMobileMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded">
              <img src="https://cdn.pixabay.com/animation/2023/01/10/22/36/22-36-58-425_512.gif" alt="logo" className='w-8 h-8 sm:w-10 sm:h-10' />
            </div>
            <span className="font-bold text-lg sm:text-xl text-gray-900">TrustyLads</span>
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">- Your Lifestyle Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`font-medium transition-colors ${
                  isActive(item.path) ? 'text-yellow-500' : 'text-gray-700 hover:text-yellow-500'
                }`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/shop?focus=search" 
              className="text-gray-700 hover:text-yellow-500 transition-colors"
              title="Search products"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Search className="h-5 w-5" />
            </Link>
            
            <button 
              onClick={openCart}
              className="relative text-gray-700 hover:text-yellow-500 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemsCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {itemsCount}
                </motion.span>
              )}
            </button>

            {/* Always show Admin icon if admin token exists */}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                title="Admin Panel"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Shield className="h-5 w-5" />
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Hi, {user?.name || 'User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-yellow-500 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Search */}
            <Link 
              to="/shop?focus=search" 
              className="text-gray-700 hover:text-yellow-500 transition-colors"
              onClick={closeMobileMenu}
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button 
              onClick={() => {
                openCart();
                closeMobileMenu();
              }}
              className="relative text-gray-700 hover:text-yellow-500 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemsCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {itemsCount}
                </motion.span>
              )}
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation */}
              <nav className="space-y-3">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => { closeMobileMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-yellow-50 text-yellow-600 border-l-4 border-yellow-500'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-yellow-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="border-t border-gray-200 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">
                        Hi, {user?.name || 'User'}
                      </span>
                    </div>
                    
                    {/* Admin Panel Link - Mobile */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => { closeMobileMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-yellow-500 rounded-lg transition-colors"
                      >
                        <Shield className="h-5 w-5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    
                    <Link
                      to="/account/orders"
                      onClick={() => { closeMobileMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-yellow-500 rounded-lg transition-colors"
                    >
                      <Package className="h-5 w-5" />
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Show Admin Panel link even if not user-authenticated, when admin token exists */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => { closeMobileMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-yellow-500 rounded-lg transition-colors"
                      >
                        <Shield className="h-5 w-5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      to="/login"
                      onClick={() => { closeMobileMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all text-center block"
                    >
                      Sign In
                    </Link>
                    <div className="px-4">
                      <GoogleLoginButton
                        className="w-full"
                        variant="outline"
                        size="lg"
                        onSuccess={() => {
                          closeMobileMenu();
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;