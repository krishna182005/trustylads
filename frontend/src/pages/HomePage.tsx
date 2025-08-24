import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones, Package, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api';
import { useCartStore } from '../store/useCartStore';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const { addItem } = useCartStore();

  // Test API connectivity
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🧪 Testing API connectivity...');
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('🧪 API Health Check Result:', data);
      } catch (error) {
        console.error('🧪 API Health Check Failed:', error);
      }
    };
    
    testAPI();
  }, []);

  // Fetch products
  const { data: allProducts, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products', { limit: 8, sortBy: 'newest' }],
    queryFn: async () => {
      console.log('🔍 Fetching products from API...');
      try {
        const response = await apiClient.get<any>('/api/products', {
          params: { limit: 8, sortBy: 'newest' }
        });
        console.log('🔍 Raw API response:', response);
        console.log('🔍 Response type:', typeof response);
        console.log('🔍 Response keys:', Object.keys(response || {}));
        console.log('🔍 Response.products:', (response as any)?.products);
        console.log('🔍 Response.data:', (response as any)?.data);
        return (response as any)?.products || (response as any)?.data || [];
      } catch (error) {
        console.error('🔍 API Error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const products = allProducts || [];
  
  // Debug logging
  console.log('HomePage: allProducts response:', allProducts);
  console.log('HomePage: products array:', products);
  console.log('HomePage: productsLoading:', productsLoading);
  console.log('HomePage: products length:', products?.length);
  console.log('HomePage: productsError:', productsError);

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
      return response.data || response || [];
    }
  });

  const categories = categoriesData || [
    {
      name: 'Shirts',
      slug: 'shirts',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
      description: 'Premium streetwear shirts'
    },
    {
      name: 'Watches',
      slug: 'watches',
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
      description: 'Style that speaks time'
    },
    {
      name: 'Jewelry',
      slug: 'jewelry',
      image: 'https://images.pexels.com/photos/1213691/pexels-photo-1213691.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
      description: 'Bold accessories for bold souls'
    }
  ];

  const trustFeatures = [
    { icon: Truck, title: 'Free Shipping Over ₹999', description: 'Fast delivery across India' },
    { icon: Shield, title: '7-Day Returns', description: 'Hassle-free exchange policy' },
    { icon: Package, title: 'COD Available', description: 'Pay when you receive' },
    { icon: Headphones, title: 'WhatsApp Support', description: '24/7 customer care' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen bg-gradient-to-r from-black to-gray-800 flex items-center justify-center text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1)'
          }}
        ></div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            QUALITY PRODUCTS
            <span className="block text-yellow-400">FOR EVERYONE</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-300 px-4">
            Discover our curated collection of premium products for your lifestyle needs.
          </p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-yellow-500 transition-colors group"
            >
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Latest Products</h2>
            <p className="text-lg sm:text-xl text-gray-600">Discover our newest arrivals</p>
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product: any, index: number) => (
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
            className="text-center mt-8 sm:mt-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-yellow-500 transition-colors group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg sm:text-xl text-gray-600">Find your style, express your vibe</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category: any, index: number) => (
              <motion.div
                key={category.slug}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Link to={`/shop?category=${encodeURIComponent(category.slug || 'uncategorized')}`}>
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                    <img
                      src={category.image || `/api/placeholder/400/300`}
                      alt={category.name || 'Category'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-end">
                      <div className="p-4 sm:p-5 text-white">
                        <h3 className="text-lg sm:text-xl font-bold mb-2">{category.name || 'Uncategorized'}</h3>
                        <p className="text-sm text-gray-200">{category.description || 'No description available'}</p>
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
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg sm:text-xl text-gray-600">Handpicked streetwear that defines your style</p>
          </motion.div>
          
          {productsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover hover:scale-105 transition-transform duration-300"
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
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="ml-1 text-xs text-gray-600">
                          {product.rating.toFixed(1)} ({product.reviewCount})
                        </span>
                      </div>
                    </div>

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
                        className="flex-1 bg-black text-white font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors text-sm text-center"
                      >
                        {product.totalStock === 0 ? 'Out of Stock' : 'Order Now'}
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.totalStock === 0}
                        className="bg-yellow-400 text-black font-medium py-2 px-4 rounded hover:bg-yellow-500 transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
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
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-full hover:bg-yellow-500 transition-colors group"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {trustFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="bg-yellow-400 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Order Section */}
      <section className="py-16 sm:py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Track Your Order</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
              Enter your order ID to get real-time updates on your delivery
            </p>
            <Link
              to="/track"
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-yellow-500 transition-colors group"
            >
              Track Now
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">The TrustyLads Story</h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8">
              At TrustyLads, we believe shopping should be simple, affordable, and reliable. That's why we handpick quality products across categories — from home essentials and kitchen finds to fashion, beauty, and lifestyle must-haves. Every product is chosen to make your everyday life easier, better, and more stylish. With secure checkout, trusted delivery, and customer-first support, TrustyLads is your go-to destination for everything you need — all in one place.
            </p>
            <div className="flex items-center justify-center space-x-4 sm:space-x-8 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 sm:h-8 sm:w-8 fill-current" />
              ))}
            </div>
            <p className="text-base sm:text-lg text-gray-700 mt-4 font-medium">
              "Handpicked by TrustyLads" - Your trust, our promise.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;