import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Users, Star } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'Every product is checked to meet our standards.'
    },
    {
      icon: Star,
      title: 'Affordable Style',
      description: 'Trendy and timeless designs without the heavy price tag.'
    },
    {
      icon: Users,
      title: 'Customer-Centered',
      description: 'Your satisfaction is our top priority.'
    },
    {
      icon: Truck,
      title: 'Trusted Delivery',
      description: 'Safe payments, reliable shipping, and hassle-free support.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img 
                src="https://github.com/user-attachments/assets/fb7d6d7c-3b23-4df7-b521-a48b99250326" 
                alt="TrustyLads Logo" 
                className='w-12 h-12 sm:w-16 sm:h-16 object-contain' 
              />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">About Us</h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              At TrustyLads, we believe style is more than just clothing — it's a lifestyle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6">
                Our mission is to bring you quality products at fair prices, designed to fit seamlessly into your everyday life.
              </p>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                We carefully handpick and create products that combine modern design, comfort, and durability, so whether it's clothing, accessories, or lifestyle essentials, you can always count on us to deliver.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose TrustyLads?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-yellow-50 w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                  <feature.icon className="h-10 w-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Our Values
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
                We're more than just a store — we're a community of everyday people who value authenticity, confidence, and trust. When you shop with TrustyLads, you're not just buying a product, you're joining a movement of people who believe in living with style and substance.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-6 rounded-2xl inline-block">
                <p className="text-lg sm:text-xl font-medium">
                  Thank you for trusting us. Together, let's make everyday essentials stylish.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              TrustyLads in Numbers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-2">1000+</div>
              <p className="text-gray-300">Happy Customers</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-2">500+</div>
              <p className="text-gray-300">Quality Products</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-2">24/7</div>
              <p className="text-gray-300">Customer Support</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Experience TrustyLads?
            </h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Join our community of style-conscious individuals who believe in quality, affordability, and trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block"
              >
                Shop Now
              </a>
              <a
                href="https://wa.me/6369360104"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
