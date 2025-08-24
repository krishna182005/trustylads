import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
// import { useAuthStore } from '../store/useAuthStore';
import { apiClient } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  // const [isWishlisted, setIsWishlisted] = useState(false);
  // const [showReviewForm, setShowReviewForm] = useState(false);
  // const [reviewForm, setReviewForm] = useState({
  //   rating: 5,
  //   title: '',
  //   comment: ''
  // });

  // Fetch product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => apiClient.get(`/api/products/${id}`),
    enabled: !!id,
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ['related-products', product?.category],
    queryFn: () => apiClient.get(`/api/products?category=${product?.category}&limit=4`),
    enabled: !!product?.category,
  });

  // const queryClient = useQueryClient();
  // const { isAuthenticated } = useAuthStore();

  // Submit review mutation - commented out for now
  // const submitReviewMutation = useMutation({
  //   mutationFn: (reviewData: any) => apiClient.post('/api/reviews', reviewData),
  //   onSuccess: () => {
  //     toast.success('Review submitted successfully!');
  //     setShowReviewForm(false);
  //     setReviewForm({ rating: 5, title: '', comment: '' });
  //     queryClient.invalidateQueries({ queryKey: ['product-reviews', id] });
  //     queryClient.invalidateQueries({ queryKey: ['product', id] });
  //   },
  //   onError: (error: any) => {
  //     toast.error(error.response?.data?.message || 'Failed to submit review');
  //   }
  // });

  useEffect(() => {
    if (product?.sizes.length) {
      const availableSize = product.sizes.find(size => size.stock > 0);
      if (availableSize) {
        setSelectedSize(availableSize.size);
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const sizeData = product.sizes.find(size => size.size === selectedSize);
    if (!sizeData || sizeData.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
    
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: primaryImage?.url || '',
      category: typeof product.category === 'object' ? (product.category as any).name : product.category,
      maxStock: sizeData.stock
    });

    toast.success('Added to cart!');
  };

  const handleOrderNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out this ${typeof product?.category === 'object' ? (product?.category as any).name : product?.category} from TrustyLads`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // const handleSubmitReview = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!isAuthenticated) {
  //     toast.error('Please log in to submit a review');
  //     return;
  //   }
    
  //   submitReviewMutation.mutate({
  //     productId: id,
  //     ...reviewForm
  //   });
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => { navigate('/shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
  const maxQuantity = selectedSizeData?.stock || 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div 
          className="mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => { navigate(-1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <nav className="text-sm text-gray-500">
            <span>Home</span> / <span>Shop</span> /             <span className="capitalize">
                                      {product.category && typeof product.category === 'object' && (product.category as any).name 
                          ? (product.category as any).name 
                          : product.category || 'Uncategorized'}
            </span> / <span className="text-gray-900">{product.name}</span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-8">
              {/* Main Image */}
              <div className="relative mb-4 bg-white rounded-lg overflow-hidden shadow-md">
                                 <img
                   src={product.images[selectedImageIndex]?.url || 'https://via.placeholder.com/600x800/f3f4f6/9ca3af?text=No+Image'}
                   alt={product.name}
                   className="w-full h-96 md:h-[500px] object-cover"
                 />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                    -{discountPercentage}% OFF
                  </div>
                )}
                {/* Favorites button - commented out for now */}
                {/* 
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                */}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index ? 'border-yellow-400' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Product Title & Rating */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  {/* Reviews - commented out for now */}
                  {/* 
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                    </span>
                  </div>
                  */}
                  <button
                    onClick={handleShare}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice!.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock === 0}
                      className={`py-2 px-4 border rounded-lg text-center transition-colors ${
                        selectedSize === size.size
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
                          : size.stock === 0
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size.size}
                      {size.stock === 0 && <div className="text-xs">Out of Stock</div>}
                    </button>
                  ))}
                </div>
                {selectedSizeData && selectedSizeData.stock < 5 && (
                  <p className="text-sm text-orange-600 mt-2">
                    Only {selectedSizeData.stock} left in stock!
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    disabled={quantity >= maxQuantity}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleOrderNow}
                  disabled={!selectedSize || maxQuantity === 0}
                  className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Order Now
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || maxQuantity === 0}
                  className="w-full bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">7-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              {product.specifications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Specifications</h4>
                  <dl className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex">
                        <dt className="w-1/3 text-sm text-gray-600">{spec.key}:</dt>
                        <dd className="w-2/3 text-sm text-gray-900">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* Reviews Section - removed for now */}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.filter(p => p._id !== product._id).slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;