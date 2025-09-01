import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const { user, isAuthenticated, syncOrderCountFromBackend } = useAuthStore();
  const subtotal = getSubtotal();

  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync order count from backend when component mounts for authenticated users
  React.useEffect(() => {
    if (isAuthenticated) {
      syncOrderCountFromBackend();
    }
  }, [isAuthenticated, syncOrderCountFromBackend]);

  // Sync order count when page becomes visible (user returns from order success page)
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        console.log('🔄 Cart page became visible, syncing order count...');
        syncOrderCountFromBackend();
      }
    };

    const handleFocus = () => {
      if (isAuthenticated) {
        console.log('🔄 Cart page focused, syncing order count...');
        syncOrderCountFromBackend();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, syncOrderCountFromBackend]);
  
  // Calculate discount (example: 10% off for products over ₹500)
  const discountPercentage = 10;
  const discountAmount = subtotal >= 500 ? Math.round(subtotal * (discountPercentage / 100)) : 0;
  
  // Free delivery for first 5 orders for signed-in users ONLY
  const isEligibleForFreeDelivery = isAuthenticated && user && (user.orderCount || 0) < 5;
  const shipping = isEligibleForFreeDelivery ? 0 : 99; // After first 5 orders, always ₹99 shipping
  
  // All taxes are included in product prices
  const total = subtotal - discountAmount + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center max-w-md mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some trendy items to get started!</p>
          <Link
            to="/shop"
            className="inline-flex items-center bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/shop"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6">Cart Items</h2>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.productId}-${item.size}`}
                      className="flex items-center space-x-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <img
                        src={item.image || '/api/placeholder/100/120'}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                        <p className="font-semibold text-gray-900 mt-1">₹{item.price.toLocaleString()}</p>
                        
                        {item.quantity >= item.maxStock && (
                          <p className="text-xs text-orange-600 mt-1">Max stock reached</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="text-red-500 hover:text-red-700 transition-colors mt-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-green-600">Discount ({discountPercentage}% off)</span>
                      <span className="font-medium text-green-600">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  
                                     <div className="flex justify-between text-gray-500">
                     <span className="text-gray-600">Includes all taxes</span>
                   </div>
                   
                   <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
                             {!isEligibleForFreeDelivery && (
                 <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                   <p className="text-sm text-blue-700">
                     {isAuthenticated ? 'Free shipping for your first 5 orders!' : 'Sign in for free shipping on your first 5 orders!'}
                   </p>
                 </div>
               )}
              
              <Link
                to="/checkout"
                className="w-full bg-yellow-400 text-black font-semibold py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors text-center block"
              >
                Proceed to Checkout
              </Link>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Arrives in our signature neon yellow box! 📦
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;