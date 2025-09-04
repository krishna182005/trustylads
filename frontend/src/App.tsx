import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ReturnsRefundsPage from './pages/ReturnsRefundsPage';
import ShippingInfoPage from './pages/ShippingInfoPage';
import SizeGuidePage from './pages/SizeGuidePage';
import LazyAdminPanel from './components/LazyAdminPanel';
import AdminLoginPage from './pages/AdminLoginPage';
import BadgesDemo from './pages/BadgesDemo';
import AboutPage from './pages/AboutPage';
import ContactUsPage from './pages/ContactUsPage';
import ErrorBoundary from './components/ErrorBoundary';
import GoogleAuthHandler from './components/GoogleAuthHandler';
import CartSidebar from './components/CartSidebar';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const isAdminAuthed = Boolean(localStorage.getItem('adminToken') || localStorage.getItem('trustylads-admin-token'));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
    <ErrorBoundary>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                  <Route path="/orders" element={<MyOrdersPage />} />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="/track" element={<TrackOrderPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth/google/callback" element={<GoogleAuthHandler />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/refund-policy" element={<RefundPolicyPage />} />
                  <Route path="/returns" element={<ReturnsRefundsPage />} />
                  <Route path="/shipping" element={<ShippingInfoPage />} />
                  <Route path="/size-guide" element={<SizeGuidePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactUsPage />} />
                  <Route path="/badges-demo" element={<BadgesDemo />} />
                  
                  {/* Admin Routes: Only accessible via /admin/login with proper authentication */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route 
                    path="/admin" 
                    element={isAdminAuthed ? <LazyAdminPanel /> : <Navigate to="/admin/login" replace />} 
                  />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <CartSidebar />
            <Toaster position="top-right" />
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
      </QueryClientProvider>
  );
};

export default App;