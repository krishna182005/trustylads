import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold text-yellow-400 leading-none">
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            Looks like this page went off the grid, just like our streetwear vibes! 🔥
          </p>
          <p className="text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* TrustyLads Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-yellow-400 text-black font-bold text-2xl px-4 py-2 rounded">
              TL
            </div>
            <span className="text-2xl font-bold text-white">TrustyLads</span>
          </div>
          <p className="text-gray-300 text-sm">
            "Trust your style, trust your vibe" ✨
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/"
            className="inline-flex items-center bg-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 group"
          >
            <Home className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
            Back to Home
          </Link>
          
          <Link
            to="/shop"
            className="inline-flex items-center bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 group"
          >
            <Search className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
            Explore Shop
          </Link>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full opacity-20"
          />
          <motion.div
            animate={{
              x: [0, -150, 0],
              y: [0, 100, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-3/4 right-1/4 w-6 h-6 bg-yellow-400 rounded-full opacity-10"
          />
          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, -80, 0],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white rounded-full opacity-20"
          />
        </div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 text-gray-500 text-sm"
        >
          <p>Lost? No worries! Even the boldest explorers take wrong turns. 🧭</p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;