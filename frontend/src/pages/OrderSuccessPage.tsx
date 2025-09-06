import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, Package, Truck, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Order } from '../types';
import { apiClient } from '../utils/api';
import { format, addDays } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
// import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  // const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  // Note: isAuthenticated is used to determine if order was placed by guest user
  // const { isAuthenticated } = useAuthStore();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch order details
  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => apiClient.get(`/api/orders/${orderId}`),
    enabled: !!orderId,
    retry: 1,
  });

  // Send confirmation email
  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (order && !emailSent) {
        try {
          await apiClient.post('/api/orders/send-confirmation', {
            orderId: order.orderId,
            email: order.customer.email
          });
          setEmailSent(true);
        } catch (error) {
          console.error('Failed to send confirmation email:', error);
        }
      }
    };

    sendConfirmationEmail();
  }, [order, emailSent]);

  const copyOrderId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
      toast.success('Order ID copied to clipboard!');
    }
  };

  const estimatedDelivery = order ? addDays(new Date(order.createdAt), 7) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-red-500 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the order you're looking for. Please check your order ID or contact support.
            </p>
            <div className="space-y-3">
              <Link
                to="/track"
                className="block bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Track Another Order
              </Link>
              <Link
                to="/"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-md p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
            <p className="text-gray-600 mb-4">
              Thank you for shopping with TrustyLads! We've received your payment and will start processing your order shortly.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>For any order queries, contact us at:</strong><br />
                📧 <a href="mailto:support@trustylads.tech" className="text-blue-600 hover:text-blue-700">support@trustylads.tech</a><br />
                📞 <a href="tel:+916369360104" className="text-blue-600 hover:text-blue-700">+91 6369360104</a>
              </p>
              <p className="text-blue-700 text-xs mt-2">
                <strong>Note:</strong> Tracking details will be emailed to you within 24 hours.
              </p>
              <p className="text-green-700 text-xs mt-2">
                <strong>For any queries, chat with us on WhatsApp:</strong> <a href="https://wa.me/916369360104" className="text-green-600 hover:text-green-700">+91 6369360104</a>
              </p>
            </div>
            
            {/* Order ID */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm font-medium text-yellow-800">Order ID:</span>
                <Link
                  to={`/track?orderId=${order.orderId}`}
                  className="text-lg font-bold text-yellow-900 underline"
                  title="View order details"
                >
                  {order.orderId}
                </Link>
                <button
                  onClick={copyOrderId}
                  className="text-yellow-600 hover:text-yellow-800 transition-colors"
                  title="Copy Order ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/track?orderId=${order.orderId}`}
                className="inline-flex items-center bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Package className="h-4 w-4 mr-2" />
                Track Your Order
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={item.image || '/api/placeholder/60/80'}
                    alt={item.name}
                    className="w-15 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                    <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{(order.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {!order.userId ? (
                    // Guest order - show struck-through shipping cost
                    <span className="text-gray-500">
                      <span className="line-through">₹99</span>
                      <span className="text-green-600 ml-2">Free</span>
                    </span>
                  ) : (order.shippingCost || 0) === 0 ? (
                    'Free'
                  ) : (
                    `₹${order.shippingCost || 0}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Includes all taxes</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span>₹{(order.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Delivery & Payment Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-yellow-400" />
                Delivery Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Delivering to:</p>
                  <p className="font-medium">{order.shipping.firstName} {order.shipping.lastName}</p>
                  <p className="text-sm text-gray-600">
                    {order.shipping.address}
                    {order.shipping.apartment && `, ${order.shipping.apartment}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shipping.city}, {order.shipping.state} - {order.shipping.pinCode}
                  </p>
                </div>
                
                {estimatedDelivery && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Estimated Delivery</p>
                        <p className="text-sm text-green-700">
                          {format(estimatedDelivery, 'EEEE, MMMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">
                    {order.paymentMethod === 'razorpay' ? 'Online Payment' : 
                     order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                     'Bank Transfer'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="text-sm font-mono">{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-black">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-gray-600">You'll receive an email confirmation shortly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gray-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-gray-600">We'll prepare your order for shipping</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gray-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Shipping</p>
                    <p className="text-sm text-gray-600">Your order will be shipped in our signature yellow box</p>
                  </div>
                </div>
              </div>
              
              {/* Cancel Order Information */}
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Need to Cancel Your Order?</h4>
                <p className="text-sm text-orange-700 mb-2">
                  If you want to cancel your order, you can do so while it's in "Processing" or "Packed" status.
                </p>
                <p className="text-sm text-orange-700">
                  <strong>To cancel:</strong> Go to the <Link to={`/track?orderId=${order.orderId}`} className="text-orange-600 hover:text-orange-700 underline">Order Tracking page</Link>, scroll down to the end, and click the "Cancel Order" button.
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Note: Orders that are "Shipped", "Delivered", or "Cancelled" cannot be cancelled.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Support Section */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`https://wa.me/916369360104?text=Hi, I need help with my order ${order.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:support@trustylads.tech?subject=Order Support - ${order.orderId}`}
              className="flex items-center justify-center bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Email Support
            </a>
            <Link
              to={`/track?orderId=${order.orderId}`}
              className="flex items-center justify-center bg-yellow-400 text-black font-medium py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Track Order
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;