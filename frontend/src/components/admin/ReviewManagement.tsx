import React, { useState, useEffect } from 'react';
import { Star, Plus, Edit, Trash2, Eye, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../utils/api';
import LoadingSpinner from '../LoadingSpinner';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  productId: string;
  userId?: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  isAdminReview: boolean;
  createdAt: string;
  product?: {
    name: string;
    images: Array<{ url: string; isPrimary: boolean }>;
  };
}

interface Product {
  _id: string;
  name: string;
  images: Array<{ url: string; isPrimary: boolean }>;
}

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    userName: '',
    userEmail: '',
    rating: 5,
    title: '',
    comment: '',
    isAdminReview: true
  });

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/reviews/admin/all');
      console.log('🔍 Admin Reviews API Response:', response);
      
      // Handle both response structures and ensure proper data extraction
      let reviewsData = [];
      if (response && typeof response === 'object') {
        const responseObj = response as any;
        if (responseObj.data && responseObj.data.reviews) {
          reviewsData = responseObj.data.reviews;
        } else if (responseObj.reviews) {
          reviewsData = responseObj.reviews;
        } else if (Array.isArray(responseObj)) {
          reviewsData = responseObj;
        }
      }
      
      console.log('🔍 Processed reviews data:', reviewsData);
      setReviews(reviewsData);
    } catch (error: any) {
      console.error('❌ Failed to fetch reviews:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/api/products?limit=100');
      console.log('🔍 Products API Response:', response);
      
      // Handle both response structures
      let productsData = [];
      if (response && typeof response === 'object') {
        const responseObj = response as any;
        if (responseObj.data && responseObj.data.products) {
          productsData = responseObj.data.products;
        } else if (responseObj.products) {
          productsData = responseObj.products;
        } else if (Array.isArray(responseObj)) {
          productsData = responseObj;
        }
      }
      
      console.log('🔍 Processed products data:', productsData);
      setProducts(productsData);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.userName || !formData.title || !formData.comment) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingReview) {
        await apiClient.put(`/api/reviews/admin/${editingReview._id}`, formData);
        toast.success('Review updated successfully');
      } else {
        await apiClient.post('/api/reviews/admin/create', formData);
        toast.success('Review created successfully');
      }
      
      setShowAddForm(false);
      setEditingReview(null);
      resetForm();
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save review');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await apiClient.delete(`/api/reviews/admin/${reviewId}`);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      productId: review.productId,
      userName: review.userName,
      userEmail: review.userEmail,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isAdminReview: review.isAdminReview
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      productId: '',
        userName: '',
        userEmail: '',
        rating: 5,
        title: '',
      comment: '',
      isAdminReview: true
    });
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'approved' && review.isApproved) ||
                         (filterStatus === 'pending' && !review.isApproved);
    
    const matchesProduct = !selectedProduct || review.productId === selectedProduct;
    
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProductName = (productId: string) => {
    // First try to find in the populated product data from reviews
    const review = reviews.find(r => r.productId === productId);
    if (review && review.product && review.product.name) {
      return review.product.name;
    }
    
    // Fallback to products array
    const product = products.find(p => p._id === productId);
    return product?.name || 'Unknown Product';
  };

  const getProductImage = (productId: string) => {
    // First try to find in the populated product data from reviews
    const review = reviews.find(r => r.productId === productId);
    if (review && review.product && review.product.images) {
      const primaryImage = review.product.images.find(img => img.isPrimary);
      return primaryImage?.url || review.product.images[0]?.url || 'https://ui-avatars.com/api/?name=Product&background=f3f4f6&color=9ca3af&size=50';
    }
    
    // Fallback to products array
    const product = products.find(p => p._id === productId);
    if (product && product.images) {
      const primaryImage = product.images.find(img => img.isPrimary);
      return primaryImage?.url || product.images[0]?.url || 'https://ui-avatars.com/api/?name=Product&background=f3f4f6&color=9ca3af&size=50';
    }
    
    return 'https://ui-avatars.com/api/?name=Product&background=f3f4f6&color=9ca3af&size=50';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
          <p className="text-gray-600">Manage all product reviews and create admin reviews</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingReview(null);
            resetForm();
          }}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
          >
              <option value="">All Products</option>
              {products.map(product => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setSelectedProduct('');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Review Form */}
      <AnimatePresence>
        {showAddForm && (
              <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingReview ? 'Edit Review' : 'Add New Review'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingReview(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product *
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: index + 1 })}
                        className="transition-colors duration-200"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            index < formData.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Name *
                      </label>
                      <input
                        type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="Enter user name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        required
                      />
                    </div>
              
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Email
                      </label>
                      <input
                        type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  placeholder="Enter user email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      />
                    </div>
              
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Title *
                    </label>
                    <input
                      type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter review title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      required
                    />
                  </div>
              
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Comment *
                    </label>
                    <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Enter review comment"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none"
                      required
                    />
                  </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAdminReview"
                  checked={formData.isAdminReview}
                  onChange={(e) => setFormData({ ...formData, isAdminReview: e.target.checked })}
                  className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                />
                <label htmlFor="isAdminReview" className="text-sm text-gray-700">
                  Mark as Admin Review
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReview(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  {editingReview ? 'Update Review' : 'Create Review'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Reviews ({filteredReviews.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getProductImage(review.productId)}
                        alt={getProductName(review.productId)}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getProductName(review.productId)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.isAdminReview ? 'Admin Review' : 'User Review'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {review.userName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {review.userEmail}
                      </div>
          </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900">
                        {review.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {review.comment}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit Review"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews found matching your criteria</p>
            </div>
          )}
        </div>

      {/* Review Detail Modal */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Review Details</h3>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={getProductImage(selectedReview.productId)}
                      alt={getProductName(selectedReview.productId)}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
          <div>
                      <h4 className="font-medium text-gray-900">
                        {getProductName(selectedReview.productId)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {selectedReview.isAdminReview ? 'Admin Review' : 'User Review'}
                      </p>
                    </div>
                          </div>
                  
                  <div className="flex items-center space-x-2">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-gray-600">
                      {selectedReview.rating} stars
                            </span>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">
                      {selectedReview.title}
                    </h5>
                    <p className="text-gray-600">{selectedReview.comment}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">User:</span>
                      <span className="ml-2 font-medium">{selectedReview.userName}</span>
                        </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 font-medium">{selectedReview.userEmail}</span>
                      </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedReview.createdAt)}</span>
                      </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedReview.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedReview.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewManagement;
