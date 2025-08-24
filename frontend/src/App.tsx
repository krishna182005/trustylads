import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from './components/ToastNotification';

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminPanel from './pages/AdminPanel';
import AdminLoginPage from './pages/AdminLoginPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Policy and Info Pages
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import SizeGuidePage from './pages/SizeGuidePage';
import ReturnsRefundsPage from './pages/ReturnsRefundsPage';
import ShippingInfoPage from './pages/ShippingInfoPage';
import FAQPage from './pages/FAQPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 0, // Always refetch when invalidated
      refetchOnWindowFocus: true, // Refetch when window regains focus
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                  <Route path="/track" element={<TrackOrderPage />} />
                  <Route path="/account/orders" element={<MyOrdersPage />} />
                  
                  {/* Auth Pages */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  
                  {/* Policy and Info Pages */}
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/refund-policy" element={<RefundPolicyPage />} />
                  <Route path="/size-guide" element={<SizeGuidePage />} />
                  <Route path="/returns-refunds" element={<ReturnsRefundsPage />} />
                  <Route path="/shipping-info" element={<ShippingInfoPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin/*" element={<AdminPanel />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </main>
              <Footer />
              <CartSidebar />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;