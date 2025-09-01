import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, AlertTriangle, Users, Shield } from 'lucide-react';

const TermsPage: React.FC = () => {
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
              <FileText className="h-6 w-6 text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">TrustyLads Terms of Service</h2>
              <p className="text-gray-600 mb-4">
                <strong>Last updated:</strong> January 2025
              </p>
              <p className="text-gray-600">
                Welcome to TrustyLads! These Terms of Service govern your use of our website and services. 
                By accessing or using our platform, you agree to be bound by these terms and conditions.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-yellow-600" />
                  Acceptance of Terms
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    By accessing and using the TrustyLads website, you accept and agree to be bound by the terms and provision 
                    of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-yellow-600" />
                  Use License
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>Permission is granted to temporarily download one copy of the materials on TrustyLads's website for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information and Pricing</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Product Descriptions:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>We strive to provide accurate product descriptions and images</li>
                    <li>Product availability is subject to change without notice</li>
                    <li>Prices are subject to change and may vary based on location and availability</li>
                    <li>All prices are in Indian Rupees (INR) unless otherwise stated</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Manual Reselling Notice:</strong></p>
                  <p>
                    TrustyLads operates as a manual reselling platform. Orders placed through our website are processed manually, 
                    and we source products from various suppliers. Delivery times may vary based on product availability and supplier processing times.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order and Payment Terms</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Order Acceptance:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>All orders are subject to acceptance and availability</li>
                    <li>We reserve the right to refuse or cancel any order</li>
                    <li>Payment must be completed before order processing begins</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Payment Methods:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Cash on Delivery (COD) - Available for eligible orders</li>
                    <li>Online payments through our secure payment partners</li>
                    <li>All online transactions are processed securely</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping and Delivery</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Shipping Policy:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Free shipping across India on all orders</li>
                    <li>Average delivery time: 4-7 business days</li>
                    <li>Delivery times may vary based on location and product availability</li>
                    <li>We are not responsible for delays caused by courier services or external factors</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Returns and Refunds</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Return Policy:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>7-day return window from date of delivery</li>
                    <li>Products must be unused and in original packaging</li>
                    <li>Proof of purchase required for all returns</li>
                    <li>Return shipping costs may apply</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Refund Process:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Refunds will be processed within 5-7 business days</li>
                    <li>Original payment method will be credited</li>
                    <li>COD orders may require alternative refund arrangements</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Prohibited Uses
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>You may not use our website for any unlawful purpose or to solicit others to perform unlawful acts. Specifically, you agree not to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon or violate our intellectual property rights</li>
                    <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>Submit false or misleading information</li>
                    <li>Upload or transmit viruses or any other type of malicious code</li>
                    <li>Collect or track the personal information of others</li>
                    <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                    <li>Interfere with or circumvent the security features of the website</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Intellectual Property</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive property 
                    of TrustyLads and its licensors. The Service is protected by copyright, trademark, and other laws.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Limitation of Liability</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    In no event shall TrustyLads, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                    be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                    limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
                    of the Service.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Governing Law</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. 
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Changes to Terms</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                    If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Scale className="h-5 w-5 mr-2 text-yellow-600" />
                  Contact Information
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>If you have any questions about these Terms of Service, please contact us:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>TrustyLads</strong></p>
                    <p>Chennai, Tamil Nadu, India</p>
                    <p>Email: <a href="mailto:trustylads@gmail.com" className="text-yellow-600 hover:text-yellow-700">trustylads@gmail.com</a></p>
                    <p>WhatsApp: <a href="https://wa.me/91916369360104" className="text-yellow-600 hover:text-yellow-700">+91 916369360104</a></p>
                    <p>Instagram: <a href="https://www.instagram.com/trustylads?igsh=MTRraWIwdGM3eWVsMw==" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">@trustylads</a></p>
                    <p>Facebook: <a href="https://www.facebook.com/share/16NDSH4AmT/" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">TrustyLads</a></p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
