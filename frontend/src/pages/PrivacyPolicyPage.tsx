import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
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
              <Shield className="h-6 w-6 text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">TrustyLads Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                <strong>Last updated:</strong> January 2025
              </p>
              <p className="text-gray-600">
                At TrustyLads, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
                or make purchases from us.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-yellow-600" />
                  Information We Collect
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Personal Information:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Name, email address, phone number, and shipping address</li>
                    <li>Payment information (processed securely through our payment partners)</li>
                    <li>Order history and preferences</li>
                    <li>Communication records with our customer support team</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Technical Information:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>IP address, browser type, and device information</li>
                    <li>Website usage data and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-yellow-600" />
                  How We Use Your Information
                </h3>
                <div className="space-y-3 text-gray-600">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate order updates and delivery information</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send promotional offers and newsletters (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Comply with legal obligations and prevent fraud</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-yellow-600" />
                  Information Sharing and Disclosure
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Payment Processors:</strong> To process your payments securely</li>
                    <li><strong>Shipping Partners:</strong> To deliver your orders</li>
                    <li><strong>Service Providers:</strong> Who assist us in operating our business</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Security</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, 
                    alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, 
                    and we cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cookies and Tracking</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, 
                    and personalize content. You can control cookie settings through your browser preferences.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Rights</h3>
                <div className="space-y-3 text-gray-600">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Access and review your personal information</li>
                    <li>Update or correct inaccurate information</li>
                    <li>Request deletion of your personal data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Withdraw consent for data processing</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, 
                    comply with legal obligations, resolve disputes, and enforce our agreements.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Children's Privacy</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
                    information from children under 13. If you believe we have collected such information, please contact us immediately.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Changes to This Policy</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
                    the new policy on our website and updating the "Last updated" date.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
                <div className="space-y-3 text-gray-600">
                  <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
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

export default PrivacyPolicyPage;
