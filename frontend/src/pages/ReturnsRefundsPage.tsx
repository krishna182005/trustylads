import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Clock, AlertCircle, CheckCircle, XCircle, Truck, CreditCard } from 'lucide-react';

const ReturnsRefundsPage: React.FC = () => {
  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
              <h1 className="text-2xl font-bold text-gray-900">Returns & Exchange</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">TrustyLads Returns & Exchange Policy</h2>
              <p className="text-gray-600">
                We want you to be completely satisfied with your purchase. Our hassle-free return policy ensures 
                you can shop with confidence knowing that if something isn't quite right, we're here to help.
              </p>
            </div>

            <div className="space-y-8">
              {/* Quick Overview */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                  Quick Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-green-900">7-Day Returns</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Return window starts from the date of delivery
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-900">Free Shipping</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Free shipping across India on all orders
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="font-medium text-purple-900">Easy Refunds</h4>
                    </div>
                    <p className="text-sm text-purple-700">
                      Refunds processed within 5-7 business days
                    </p>
                  </div>
                </div>
              </section>

              {/* Return Conditions */}
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
                    <li><strong>Return Window:</strong> Return must be initiated within 7 days of delivery</li>
                  </ul>
                </div>
              </section>

              {/* Non-Returnable Items */}
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
                    <li>Gift cards and vouchers</li>
                  </ul>
                </div>
              </section>

              {/* Return Process */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Return an Item</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Step-by-Step Process</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-black">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Contact Customer Support</p>
                          <p className="text-sm text-gray-600">
                            Reach out to our customer support team within 7 days of delivery via WhatsApp, email, or social media
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-black">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Provide Details</p>
                          <p className="text-sm text-gray-600">
                            Include your order ID, reason for return, and photos if applicable
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-black">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Get Approval</p>
                          <p className="text-sm text-gray-600">
                            We'll review your request and provide return instructions within 24 hours
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-black">4</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Ship Back</p>
                          <p className="text-sm text-gray-600">
                            Package the item securely and ship it to our return address
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-black">5</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Receive Refund</p>
                          <p className="text-sm text-gray-600">
                            Once we receive and inspect the item, we'll process your refund within 5-7 business days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Return Shipping */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Shipping</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Return Shipping Costs:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Customers are responsible for return shipping costs unless the item is defective or damaged</li>
                    <li>We recommend using a trackable shipping method for your protection</li>
                    <li>Return shipping costs are non-refundable</li>
                    <li>For defective or damaged items, we'll provide a prepaid return label</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Return Address:</strong></p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>TrustyLads Returns</strong></p>
                    <p>Chennai, Tamil Nadu, India</p>
                    <p className="text-sm text-gray-500">(Specific address will be provided upon return approval)</p>
                  </div>
                </div>
              </section>

              {/* Refund Process */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Process</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Refund Timeline:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Refunds are processed within 5-7 business days after we receive your return</li>
                    <li>Processing time may vary depending on your payment method</li>
                    <li>You'll receive an email confirmation once the refund is processed</li>
                    <li>Bank processing times may add 2-5 additional business days</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Refund Methods:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Online Payments:</strong> Refunded to the original payment method</li>
                    <li><strong>Cash on Delivery (COD):</strong> Bank transfer or alternative arrangement</li>
                    <li><strong>Gift Cards:</strong> Refunded as store credit</li>
                    <li><strong>Digital Wallets:</strong> Refunded to the original wallet</li>
                  </ul>
                </div>
              </section>

              {/* Exchange Policy */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exchange Policy</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    We currently do not offer direct exchanges. If you'd like a different size, color, or product, 
                    please return your current item and place a new order. This ensures you get the best possible 
                    service and product selection.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-blue-800 font-medium">Exchange Process</p>
                        <p className="text-blue-700 text-sm">
                          Return your current item → Receive refund → Place new order with desired item
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Defective Items */}
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

              {/* Cancellation Policy */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Cancellation</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Order Cancellation Policy:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Orders can be cancelled within 2 hours of placement</li>
                    <li>Once processing begins, cancellation may not be possible</li>
                    <li>Shipped orders cannot be cancelled</li>
                    <li>Refunds for cancelled orders are processed within 3-5 business days</li>
                    <li>Contact us immediately if you need to cancel an order</li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3 text-gray-600">
                  <p>If you have any questions about our return policy or need to initiate a return, please contact us:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>TrustyLads Customer Support</strong></p>
                    <p>Chennai, Tamil Nadu, India</p>
                    <p>Email: <a href="mailto:support@trustylads.tech" className="text-yellow-600 hover:text-yellow-700">support@trustylads.tech</a></p>
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

export default ReturnsRefundsPage;
