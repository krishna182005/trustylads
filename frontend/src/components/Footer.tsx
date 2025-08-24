import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, MapPin, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
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
              <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded">
                TL
              </div>
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
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Shop All</Link></li>
              <li><Link to="/shop?category=shirts" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Shirts</Link></li>
              <li><Link to="/shop?category=watches" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Watches</Link></li>
              <li><Link to="/shop?category=jewelry" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Jewelry</Link></li>
              <li><Link to="/track" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/size-guide" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Size Guide</Link></li>
              <li><Link to="/returns-refunds" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Returns & Exchange</Link></li>
              <li><Link to="/shipping-info" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">Shipping Info</Link></li>
              <li><Link to="/faq" onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition-colors">FAQ</Link></li>
              <li><a href="https://wa.me/916369360104" className="text-gray-300 hover:text-yellow-400 transition-colors">WhatsApp Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-yellow-400" />
                <span>India</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-400" />
                <span>trustylads@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 TrustyLads. All rights reserved. Made with ❤️ in India.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" onClick={scrollToTop} className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
              <Link to="/refund-policy" onClick={scrollToTop} className="hover:text-yellow-400 transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;