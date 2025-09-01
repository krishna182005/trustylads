import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Facebook, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TrustBadges from './TrustBadges';

const Footer: React.FC = () => {
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [isCustomerCareOpen, setIsCustomerCareOpen] = useState(false);

  // Function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo.svg" 
                alt="TrustyLads Logo" 
                width={32}
                height={32}
                className='w-8 h-8 object-contain' 
              />
              <span className="font-bold text-xl">TrustyLads</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              We are selling imported and rich quality premium products. We also offer many deals and discounts.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/trustylads?igsh=MTRraWIwdGM3eWVsMw==" 
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.facebook.com/share/16NDSH4AmT/" 
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://wa.me/916369360104" 
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="mailto:trustylads@gmail.com" 
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <button
              onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
              className="flex items-center justify-between w-full font-semibold text-lg mb-4 md:cursor-default"
              aria-label="Quick Links"
            >
              <span>Quick Links</span>
              <ChevronDown className={`h-4 w-4 md:hidden transition-transform ${isQuickLinksOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {/* Desktop: Always visible */}
            <div className="hidden md:block">
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Shop All</Link></li>
                <li><Link to="/track" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Track Order</Link></li>
                <li><Link to="/size-guide" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Size Guide</Link></li>
                <li><Link to="/shipping" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Shipping Info</Link></li>
                <li><Link to="/returns" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Returns & Refunds</Link></li>
              </ul>
            </div>
            {/* Mobile: Collapsible */}
            <AnimatePresence>
              {isQuickLinksOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden overflow-hidden"
                >
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/shop" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Shop All</Link></li>
                    <li><Link to="/track" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Track Order</Link></li>
                    <li><Link to="/size-guide" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Size Guide</Link></li>
                    <li><Link to="/shipping" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Shipping Info</Link></li>
                    <li><Link to="/returns" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Returns & Refunds</Link></li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Customer Care */}
          <div>
            <button
              onClick={() => setIsCustomerCareOpen(!isCustomerCareOpen)}
              className="flex items-center justify-between w-full font-semibold text-lg mb-4 md:cursor-default"
              aria-label="Customer Care"
            >
              <span>Customer Care</span>
              <ChevronDown className={`h-4 w-4 md:hidden transition-transform ${isCustomerCareOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {/* Desktop: Always visible */}
            <div className="hidden md:block">
              <ul className="space-y-2 text-sm">
                <li><Link to="/faq" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">FAQ</Link></li>
                <li><Link to="/my-orders" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">My Orders</Link></li>
                <li><a href="https://wa.me/6369360104" className="text-gray-300 hover:text-yellow-400 transition-colors" target="_blank" rel="noopener noreferrer">WhatsApp Support</a></li>
                <li><a href="mailto:trustylads@gmail.com" className="text-gray-300 hover:text-yellow-400 transition-colors">Email Support</a></li>
              </ul>
            </div>
            {/* Mobile: Collapsible */}
            <AnimatePresence>
              {isCustomerCareOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden overflow-hidden"
                >
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/faq" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">FAQ</Link></li>
                    <li><Link to="/my-orders" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">My Orders</Link></li>
                    <li><a href="https://wa.me/6369360104" className="text-gray-300 hover:text-yellow-400 transition-colors" target="_blank" rel="noopener noreferrer">WhatsApp Support</a></li>
                    <li><a href="mailto:trustylads@gmail.com" className="text-gray-300 hover:text-yellow-400 transition-colors">Email Support</a></li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>

        <div className="border-t border-gray-700 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 TrustyLads. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-3 md:mt-0 text-sm text-gray-400">
              <Link to="/about" onClick={scrollToTop} className="hover:text-yellow-400 transition-colors">About Us</Link>
              <Link to="/contact" onClick={scrollToTop} className="hover:text-yellow-400 transition-colors">Contact Us</Link>
              <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" onClick={scrollToTop} className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
              <Link to="/refund-policy" onClick={scrollToTop} className="hover:text-yellow-400 transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <TrustBadges />
        </div>
      </div>
    </footer>
  );
};

export default Footer;