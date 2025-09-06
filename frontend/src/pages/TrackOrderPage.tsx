import React, { useEffect, useState } from 'react';
import { Search, Package, Clock, Truck, CheckCircle, Copy, ExternalLink, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [useTracking, setUseTracking] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelEmail, setCancelEmail] = useState('');
  const [cancelPhone, setCancelPhone] = useState('');
  
  const { isAuthenticated } = useAuthStore();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Mock order data - replace with API call
  // Mock order data - commented out as it's not being used
  // const mockOrderData = {
  //   orderId: 'TL2025001',
  //   customer: {
  //     name: 'Rahul Sharma',
  //     email: 'rahul@example.com',
  //     phone: '+91 9876543210'
  //   },
  //   items: [
  //     {
  //       name: 'Urban Rebel Graphic Tee',
  //       size: 'M',
  //       quantity: 2,
  //       price: 899,
  //       image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=100&h=120&dpr=1'
  //     }
  //   ],
  //   shipping: {
  //     address: '123 Street Name, Mumbai, Maharashtra - 400001, India'
  //   },
  //   orderStatus: 'shipped',
  //   paymentStatus: 'completed',
  //   paymentMethod: 'razorpay',
  //   trackingId: 'MSH123456789',
  //   total: 1897,
  //   estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  //   statusHistory: [
  //     {
  //       status: 'pending',
  //       timestamp: '2025-01-15T10:00:00Z',
  //       note: 'Order received and being processed'
  //     },
  //     {
  //       status: 'processing',
  //       timestamp: '2025-01-15T14:30:00Z',
  //       note: 'Order confirmed and being prepared'
  //     },
  //     {
  //       status: 'shipped',
  //       timestamp: '2025-01-16T09:15:00Z',
  //       note: 'Order shipped via Meesho delivery partner'
  //     }
  //   ],
  //   createdAt: '2025-01-15T10:00:00Z'
  // };

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use the correct API endpoint based on whether we're tracking by orderId or trackingId
      const endpoint = useTracking ? `/api/orders/track/${encodeURIComponent(orderId.trim())}` : `/api/orders/${encodeURIComponent(orderId.trim())}`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found. Please check your order ID and try again.');
        }
        throw new Error('Failed to fetch order details. Please try again.');
      }

      const data = await response.json();
      
      if (data?.success && data?.data) {
        setOrderData(data.data);
      } else {
        setError('Order not found. Please check your order ID and try again.');
        setOrderData(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details. Please check the order ID and try again.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize from query string and auto-trigger tracking
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qOrderId = params.get('orderId');
      const qTrackingId = params.get('trackingId');
      const qUseTracking = params.get('useTracking') || params.get('t');

      if (qTrackingId) {
        setOrderId(qTrackingId);
        setUseTracking(true);
        // Auto track
        setTimeout(() => {
          handleTrackOrder();
        }, 0);
        return;
      }

      if (qOrderId) {
        setOrderId(qOrderId);
        setUseTracking(false);
        // Auto track
        setTimeout(() => {
          handleTrackOrder();
        }, 0);
        return;
      }

      if (qUseTracking === '1' || qUseTracking === 'true') {
        setUseTracking(true);
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  const copyOrderId = () => {
    if (orderData?.orderId) {
      navigator.clipboard.writeText(orderData.orderId);
      toast.success('Order ID copied to clipboard');
    }
  };

  const handleCancelOrder = async () => {
    if (!orderData?.orderId) return;
    
    // For guest users, validate that at least one verification field is provided
    if (!isAuthenticated) {
      if (!cancelEmail && !cancelPhone) {
        toast.error('Please provide either email or phone number to verify your identity');
        return;
      }
    }
    
    setCancelling(true);
    try {
      const response = await fetch(`/api/orders/${orderData.orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        },
        body: JSON.stringify({
          email: cancelEmail || (isAuthenticated ? orderData.customer.email : undefined),
          phone: cancelPhone || (isAuthenticated ? orderData.customer.phone : undefined)
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Order cancelled successfully');
        setShowCancelModal(false);
        // Clear form fields
        setCancelEmail('');
        setCancelPhone('');
        // Refresh order data
        handleTrackOrder();
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = () => {
    if (!orderData) return false;
    const nonCancellableStatuses = ['shipped', 'delivered', 'cancelled'];
    return !nonCancellableStatuses.includes(orderData.orderStatus.toLowerCase());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Received', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your order ID to get real-time updates</p>
        </motion.div>

        {/* Search Form */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                {useTracking ? 'Tracking ID' : 'Order ID'}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                  placeholder={useTracking ? 'Enter tracking ID' : 'Enter order ID (e.g., TL2025001)'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>
            <div className="md:self-end flex items-center gap-3">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <input type="checkbox" checked={useTracking} onChange={(e) => setUseTracking(e.target.checked)} />
                Search by tracking ID
              </label>
              <button
                onClick={handleTrackOrder}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Tracking...
                  </span>
                ) : (
                  'Track Order'
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>💡 Tip: Try order ID <strong>TL2025001</strong> for demo</p>
          </div>
        </motion.div>

        {/* Order Details */}
        {orderData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Order <span className="text-sm sm:text-base font-mono">{orderData.orderId}</span>
                    </h2>
                    <button onClick={copyOrderId} className="text-gray-400 hover:text-gray-600">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Placed on {format(new Date(orderData.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(orderData.orderStatus)}`}>
                  {orderData.orderStatus.charAt(0).toUpperCase() + orderData.orderStatus.slice(1)}
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="mb-6">
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {statusSteps.map((step, index) => {
                    const currentStepIndex = getCurrentStepIndex(orderData.orderStatus);
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isCurrent
                            ? 'bg-yellow-400 border-yellow-400 text-black'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          <step.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <span className={`text-xs font-medium text-center leading-tight ${
                          isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress Bar */}
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded"></div>
                  <div 
                    className="absolute top-0 left-0 h-1 bg-green-500 rounded transition-all duration-500"
                    style={{ width: `${(getCurrentStepIndex(orderData.orderStatus) / (statusSteps.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Tracking Info */}
              {orderData.trackingId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">Tracking ID</p>
                      <p className="text-blue-700">{orderData.trackingId}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Estimated Delivery */}
              {orderData.estimatedDelivery && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-medium text-yellow-900">Estimated Delivery</p>
                  <p className="text-yellow-700">
                    {format(new Date(orderData.estimatedDelivery), 'EEEE, MMM dd, yyyy')}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                        <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">₹{orderData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
                <div className="space-y-4">
                  {orderData.statusHistory.map((status: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(status.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">
                          {status.status.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">{status.note}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(status.timestamp), 'MMM dd, yyyy - hh:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier & Delivery Info */}
              {(orderData.courier || orderData.estimatedDelivery) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
                  <div className="space-y-3">
                    {orderData.courier && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Courier:</span>
                        <span className="font-medium text-gray-900">{orderData.courier}</span>
                      </div>
                    )}
                    {orderData.trackingId && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tracking ID:</span>
                        <span className="font-mono text-sm text-blue-600">{orderData.trackingId}</span>
                      </div>
                    )}
                    {orderData.estimatedDelivery && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Expected Delivery:</span>
                        <span className="font-medium text-gray-900">
                          {format(new Date(orderData.estimatedDelivery), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">{orderData.customer.name}</p>
                  <p>{orderData.shipping.address}</p>
                  <p className="mt-3 text-sm">{orderData.customer.phone}</p>
                  <p className="text-sm">{orderData.customer.email}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium capitalize">
                      {orderData.paymentMethod === 'razorpay' ? 'Online Payment' : orderData.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      orderData.paymentStatus === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel Order Button */}
            {canCancelOrder() && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Order Actions</h3>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Cancel Order
                </button>
              </div>
            )}

            {/* Support */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/916369360104?text=Hi, I need help with my order tracking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white font-medium py-3 px-4 rounded-lg text-center hover:bg-green-600 transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href="mailto:support@trustylads.tech?subject=Order Tracking Support"
                  className="flex-1 bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
                >
                  Gmail
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              
              {!isAuthenticated && (
                <div className="space-y-3 mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Verification Required:</strong> Please provide either the email address or phone number you used when placing this order.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-gray-500">(optional if phone provided)</span>
                    </label>
                    <input
                      type="email"
                      value={cancelEmail}
                      onChange={(e) => setCancelEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-gray-500">(optional if email provided)</span>
                    </label>
                    <input
                      type="tel"
                      value={cancelPhone}
                      onChange={(e) => setCancelPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    You must provide at least one of the above to verify your identity.
                  </p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling || (!isAuthenticated && !cancelEmail && !cancelPhone)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;