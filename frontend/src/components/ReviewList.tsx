import React, { useState, useEffect, useCallback } from 'react';
import { Star, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import { Review } from '../types';

interface ReviewListProps {
  productId: string;
  className?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId, className = '' }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = useCallback(async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/reviews/product/${productId}?page=${pageNum}&limit=5`);
      console.log('🔍 Review API Response:', response);
      
      let newReviews, pagination;
      const responseData = response as any;
      if (responseData.data && responseData.data.reviews) {
        newReviews = responseData.data.reviews;
        pagination = responseData.data.pagination;
      } else if (responseData.reviews) {
        newReviews = responseData.reviews;
        pagination = responseData.pagination;
      } else {
        throw new Error('Invalid response format');
      }
      
      if (pageNum === 1) {
        setReviews(newReviews);
      } else {
        setReviews(prev => [...prev, ...newReviews]);
      }
      
      setTotalReviews(pagination.total);
      setHasMore(pageNum < pagination.pages);
      setError(null);
    } catch (err: any) {
      console.error('❌ Review loading error:', err);
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [productId, fetchReviews]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReviews(nextPage);
    }
  }, [loading, hasMore, page, fetchReviews]);

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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className={`${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchReviews()}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900">
          Customer Reviews ({totalReviews})
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center space-x-1">
            {renderStars(
              Math.round(
                reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
              )
            )}
            <span className="text-sm text-gray-600 ml-1">
              ({reviews.length} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const userPictureUrl = review.userPicture?.includes('via.placeholder.com')
              ? `https://placehold.co/40x40/3B82F6/FFFFFF?text=${review.userName.charAt(0)}`
              : review.userPicture;

            return (
              <motion.div
                key={review._id}
                className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    {userPictureUrl ? (
                      <img 
                        src={userPictureUrl} 
                        alt={review.userName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        width="32"
                        height="32"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const nextEl = target.nextElementSibling;
                          if (nextEl) nextEl.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 ${userPictureUrl ? 'hidden' : ''}`}>
                      <User className="h-4 w-4 text-black" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-gray-800 truncate">{review.userName}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-2">{renderStars(review.rating)}</div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed break-words">{review.comment}</p>
              </motion.div>
            );
          })}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 sm:px-4 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400 transition-colors text-sm sm:text-base font-medium"
              >
                {loading ? 'Loading...' : 'Load More Reviews'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
