import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'rating' | 'newest' | 'popular';
  featured?: boolean;
  inStock?: boolean;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

/**
 * Custom hook for fetching and managing product data
 */
export const useProducts = (filters: ProductFilters = {}, options: { enabled?: boolean } = {}) => {
  const queryKey = ['products', filters];
  
  return useQuery<ProductsResponse>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      return apiClient.get(`/api/products?${params.toString()}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options.enabled !== false,
  });
};

/**
 * Hook for infinite scrolling products
 */
export const useInfiniteProducts = (filters: ProductFilters = {}) => {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ['products-infinite', filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.append('page', (pageParam as number).toString());
      params.append('limit', '12');
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      return apiClient.get(`/api/products?${params.toString()}`);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for fetching a single product
 */
export const useProduct = (productId: string, options: { enabled?: boolean } = {}) => {
  return useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => apiClient.get(`/api/products/${productId}`),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!productId && options.enabled !== false,
  });
};

/**
 * Hook for fetching featured products
 */
export const useFeaturedProducts = (limit: number = 8) => {
  return useQuery<Product[]>({
    queryKey: ['featured-products', limit],
    queryFn: () => apiClient.get(`/api/products/featured?limit=${limit}`),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook for fetching related products
 */
export const useRelatedProducts = (productId: string, category: string, limit: number = 4) => {
  return useQuery<Product[]>({
    queryKey: ['related-products', productId, category, limit],
    queryFn: () => apiClient.get(`/api/products/related/${productId}?category=${category}&limit=${limit}`),
    staleTime: 10 * 60 * 1000,
    enabled: !!productId && !!category,
  });
};

/**
 * Hook for searching products
 */
export const useProductSearch = (query: string, options: { enabled?: boolean } = {}) => {
  return useQuery<Product[]>({
    queryKey: ['product-search', query],
    queryFn: () => apiClient.get(`/api/products/search?q=${encodeURIComponent(query)}`),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!query && query.length >= 2 && options.enabled !== false,
  });
};

/**
 * Hook for fetching product categories
 */
export const useProductCategories = () => {
  return useQuery<string[]>({
    queryKey: ['product-categories'],
    queryFn: () => apiClient.get('/api/products/categories'),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for fetching product filters/facets
 */
export const useProductFilters = (category?: string) => {
  return useQuery({
    queryKey: ['product-filters', category],
    queryFn: () => apiClient.get(`/api/products/filters${category ? `?category=${category}` : ''}`),
    staleTime: 15 * 60 * 1000,
  });
};

/**
 * Hook for product wishlist operations (if implemented)
 */
export const useProductWishlist = () => {
  const queryClient = useQueryClient();
  
  const addToWishlist = useMutation({
    mutationFn: (productId: string) => apiClient.post('/api/wishlist/add', { productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
    onError: () => {
      toast.error('Failed to add to wishlist');
    },
  });
  
  const removeFromWishlist = useMutation({
    mutationFn: (productId: string) => apiClient.delete(`/api/wishlist/remove/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
    onError: () => {
      toast.error('Failed to remove from wishlist');
    },
  });
  
  return {
    addToWishlist: addToWishlist.mutate,
    removeFromWishlist: removeFromWishlist.mutate,
    isAddingToWishlist: addToWishlist.isPending,
    isRemovingFromWishlist: removeFromWishlist.isPending,
  };
};

/**
 * Hook for product reviews (if implemented)
 */
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => apiClient.get(`/api/products/${productId}/reviews`),
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
  });
};

/**
 * Hook for submitting product reviews
 */
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) =>
      apiClient.post(`/api/products/${productId}/reviews`, { rating, comment }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      toast.success('Review submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit review');
    },
  });
};

/**
 * Utility hook for product operations
 */
export const useProductUtils = () => {
  /**
   * Check if product is in stock
   */
  const isInStock = (product: Product, size?: string): boolean => {
    if (size) {
      const sizeData = product.sizes.find(s => s.size === size);
      return sizeData ? sizeData.stock > 0 : false;
    }
    return product.totalStock > 0;
  };
  
  /**
   * Get available sizes for a product
   */
  const getAvailableSizes = (product: Product) => {
    return product.sizes.filter(size => size.stock > 0);
  };
  
  /**
   * Get product discount percentage
   */
  const getDiscountPercentage = (product: Product): number => {
    if (!product.originalPrice || product.originalPrice <= product.price) {
      return 0;
    }
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };
  
  /**
   * Check if product is on sale
   */
  const isOnSale = (product: Product): boolean => {
    return getDiscountPercentage(product) > 0;
  };
  
  /**
   * Get primary product image
   */
  const getPrimaryImage = (product: Product) => {
    return product.images.find(img => img.isPrimary) || product.images[0];
  };
  
  /**
   * Format product price
   */
  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString()}`;
  };
  
  /**
   * Get stock status text
   */
  const getStockStatus = (product: Product, size?: string): string => {
    const stock = size 
      ? product.sizes.find(s => s.size === size)?.stock || 0
      : product.totalStock;
    
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return `Only ${stock} left`;
    return 'In Stock';
  };
  
  return {
    isInStock,
    getAvailableSizes,
    getDiscountPercentage,
    isOnSale,
    getPrimaryImage,
    formatPrice,
    getStockStatus,
  };
};

export default useProducts;