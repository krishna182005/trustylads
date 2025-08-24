import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { apiClient } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ShopPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Simple query to get all products
  const { data: productsResponse, isLoading, error } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      console.log('📦 Fetching all products...');
      const response = await apiClient.get<any>('/api/products?limit=100');
      console.log('📦 Products response:', response);
      console.log('📦 Response data structure:', {
        hasProducts: !!response?.products,
        productsLength: response?.products?.length || 0,
        hasPagination: !!response?.pagination
      });
      return response;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Get products from response - API client already handles the response structure
  const allProducts = (productsResponse as any)?.products || [];
  
  // Filter products based on search and category (supports category name OR slug from URL)
  const filteredProducts = allProducts.filter((product: Product) => {
    const matchesSearch = !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const selected = (selectedCategory || '').toLowerCase().trim();

    let categoryNameLc = '';
    let categorySlugLc = '';
    const cat: any = (product as any).category;
    if (cat && typeof cat === 'object') {
      categoryNameLc = (cat.name || '').toLowerCase();
      categorySlugLc = (cat.slug || '').toLowerCase();
    } else if (typeof cat === 'string') {
      // For legacy data where category is a string, treat it as both name and slug for matching
      categoryNameLc = (cat || '').toLowerCase();
      categorySlugLc = (cat || '').toLowerCase();
    }

    const matchesCategory = !selected || categoryNameLc === selected || categorySlugLc === selected;

    return matchesSearch && matchesCategory;
  });

  console.log('ShopPage render:', {
    allProductsCount: allProducts.length,
    filteredCount: filteredProducts.length,
    searchTerm,
    selectedCategory,
    isLoading,
    error: error?.message
  });

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get<any>('/api/categories');
      // The API returns { success: true, data: categories }
      return (response as any).data || response || [];
    }
  });

  const categories = categoriesResponse || [];

  // Get category from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      // Scroll to top when category changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.search]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    // Update URL to remove category filter
    navigate('/shop');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (categoryName) {
      // Update URL with category filter
      navigate(`/shop?category=${categoryName}`);
    } else {
      navigate('/shop');
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if search should be focused
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('focus') === 'search') {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        // Remove focus param from URL
        navigate('/shop', { replace: true });
      }
    }
  }, [location.search, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading products</h2>
          <p className="text-gray-600 mb-4">{error.message || 'Failed to load products'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop TrustyLads</h1>
          <p className="text-gray-600">Discover lifestyle products for every need</p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            {/* Category Filter */}
            <div className="hidden md:flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="">All Categories</option>
                {categories.map((category: any) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Mobile Filters */}
            {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category: any) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  </div>
                </div>
            )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {allProducts.length} products
            {(searchTerm || selectedCategory) && (
              <span className="ml-2">
                <button
                  onClick={clearFilters}
                  className="text-yellow-600 hover:text-yellow-700 underline"
                >
                  Clear filters
                </button>
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filters' 
                : 'No products available in the database'
              }
            </p>
            
            {!searchTerm && !selectedCategory && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  The shop is currently empty. Products need to be added through the admin panel.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.location.href = '/admin'}
                    className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Admin Panel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/add-sample-products', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                          }
                        });
                        const data = await response.json();
                        if (data.success) {
                          alert('Sample products added! Refresh the page to see them.');
                          window.location.reload();
                        } else {
                          alert('Failed to add products: ' + data.message);
                        }
                      } catch {
                        alert('Error: You need to be logged in as admin to add sample products.');
                      }
                    }}
                    className="bg-purple-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Sample Products (Admin)
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/products/add-sample', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          }
                        });
                        const data = await response.json();
                        if (data.success) {
                          alert('Sample products added! Refresh the page to see them.');
                          window.location.reload();
                        } else {
                          alert('Failed to add products: ' + data.message);
                        }
                      } catch (error) {
                        alert('Error adding sample products: ' + error);
                      }
                    }}
                    className="bg-green-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Sample Products (Quick)
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/products/test');
                        const data = await response.json();
                        console.log('Database test result:', data);
                        alert(`Database status: ${data.message}\nProducts found: ${data.count}`);
                      } catch (error) {
                        alert('Error testing database: ' + error);
                      }
                    }}
                    className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Test Database
                  </button>
                  <a
                    href="https://wa.me/916369360104?text=Hi, I need help setting up products for my shop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            )}
            
            {(searchTerm || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="bg-yellow-400 text-black font-medium px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Clear Filters
            </button>
            )}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
            layout
          >
            {filteredProducts.map((product: Product, index: number) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;