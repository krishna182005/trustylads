import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  productId: string;
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
    images: Array<{ url: string; alt: string }>;
  };
}

interface Product {
  _id: string;
  name: string;
  images: Array<{ url: string; alt: string }>;
}

const ReviewManagement: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [showMockForm, setShowMockForm] = useState(false);
  const [mockReviewData, setMockReviewData] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    title: '',
    comment: ''
  });

  const queryClient = useQueryClient();

  // Fetch products for dropdown
  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>('/api/products?limit=100');
      return response.products || [];
    }
  });

  // Fetch pending reviews
  const { data: pendingReviews, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-reviews'],
    queryFn: async () => {
      const response = await apiClient.get<{ reviews: Review[] }>('/api/reviews/admin/pending');
      return response.reviews || [];
    }
  });

  // Fetch product reviews when product is selected
  const { data: productReviews, isLoading: productReviewsLoading } = useQuery({
    queryKey: ['product-reviews', selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return { reviews: [] };
      const response = await apiClient.get<{ reviews: Review[] }>(`/api/reviews/admin/product/${selectedProduct}`);
      return response;
    },
    enabled: !!selectedProduct
  });

  // Mutations
  const approveReviewMutation = useMutation({
    mutationFn: async ({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) => {
      return apiClient.put(`/api/reviews/admin/${reviewId}/approve`, { isApproved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] });
      if (selectedProduct) {
        queryClient.invalidateQueries({ queryKey: ['product-reviews', selectedProduct] });
      }
      toast.success('Review status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update review status');
    }
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      return apiClient.delete(`/api/reviews/admin/${reviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] });
      if (selectedProduct) {
        queryClient.invalidateQueries({ queryKey: ['product-reviews', selectedProduct] });
      }
      toast.success('Review deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete review');
    }
  });

  const createMockReviewMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiClient.post('/api/reviews/admin/mock', {
        productId: selectedProduct,
        ...data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', selectedProduct] });
      setShowMockForm(false);
      setMockReviewData({
        userName: '',
        userEmail: '',
        rating: 5,
        title: '',
        comment: ''
      });
      toast.success('Mock review created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create mock review');
    }
  });

  const handleCreateMockReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error('Please select a product first');
      return;
    }
    createMockReviewMutation.mutate(mockReviewData);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Management</h2>
        
        {/* Product Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product to Manage Reviews
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
          >
            <option value="">Choose a product...</option>
            {products?.map((product: Product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mock Review Form */}
        {selectedProduct && (
          <div className="mb-6">
            <button
              onClick={() => setShowMockForm(!showMockForm)}
              className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Fake Review</span>
            </button>

            {showMockForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <form onSubmit={handleCreateMockReview} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Name
                      </label>
                      <input
                        type="text"
                        value={mockReviewData.userName}
                        onChange={(e) => setMockReviewData({ ...mockReviewData, userName: e.target.value })}
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
                        value={mockReviewData.userEmail}
                        onChange={(e) => setMockReviewData({ ...mockReviewData, userEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setMockReviewData({ ...mockReviewData, rating })}
                          className={`p-1 rounded ${
                            mockReviewData.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={mockReviewData.title}
                      onChange={(e) => setMockReviewData({ ...mockReviewData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Comment
                    </label>
                    <textarea
                      value={mockReviewData.comment}
                      onChange={(e) => setMockReviewData({ ...mockReviewData, comment: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={createMockReviewMutation.isPending}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {createMockReviewMutation.isPending ? 'Creating...' : 'Create Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMockForm(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        )}

        {/* Pending Reviews */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Reviews ({pendingReviews?.length || 0})</h3>
          {pendingLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : pendingReviews?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No pending reviews</div>
          ) : (
            <div className="space-y-3">
              {pendingReviews?.map((review: Review) => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        <span className="text-sm text-gray-500">({review.userEmail})</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      {review.product && (
                        <p className="text-sm text-gray-500 mt-2">
                          Product: {review.product.name}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => approveReviewMutation.mutate({ reviewId: review._id, isApproved: true })}
                        className="text-green-600 hover:text-green-700 p-1"
                        title="Approve"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => approveReviewMutation.mutate({ reviewId: review._id, isApproved: false })}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Reviews */}
        {selectedProduct && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Reviews ({productReviews?.reviews?.length || 0})
            </h3>
            {productReviewsLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : productReviews?.reviews?.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No reviews for this product</div>
            ) : (
              <div className="space-y-3">
                {productReviews?.reviews?.map((review: Review) => (
                  <div key={review._id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{review.userName}</span>
                          <span className="text-sm text-gray-500">({review.userEmail})</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          {review.isAdminReview && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Admin Review
                            </span>
                          )}
                          {review.isApproved ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Approved
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => deleteReviewMutation.mutate(review._id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;
