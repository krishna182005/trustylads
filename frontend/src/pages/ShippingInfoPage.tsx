import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, MapPin, Package, AlertCircle, CheckCircle } from 'lucide-react';

const ShippingInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <Truck className="h-6 w-6 text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-900">Shipping Information</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">TrustyLads Shipping Policy</h2>
              <p className="text-gray-600">
                We offer fast and reliable shipping across India to ensure your orders reach you safely and on time. 
                Here's everything you need to know about our shipping process.
              </p>
            </div>

            <div className="space-y-8">
              {/* Shipping Overview */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-yellow-600" />
                  Shipping Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-green-900">Free Shipping</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Free shipping across India on all orders
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-900">4-7 Days</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Average delivery time across India
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-2">
                      <Package className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="font-medium text-purple-900">Secure Packaging</h4>
                    </div>
                    <p className="text-sm text-purple-700">
                      Products packed safely in our signature yellow boxes
                    </p>
                  </div>
                </div>
              </section>

              {/* Delivery Timeline */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                  Delivery Timeline
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Order Processing & Delivery</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-black">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order Confirmation</p>
                          <p className="text-sm text-gray-600">
                            You'll receive an email confirmation immediately after placing your order
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-black">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order Processing</p>
                          <p className="text-sm text-gray-600">
                            We process your order within 24-48 hours (excluding weekends and holidays)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-black">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Shipping</p>
                          <p className="text-sm text-gray-600">
                            Your order is shipped via our trusted courier partners
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-black">4</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Delivery</p>
                          <p className="text-sm text-gray-600">
                            Your order arrives at your doorstep in 4-7 business days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Areas */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-yellow-600" />
                  Delivery Areas
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>We deliver to all major cities and towns across India:</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Metro Cities</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Mumbai, Maharashtra</li>
                        <li>• Delhi, NCR</li>
                        <li>• Bangalore, Karnataka</li>
                        <li>• Chennai, Tamil Nadu</li>
                        <li>• Kolkata, West Bengal</li>
                        <li>• Hyderabad, Telangana</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Other Cities</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Pune, Maharashtra</li>
                        <li>• Ahmedabad, Gujarat</li>
                        <li>• Jaipur, Rajasthan</li>
                        <li>• Lucknow, Uttar Pradesh</li>
                        <li>• Chandigarh, Punjab</li>
                        <li>• And many more...</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Note:</strong> Delivery times may vary for remote areas and during peak seasons.
                  </p>
                </div>
              </section>

              {/* Shipping Costs */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Costs</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-green-800 font-medium">Free Shipping</p>
                        <p className="text-green-700 text-sm">
                          All orders ship free across India, regardless of order value or location.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p>
                    We believe in providing the best value to our customers, which is why we offer 
                    completely free shipping on all orders. No minimum order value required!
                  </p>
                </div>
              </section>

              {/* Tracking Orders */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Your Order</h3>
                <div className="space-y-3 text-gray-600">
                  <p>Stay updated on your order's journey with our easy tracking system:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Email Updates:</strong> Receive tracking updates via email</li>
                    <li><strong>Order Tracking:</strong> Use your order ID to track on our website</li>
                    <li><strong>Courier Tracking:</strong> Track directly with our courier partners</li>
                    <li><strong>WhatsApp Updates:</strong> Get real-time updates on WhatsApp</li>
                  </ul>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-blue-800 font-medium">Track Your Order</p>
                        <p className="text-blue-700 text-sm">
                          Visit our <Link to="/track" className="underline">Track Order</Link> page to check your order status anytime.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Options */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Options</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>We offer flexible delivery options:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Home Delivery:</strong> Standard delivery to your doorstep</li>
                    <li><strong>Office Delivery:</strong> Deliver to your workplace</li>
                    <li><strong>Alternate Address:</strong> Deliver to a different address</li>
                    <li><strong>Contactless Delivery:</strong> Safe, no-contact delivery option</li>
                  </ul>
                </div>
              </section>

              {/* Delivery Delays */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Delays</h3>
                <div className="space-y-3 text-gray-600">
                  <p>While we strive for timely delivery, some factors may cause delays:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Weather conditions and natural disasters</li>
                    <li>Holiday seasons and peak shopping periods</li>
                    <li>Remote or hard-to-reach locations</li>
                    <li>Customs clearance (for international shipments)</li>
                    <li>Courier service disruptions</li>
                  </ul>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-yellow-800 font-medium">Delay Notifications</p>
                        <p className="text-yellow-700 text-sm">
                          We'll notify you immediately if there are any delays in your order delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Failed Deliveries */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Failed Deliveries</h3>
                <div className="space-y-3 text-gray-600">
                  <p>If delivery fails, here's what happens:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Courier will attempt delivery 2-3 times</li>
                    <li>You'll receive SMS/email notifications about delivery attempts</li>
                    <li>If all attempts fail, the package returns to our warehouse</li>
                    <li>We'll contact you to arrange re-delivery or refund</li>
                    <li>Re-delivery charges may apply for multiple failed attempts</li>
                  </ul>
                </div>
              </section>

              {/* Packaging */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-yellow-600" />
                  Packaging
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>Your orders are carefully packaged to ensure safe delivery:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Products are packed in our signature yellow TrustyLads boxes</li>
                    <li>Fragile items are wrapped with extra protective material</li>
                    <li>All packages are sealed securely</li>
                    <li>Tracking labels are clearly affixed</li>
                    <li>Order details and invoice included</li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Support</h3>
                <div className="space-y-3 text-gray-600">
                  <p>Have questions about shipping? Our customer support team is here to help:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>TrustyLads Customer Support</strong></p>
                    <p>Chennai, Tamil Nadu, India</p>
                    <p>Email: <a href="mailto:trustylads@gmail.com" className="text-yellow-600 hover:text-yellow-700">trustylads@gmail.com</a></p>
                    <p>WhatsApp: <a href="https://wa.me/91916369360104" className="text-yellow-600 hover:text-yellow-700">+91 916369360104</a></p>
                    <p>Instagram: <a href="https://www.instagram.com/trustylads?igsh=MTRraWIwdGM3eWVsMw==" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">@trustylads</a></p>
                    <p>Facebook: <a href="https://www.facebook.com/share/16NDSH4AmT/" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">TrustyLads</a></p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Response Time:</strong> We typically respond to shipping inquiries within 24 hours during business days.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;
