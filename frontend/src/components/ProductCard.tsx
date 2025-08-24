import React from 'react';
import { Link } from 'react-router-dom';
// import { Heart, Star, ShoppingBag } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
// import { useAuthStore } from '../store/useAuthStore';
// import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  // const { isAuthenticated } = useAuthStore();
  // const [isFavorite, setIsFavorite] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  // Check if product is in favorites on component mount
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     checkFavoriteStatus();
  //   }
  // }, [product._id, isAuthenticated]);

  // const checkFavoriteStatus = async () => {
  //   try {
  //     const response = await apiClient.get(`/api/favorites/check/${product._id}`);
  //     setIsFavorite(response.data?.isFavorite || false);
  //   } catch (error) {
  //     // Silently fail - user might not be logged in
  //   }
  // };

  // const toggleFavorite = async () => {
  //   if (!isAuthenticated) {
  //     toast.error('Please log in to add favorites');
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     if (isFavorite) {
  //       await apiClient.delete(`/api/favorites/${product._id}`);
  //       setIsFavorite(false);
  //       toast.success('Removed from favorites');
  //     } else {
  //       await apiClient.post('/api/favorites', { productId: product._id });
  //       setIsFavorite(true);
  //       toast.success('Added to favorites');
  //     }
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.message || 'Failed to update favorites');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    // Get the first available size
    const availableSize = product.sizes.find(size => size.stock > 0);
    if (!availableSize) {
      toast.error('Product is out of stock');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      size: availableSize.size,
      quantity: 1,
      image: primaryImage?.url || '',
      category: product.category && typeof product.category === 'object' && (product.category as any).name 
        ? (product.category as any).name 
        : product.category || 'Uncategorized',
      maxStock: availableSize.stock
    });

    toast.success('Added to cart!');
  };

  return (
    <motion.div
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link to={`/product/${product._id}`} className="block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="relative overflow-hidden">
          <img
            src={primaryImage?.url || 'https://via.placeholder.com/300x400/f3f4f6/9ca3af?text=No+Image'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}
          
          {product.totalStock < 5 && product.totalStock > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              Only {product.totalStock} left!
            </div>
          )}
          
          {/* Favorites button - commented out for now */}
          {/* 
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite();
              }}
              disabled={isLoading}
              className={`p-2 rounded-full shadow-md transition-colors ${
                isFavorite 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          */}
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm sm:text-base">
            {product.name}
          </h3>
          
          {/* Reviews - commented out for now */}
          {/* 
          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <span className="ml-1 text-xs text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          </div>
          */}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice!.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 capitalize">
              {product.category && typeof product.category === 'object' && (product.category as any).name 
                ? (product.category as any).name 
                : product.category || 'Uncategorized'}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => window.location.href = `/product/${product._id}`}
              disabled={product.totalStock === 0}
              className="flex-1 bg-black text-white font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors text-sm text-center disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.totalStock === 0 ? 'Out of Stock' : 'Order Now'}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.totalStock === 0}
              className="bg-yellow-400 text-black font-medium py-2 px-4 rounded hover:bg-yellow-500 transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              title="Add to Cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;