import React from 'react';
import { Truck, Clock, MapPin, Shield, Package, AlertCircle } from 'lucide-react';

const ShippingPolicyPage: React.FC = () => {
  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shipping Policy
          </h1>
          <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
            Fast, reliable, and secure delivery across India
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Truck className="h-6 w-6 mr-3 text-yellow-600" />
              Shipping Overview
            </h2>
            <p className="text-gray-600 mb-4">
              At TrustyLads, we are committed to delivering your orders quickly and safely. 
              We partner with reliable shipping providers to ensure your products reach you 
              in perfect condition and on time.
            </p>
            <p className="text-gray-600">
              All orders are processed and shipped from our warehouse in Chennai, Tamil Nadu. 
              We deliver to all major cities and towns across India.
            </p>
          </section>

          {/* Delivery Timeline */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="h-6 w-6 mr-3 text-yellow-600" />
              Delivery Timeline
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-gray-900 mb-3">Standard Delivery</h3>
                <p className="text-gray-600 mb-2">
                  <strong>5-7 business days</strong> for most locations
                </p>
                <p className="text-sm text-gray-500">
                  Free delivery for orders above ₹500
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-3">Express Delivery</h3>
                <p className="text-gray-600 mb-2">
                  <strong>2-3 business days</strong> for metro cities
                </p>
                <p className="text-sm text-gray-500">
                  Additional charges may apply
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">Processing Time</h3>
              <p className="text-gray-600">
                Orders are typically processed within <strong>1-2 business days</strong> after 
                payment confirmation. During peak seasons or sales, processing may take up to 
                3 business days.
              </p>
            </div>
          </section>

          {/* Shipping Charges */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="h-6 w-6 mr-3 text-yellow-600" />
              Shipping Charges
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Order Value</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Shipping Charges</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Delivery Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Above ₹500</td>
                    <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">FREE</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">Below ₹500</td>
                    <td className="border border-gray-300 px-4 py-3">₹99</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Express Delivery</td>
                    <td className="border border-gray-300 px-4 py-3">₹199</td>
                    <td className="border border-gray-300 px-4 py-3">2-3 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Delivery Areas */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-3 text-yellow-600" />
              Delivery Areas
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Major Cities (2-3 days)</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Mumbai, Delhi, Bangalore, Chennai</li>
                  <li>• Hyderabad, Pune, Kolkata, Ahmedabad</li>
                  <li>• Jaipur, Surat, Lucknow, Kanpur</li>
                  <li>• Nagpur, Indore, Thane, Bhopal</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Other Locations (5-7 days)</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Tier 2 and Tier 3 cities</li>
                  <li>• Rural areas and remote locations</li>
                  <li>• North East states</li>
                  <li>• Jammu & Kashmir, Ladakh</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-3 text-yellow-600" />
              Order Tracking
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Once your order is shipped, you will receive a tracking number via SMS and email. 
                You can track your order status using:
              </p>
              
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Our website's <a href="/track" className="text-yellow-600 hover:text-yellow-700">Track Order</a> page</li>
                <li>The tracking link sent to your email</li>
                                 <li>Our customer support team at +91 6369360104</li>
              </ul>
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertCircle className="h-6 w-6 mr-3 text-yellow-600" />
              Important Notes
            </h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-gray-900 mb-2">Delivery Attempts</h3>
                <p className="text-gray-600">
                  We make up to 3 delivery attempts. If the delivery is unsuccessful, 
                  the package will be returned to our warehouse and you may be charged 
                  for return shipping.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Address Accuracy</h3>
                <p className="text-gray-600">
                  Please ensure your delivery address is complete and accurate. 
                  Incorrect addresses may result in delivery delays or failed deliveries.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">Holiday Deliveries</h3>
                <p className="text-gray-600">
                  Delivery times may be extended during festivals and holidays. 
                  We will notify you of any delays via SMS or email.
                </p>
              </div>
            </div>
          </section>

          {/* Order Cancellation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertCircle className="h-6 w-6 mr-3 text-yellow-600" />
              Order Cancellation
            </h2>
            
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-3">How to Cancel Your Order</h3>
              <p className="text-orange-700 mb-3">
                You can cancel your order if it's in "Processing" or "Packed" status:
              </p>
              <ol className="list-decimal list-inside text-orange-700 space-y-2 mb-4">
                <li>Go to the Order Tracking page using your order ID</li>
                <li>Scroll down to the bottom of the page</li>
                <li>Look for the "Cancel Order" button</li>
                <li>Click the button to cancel your order</li>
              </ol>
              <p className="text-orange-600 text-sm">
                <strong>Note:</strong> Orders that are "Shipped", "Delivered", or "Cancelled" cannot be cancelled. 
                For assistance, contact us at +91 6369360104 or WhatsApp.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Need Help?</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                If you have any questions about shipping or need assistance with your order, 
                please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:support@trustylads.tech" className="text-yellow-600 hover:text-yellow-700">support@trustylads.tech</a></p>
                <p><strong>Phone:</strong> <a href="tel:+916369360104" className="text-yellow-600 hover:text-yellow-700">+91 6369360104</a></p>
                <p><strong>Address:</strong> No. 12, 3rd Cross Street, Ambattur Industrial Estate, Chennai – 600058, Tamil Nadu</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
