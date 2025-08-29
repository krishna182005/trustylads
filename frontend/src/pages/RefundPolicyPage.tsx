import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const RefundPolicyPage: React.FC = () => {
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
              <RefreshCw className="h-6 w-6 text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-900">Refund Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">TrustyLads Refund Policy</h2>
              <p className="text-gray-600 mb-4">
                <strong>Last updated:</strong> January 2025
              </p>
              <p className="text-gray-600">
                At TrustyLads, we want you to be completely satisfied with your purchase. This refund policy outlines 
                the terms and conditions for returns and refunds on our platform.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                  Return Window
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    We offer a <strong>7-day return window</strong> from the date of delivery. This means you have 
                    7 days to initiate a return if you're not satisfied with your purchase.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-yellow-800 font-medium">Important Note</p>
                        <p className="text-yellow-700 text-sm">
                          Returns must be initiated within 7 days of delivery. After this period, we cannot accept returns 
                          unless the product is defective or damaged.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-yellow-600" />
                  Return Conditions
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>To be eligible for a return, your item must meet the following conditions:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Unused:</strong> The product must be in its original, unused condition</li>
                    <li><strong>Original Packaging:</strong> All original packaging, tags, and labels must be intact</li>
                    <li><strong>Proof of Purchase:</strong> You must provide proof of purchase (order confirmation, receipt, etc.)</li>
                    <li><strong>Complete Set:</strong> All components, accessories, and freebies must be included</li>
                    <li><strong>No Damage:</strong> The product must not show any signs of wear, damage, or alteration</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <XCircle className="h-5 w-5 mr-2 text-yellow-600" />
                  Non-Returnable Items
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>The following items are not eligible for returns:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Personal care items and cosmetics</li>
                    <li>Underwear and intimate apparel</li>
                    <li>Customized or personalized items</li>
                    <li>Digital products or downloadable content</li>
                    <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                    <li>Products that have been used, damaged, or altered</li>
                    <li>Items without original packaging or tags</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Initiate a Return</h3>
                <div className="space-y-3 text-gray-600">
                  <p>To start the return process, please follow these steps:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li><strong>Contact Us:</strong> Reach out to our customer support team within 7 days of delivery</li>
                    <li><strong>Provide Details:</strong> Include your order ID, reason for return, and photos if applicable</li>
                    <li><strong>Get Approval:</strong> We'll review your request and provide return instructions</li>
                    <li><strong>Ship Back:</strong> Package the item securely and ship it to our return address</li>
                    <li><strong>Receive Refund:</strong> Once we receive and inspect the item, we'll process your refund</li>
                  </ol>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Shipping</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Return Shipping Costs:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Customers are responsible for return shipping costs unless the item is defective or damaged</li>
                    <li>We recommend using a trackable shipping method</li>
                    <li>Return shipping costs are non-refundable</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Return Address:</strong></p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>TrustyLads Returns</strong></p>
                    <p>Chennai, Tamil Nadu, India</p>
                    <p className="text-sm text-gray-500">(Specific address will be provided upon return approval)</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Process</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Refund Timeline:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Refunds are processed within 5-7 business days after we receive your return</li>
                    <li>Processing time may vary depending on your payment method</li>
                    <li>You'll receive an email confirmation once the refund is processed</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Refund Methods:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Online Payments:</strong> Refunded to the original payment method</li>
                    <li><strong>Cash on Delivery (COD):</strong> Bank transfer or alternative arrangement</li>
                    <li><strong>Gift Cards:</strong> Refunded as store credit</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Defective or Damaged Items</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    If you receive a defective or damaged item, please contact us immediately. We'll arrange for a 
                    replacement or refund at no additional cost to you.
                  </p>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-medium">For Defective Items</p>
                        <p className="text-red-700 text-sm">
                          Please take photos of the damage/defect and contact us within 48 hours of delivery for immediate assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exchange Policy</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    We currently do not offer direct exchanges. If you'd like a different size, color, or product, 
                    please return your current item and place a new order.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Policy</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Order Cancellation:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Orders can be cancelled within 2 hours of placement</li>
                    <li>Once processing begins, cancellation may not be possible</li>
                    <li>Shipped orders cannot be cancelled</li>
                    <li>Refunds for cancelled orders are processed within 3-5 business days</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
                <div className="space-y-3 text-gray-600">
                  <p>If you have any questions about our refund policy or need to initiate a return, please contact us:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>TrustyLads Customer Support</strong></p>
                    <p>Chennai, Tamil Nadu, India</p>
                    <p>Email: <a href="mailto:trustylads@gmail.com" className="text-yellow-600 hover:text-yellow-700">trustylads@gmail.com</a></p>
                    <p>WhatsApp: <a href="https://wa.me/91916369360104" className="text-yellow-600 hover:text-yellow-700">+91 916369360104</a></p>
                    <p>Instagram: <a href="https://www.instagram.com/trustylads?igsh=MTRraWIwdGM3eWVsMw==" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">@trustylads</a></p>
                    <p>Facebook: <a href="https://www.facebook.com/share/16NDSH4AmT/" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">TrustyLads</a></p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Response Time:</strong> We typically respond to return requests within 24 hours during business days.
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

export default RefundPolicyPage;
