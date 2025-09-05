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
import ProductImageZoom from '../components/ProductImageZoom';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import toast from 'react-hot-toast';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/schema';
import SEO from '../components/SEO';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  // const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
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

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  // Generate JSON-LD schema for SEO
  const productSchema = product ? generateProductSchema(product) : null;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: typeof product?.category === 'object' ? (product?.category as any).name : product?.category || 'Product', url: `/shop?category=${typeof product?.category === 'object' ? (product?.category as any).name : product?.category}` },
    { name: product?.name || 'Product', url: `/product/${id}` }
  ]);

  return (
    <>
      <SEO 
        title={product ? `${product.name} - TrustyLads` : 'Product - TrustyLads'}
        description={product ? product.description || `Buy ${product.name} at TrustyLads. ${product.description || 'Premium quality product with fast shipping.'}` : 'Product details at TrustyLads'}
        canonical={`https://www.trustylads.tech/product/${id}`}
        ogImage={product?.images?.[0]?.url || 'https://www.trustylads.tech/og-image.svg'}
      />
      <div className="min-h-screen bg-gray-50">
        {/* JSON-LD Schema for SEO */}
        {productSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
          />
        )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
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
                  src={product.images[selectedImageIndex]?.url || 'https://ui-avatars.com/api/?name=Product&background=f3f4f6&color=9ca3af&size=600x800'}
                  alt={product.name}
                  className="w-full h-80 sm:h-96 md:h-[500px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setIsZoomOpen(true)}
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
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              {/* Product Title & Rating */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
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
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {hasDiscount && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      ₹{product.originalPrice!.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock === 0}
                      className={`py-3 px-2 sm:py-2 sm:px-4 border rounded-lg text-center transition-colors text-sm sm:text-base ${
                        selectedSize === size.size
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
                          : size.stock === 0
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{size.size}</div>
                      {size.stock === 0 && <div className="text-xs mt-1">Out of Stock</div>}
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
                <div className="flex items-center space-x-3 max-w-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 sm:w-10 sm:h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-lg sm:text-base"
                  >
                    -
                  </button>
                  <span className="w-16 sm:w-12 text-center font-medium text-lg sm:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    disabled={quantity >= maxQuantity}
                    className="w-12 h-12 sm:w-10 sm:h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg sm:text-base"
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
                  className="w-full bg-black text-white font-semibold py-4 sm:py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-base sm:text-sm"
                >
                  Order Now
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || maxQuantity === 0}
                  className="w-full bg-yellow-400 text-black font-semibold py-4 sm:py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-base sm:text-sm"
                >
                  <ShoppingBag className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
                  Add to Cart
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">7-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">{product.description}</p>
              
              {product.specifications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-base sm:text-lg">Specifications</h4>
                  <dl className="space-y-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-start">
                        <dt className="w-full sm:w-1/3 text-sm text-gray-600 font-medium mb-1 sm:mb-0">{spec.key}:</dt>
                        <dd className="w-full sm:w-2/3 text-sm sm:text-base text-gray-900 break-words">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
              <ReviewList productId={product._id} />
            </div>

            {/* Review Form */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors text-sm"
                >
                  {showReviewForm ? 'Hide Form' : 'Add Review'}
                </button>
              </div>
              
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewForm
                    productId={product._id}
                    productName={product.name}
                    onReviewSubmitted={() => {
                      // Refresh reviews after submission
                      window.location.reload();
                    }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <motion.div
            className="mt-12 sm:mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.filter(p => p._id !== product._id).slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Image Zoom Modal */}
      <ProductImageZoom
        imageUrl={product?.images[selectedImageIndex]?.url || ''}
        alt={product?.name || ''}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
    </>
  );
};

export default ProductDetailPage;