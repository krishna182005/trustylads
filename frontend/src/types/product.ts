export interface Product {
  _id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: ProductSize[];
  totalStock: number;
  images: ProductImage[];
  specifications: ProductSpecification[];
  tags: string[];
  featured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSize {
  size: string;
  stock: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: ProductSize[];
  images: ProductImage[];
  specifications?: ProductSpecification[];
  tags?: string[];
  featured?: boolean;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  isActive?: boolean;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  limit: number;
}

export interface ProductReview {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewsResponse {
  reviews: ProductReview[];
  total: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface CreateReviewRequest {
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface ProductVariant {
  _id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  attributes: Record<string, string>; // e.g., { color: 'red', size: 'M' }
  stock: number;
  images: ProductImage[];
  isActive: boolean;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
}

export interface ProductTag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  productCount: number;
}

export interface ProductSearchSuggestion {
  type: 'product' | 'category' | 'tag';
  id: string;
  name: string;
  image?: string;
  category?: string;
  price?: number;
}

export interface ProductComparisonItem {
  product: Product;
  selectedSize?: string;
  quantity: number;
}

export interface ProductAvailabilityCheck {
  productId: string;
  size: string;
  quantity: number;
  available: boolean;
  maxAvailable: number;
  estimatedRestockDate?: string;
}

export interface ProductPriceHistory {
  _id: string;
  productId: string;
  price: number;
  originalPrice?: number;
  date: string;
  reason?: string;
}

export interface ProductInventoryUpdate {
  productId: string;
  sizes: Array<{
    size: string;
    stock: number;
    operation: 'set' | 'add' | 'subtract';
  }>;
}

export interface ProductBulkOperation {
  productIds: string[];
  operation: 'activate' | 'deactivate' | 'delete' | 'feature' | 'unfeature';
  data?: Record<string, any>;
}

export interface ProductAnalytics {
  productId: string;
  views: number;
  uniqueViews: number;
  addToCart: number;
  purchases: number;
  conversionRate: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topReferrers: Array<{
    source: string;
    visits: number;
  }>;
  searchKeywords: Array<{
    keyword: string;
    count: number;
  }>;
}

export default Product;