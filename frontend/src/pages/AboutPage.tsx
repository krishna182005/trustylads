import React from 'react';
import { Users, Target, Award, Heart, MapPin, Mail, Phone } from 'lucide-react';

const AboutPage: React.FC = () => {
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
            About TrustyLads
          </h1>
          <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
            Premium quality products for the bold and confident. Made in India, for India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Who We Are</h3>
              <p className="text-gray-600 mb-4">
                TrustyLads is a new and emerging e-commerce platform dedicated to bringing you 
                premium quality products that embody confidence, style, and reliability. We are 
                passionate about curating the finest selection of products that help you express 
                your unique personality.
              </p>
              <p className="text-gray-600 mb-4">
                As a new company, we are committed to building trust through transparency, 
                quality, and exceptional customer service. Every product in our collection is 
                carefully selected to meet our high standards of quality and style.
              </p>
              <p className="text-gray-600">
                We believe that everyone deserves access to premium products that make them 
                feel confident and empowered. That's why we're building TrustyLads - to be 
                your trusted partner in style and quality.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <Users className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900">1000+</h4>
                  <p className="text-sm text-gray-600">Happy Customers</p>
                </div>
                <div>
                  <Award className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900">Premium</h4>
                  <p className="text-sm text-gray-600">Quality Products</p>
                </div>
                <div>
                  <Target className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900">All India</h4>
                  <p className="text-sm text-gray-600">Delivery</p>
                </div>
                <div>
                  <Heart className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900">24/7</h4>
                  <p className="text-sm text-gray-600">Customer Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission & Vision */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Target className="h-12 w-12 text-yellow-400 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide premium quality products that empower our customers to express 
                their confidence and style. We are committed to delivering exceptional 
                value, outstanding customer service, and a seamless shopping experience 
                that builds lasting trust and loyalty.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Award className="h-12 w-12 text-yellow-400 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become India's most trusted e-commerce platform for premium lifestyle 
                products. We envision a future where every customer feels confident and 
                empowered through our carefully curated selection of high-quality products 
                and exceptional service.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product is carefully selected and 
                tested to ensure it meets our high standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Centric</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We listen, learn, 
                and continuously improve based on your feedback.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                We believe in building trust through transparency, honest communication, 
                and reliable service delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TrustyLads?</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-yellow-400 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Carefully curated products that meet our high standards</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">🚚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick and reliable shipping across India</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">💬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Round-the-clock customer service and support</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">🔄</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">Hassle-free return and refund policy</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600">
              Have questions or want to know more about us? We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Mail className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <a href="mailto:support@trustylads.tech" className="text-yellow-600 hover:text-yellow-700">
                support@trustylads.tech
              </a>
            </div>
            
            <div>
              <Phone className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <a href="tel:+916369360104" className="text-yellow-600 hover:text-yellow-700">
                +91 6369360104
              </a>
            </div>
            
            <div>
              <MapPin className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 text-sm">
                No. 12, 3rd Cross Street,<br />
                Ambattur Industrial Estate,<br />
                Chennai – 600058, Tamil Nadu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;