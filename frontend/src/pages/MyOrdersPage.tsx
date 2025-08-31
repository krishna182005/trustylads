import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, Eye, ExternalLink } from 'lucide-react';
import { apiClient } from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  orderStatus: string;
  total: number;
  trackingId?: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
}

const MyOrdersPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: ordersResponse, isLoading, error } = useQuery({
    queryKey: ['orders', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<any>('/api/orders/my-orders');
      // Normalize orders array from API client
      return (response as any)?.orders || (response as any)?.data?.orders || response || [];
    },
    enabled: isAuthenticated
  });

  const orders = ordersResponse || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '📦';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleTrackOrder = (orderId: string) => {
    navigate(`/track?orderId=${orderId}`);
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading orders</h3>
            <p className="mt-1 text-sm text-gray-500">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">
            Track your orders and view order history
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to see your orders here
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Start Shopping
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order, index: number) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0">
                        <Package className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-3">
                      <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        <span className="mr-1">{getStatusIcon(order.orderStatus)}</span>
                        <span className="hidden sm:inline">{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</span>
                        <span className="sm:hidden">{order.orderStatus.charAt(0).toUpperCase()}</span>
                      </span>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        className="text-yellow-600 hover:text-yellow-700 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                {expandedOrder === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Order Items */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center space-x-3 sm:space-x-4 p-3 bg-gray-50 rounded-lg">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  Size: {item.size} | Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h4>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Total Amount:</span>
                              <span className="font-medium text-gray-900">₹{order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Status:</span>
                              <span className="font-medium text-gray-900 capitalize">
                                {order.orderStatus}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Tracking ID:</span>
                              <span className="font-medium text-gray-900">
                                {order.trackingId || 'Tracking will be available after processing'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Actions</h4>
                          <div className="space-y-2">
                            <button
                              onClick={() => handleTrackOrder(order.orderId)}
                              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Track Order
                            </button>
                            <button
                              onClick={() => navigate(`/track?orderId=${order.orderId}`)}
                              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
