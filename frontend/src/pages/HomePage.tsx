import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones, Package, ShoppingBag, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { usePerformance, preloadCriticalResources } from '../hooks/usePerformance';
import { generateWebsiteSchema } from '../utils/schema';


const HomePage: React.FC = () => {
  const { addItem } = useCartStore();
  const { isAuthenticated, user, syncOrderCountFromBackend } = useAuthStore();
  const location = useLocation();
  
  // Performance monitoring
  usePerformance();
  
  // Preload critical resources
  useEffect(() => {
    preloadCriticalResources();
  }, []);

  // Sync order count from backend when component mounts for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      syncOrderCountFromBackend();
    }
  }, [isAuthenticated, syncOrderCountFromBackend]);

  // Sync order count when page becomes visible (user returns from order success page)
  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout;
    
    const debouncedSync = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        if (isAuthenticated) {
          syncOrderCountFromBackend();
        }
      }, 1000); // Debounce by 1 second
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        console.log('🔄 Page became visible, syncing order count...');
        debouncedSync();
      }
    };

    const handleFocus = () => {
      if (isAuthenticated) {
        console.log('🔄 Page focused, syncing order count...');
        debouncedSync();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(debounceTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, syncOrderCountFromBackend]);

  // Sync order count when location changes (e.g., after order success)
  // Add debouncing to prevent excessive calls
  useEffect(() => {
    if (isAuthenticated) {
      const timeoutId = setTimeout(() => {
        syncOrderCountFromBackend();
      }, 500); // Debounce by 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname, isAuthenticated, syncOrderCountFromBackend]);

  // Test API connectivity
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        if (import.meta.env.DEV) {
          console.log('🧪 API Health Check Result:', data);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('🧪 API Health Check Failed:', error);
        }
      }
    };
    
    testAPI();
  }, []);

  // Fetch products
  const { data: allProducts, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products', { limit: 8, sortBy: 'newest' }],
      queryFn: async () => {
        try {
          const response = await apiClient.get<any>('/api/products', {
            params: { limit: 8, sortBy: 'newest' }
          });
          if (import.meta.env.DEV) {
            console.log('🔍 Raw API response:', response);
            console.log('🔍 Response type:', typeof response);
            console.log('🔍 Response keys:', Object.keys(response || {}));
            console.log('🔍 Response.products:', (response as any)?.products);
            console.log('🔍 Response.data:', (response as any)?.data);
          }
        
        // Handle the backend response format: { success: true, data: { products: [...] } }
        if (response && typeof response === 'object') {
          if (response.products) {
            return response.products;
          } else if (response.data && response.data.products) {
            return response.data.products;
          } else if (Array.isArray(response)) {
            return response;
          }
        }
        return [];
      } catch (error) {
        if (import.meta.env.DEV) console.error('🔍 API Error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const products = allProducts || [];
  
  // Debug logging
  if (import.meta.env.DEV) {
    console.log('HomePage: allProducts response:', allProducts);
    console.log('HomePage: products array:', products);
    console.log('HomePage: productsLoading:', productsLoading);
    console.log('HomePage: products length:', products?.length);
    console.log('HomePage: productsError:', productsError);
  }

  const handleAddToCart = (product: any) => {
    // Get the first available size
    const availableSize = product.sizes.find((size: any) => size.stock > 0);
    if (!availableSize) {
      toast.error('Product is out of stock');
      return;
    }

    const primaryImage = product.images.find((img: any) => img.isPrimary) || product.images[0];
    
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      size: availableSize.size,
      quantity: 1,
      image: primaryImage?.url || '',
      category: product.category && typeof product.category === 'object' && product.category.name 
        ? product.category.name 
        : product.category || 'Uncategorized',
      maxStock: availableSize.stock
    });

    toast.success('Added to cart!');
  };

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response: any = await apiClient.get('/api/categories');
      // The API returns { success: true, data: categories }
      if (response && typeof response === 'object') {
        if (response.data) {
          return response.data;
        } else if (Array.isArray(response)) {
          return response;
        }
      }
      return [];
    }
  });

  const categories = categoriesData || [];

  // Personalized free shipping message for signed-in users
  const getFreeShippingMessage = () => {
    if (!isAuthenticated || !user) {
      return {
        title: 'First 5 Orders Free Shipping',
        description: 'Sign up now and enjoy free shipping on your first 5 orders. No hidden fees, just great savings!'
      };
    }

    const remainingOrders = Math.max(0, 5 - (user.orderCount || 0));
    console.log('🔍 Free shipping calculation:', {
      userOrderCount: user.orderCount,
      remainingOrders,
      isAuthenticated,
      hasUser: !!user
    });

    if (remainingOrders === 0) {
      return {
        title: 'Free Shipping Unlocked!',
        description: 'You\'ve used all your free shipping orders. Continue shopping with us!'
      };
    }

    return {
      title: `${remainingOrders} Free Shipping Orders Left`,
      description: `You have ${remainingOrders} free shipping orders remaining. Keep shopping to unlock more savings!`
    };
  };

  const freeShippingInfo = getFreeShippingMessage();

  const trustFeatures = [
    { icon: Truck, title: freeShippingInfo.title, description: freeShippingInfo.description },
    { icon: Shield, title: '7-Day Returns', description: 'Hassle-free exchange policy' },
    { icon: Package, title: 'COD Available', description: 'Pay when you receive' },
    { icon: Headphones, title: 'WhatsApp Support', description: '24/7 customer care' },
    { icon: Star, title: 'Premium Quality', description: 'Handpicked products' },
    { icon: Cloud, title: 'Protected by Cloudflare', description: '100% secure checkout' }
  ];

  // Generate website schema for SEO
  const websiteSchema = generateWebsiteSchema();

  return (
    <div className="min-h-screen">
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Hero Section */}
      <motion.section 
        className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-r from-black to-gray-800 flex items-center justify-center text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://cdn.pixabay.com/photo/2017/01/18/16/46/hong-kong-1990268_640.jpg)'
          }}
        ></div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
            QUALITY PRODUCTS
            <span className="block text-yellow-400">FOR EVERYONE</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-300 px-4">
            Discover our curated collection of premium products for your lifestyle needs.
          </p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-yellow-500 transition-colors group"
            >
              Shop Now
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Featured Products Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Latest Products</h2>
            <p className="text-base sm:text-lg text-gray-600">Discover our newest arrivals</p>
          </motion.div>

          {productsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : productsError ? (
            <div className="text-center text-red-600">
              <p>Error loading products: {productsError.message}</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {products.slice(0, 4).map((product: any, index: number) => (
                <motion.div
                  key={product._id}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>No products available at the moment.</p>
            </div>
          )}
          
          <motion.div 
            className="text-center mt-6 sm:mt-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-yellow-500 transition-colors group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              View All Products
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-base sm:text-lg text-gray-600">Find your style, express your vibe</p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {categories.map((category: any, index: number) => (
              <motion.div
                key={category.slug}
                className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Link to={`/shop?category=${encodeURIComponent(category.slug || 'uncategorized')}`}>
                  <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                    <img
                      src={category.image || `/api/placeholder/400/300`}
                      alt={category.name || 'Category'}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-end">
                      <div className="p-3 sm:p-4 text-white">
                        <h3 className="text-base sm:text-lg font-bold mb-1">{category.name || 'Uncategorized'}</h3>
                        <p className="text-xs sm:text-sm text-gray-200">{category.description || 'No description available'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-base sm:text-lg text-gray-600">Discover our curated collection of premium products</p>
          </motion.div>
          
          {productsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
              {products.slice(0, 4).map((product: any, index: number) => (
                <motion.div
                  key={product._id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url || `/api/placeholder/300/400`}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.totalStock < 5 && product.totalStock > 0 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Only {product.totalStock} left!
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm sm:text-base">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {product.category && typeof product.category === 'object' && product.category.name 
                          ? product.category.name 
                          : product.category || 'Uncategorized'}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 bg-black text-white font-medium py-2 px-3 rounded hover:bg-gray-800 transition-colors text-xs sm:text-sm text-center"
                      >
                        {product.totalStock === 0 ? 'Out of Stock' : 'Order Now'}
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.totalStock === 0}
                        className="bg-yellow-400 text-black font-medium py-2 px-3 rounded hover:bg-yellow-500 transition-colors text-xs sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No featured products available</p>
            </div>
          )}
          
          <motion.div 
            className="text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-yellow-500 transition-colors group"
            >
              View All Products
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {trustFeatures.map((feature, index) => {
              const isFreeShipping = feature.title.includes('Free Shipping');
              const isHighlighted = isAuthenticated && isFreeShipping;
              
              return (
                <motion.div
                  key={index}
                  className={`text-center ${isHighlighted ? 'bg-yellow-100 p-3 rounded-lg border-2 border-yellow-300' : ''}`}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className={`${isHighlighted ? 'bg-yellow-500' : 'bg-yellow-400'} w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </div>
                  <h3 className={`font-semibold text-xs sm:text-sm ${isHighlighted ? 'text-yellow-800' : 'text-gray-900'} mb-1`}>{feature.title}</h3>
                  <p className={`text-xs ${isHighlighted ? 'text-yellow-700' : 'text-gray-600'} leading-tight`}>{feature.description}</p>
                  {isHighlighted && (
                    <div className="mt-2">
                      <span className="inline-block bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                        {isAuthenticated ? 'Your Status' : 'Sign in to see'}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free Shipping CTA for Non-Authenticated Users */}
      {!isAuthenticated && (
        <section className="py-6 sm:py-8 bg-yellow-50 border-t border-yellow-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-yellow-800 mb-2">Get Your First 5 Orders Free Shipping!</h3>
              <p className="text-sm sm:text-base text-yellow-700 mb-4">
                Sign up now and enjoy free shipping on your first 5 orders. No hidden fees, just great savings!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?google=true"
                  className="inline-flex items-center justify-center bg-white text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 text-sm"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Cloudflare Trust Badge */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Trusted by Cloudflare</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
              TrustyLads is powered by Cloudflare, ensuring fast, secure, and reliable delivery of your products.
            </p>
            <div className="flex items-center justify-center space-x-3 sm:space-x-6 text-yellow-400">
              <Cloud className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <p className="text-sm sm:text-base text-gray-700 mt-3 font-medium">
              "Handpicked by TrustyLads" - Your trust, our promise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Track Order Section */}
      <section className="py-8 sm:py-12 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Track Your Order</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              Enter your order ID to get real-time updates on your delivery
            </p>
            <Link
              to="/track"
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-yellow-500 transition-colors group"
            >
              Track Now
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">The TrustyLads Story</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
              At TrustyLads, we believe shopping should be simple, affordable, and reliable. That's why we handpick quality products across categories — from home essentials and kitchen finds to fashion, beauty, and lifestyle must-haves. Every product is chosen to make your everyday life easier, better, and more stylish. With secure checkout, trusted delivery, and customer-first support, TrustyLads is your go-to destination for everything you need — all in one place.
            </p>
            <div className="flex items-center justify-center space-x-3 sm:space-x-6 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-gray-700 mt-3 font-medium">
              "Handpicked by TrustyLads" - Your trust, our promise.
            </p>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;