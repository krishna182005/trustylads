// Re-export all types for easy importing
export * from './user';
export * from './product';
export * from './order';

// Category interface
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// Common utility types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  limit: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Cart item interface
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
  category: string;
  maxStock: number;
}

// Checkout data interface
export interface CheckoutData {
  customer: {
    email: string;
    phone: string;
    name?: string;
  };
  shipping: {
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  paymentMethod: 'razorpay' | 'cod' | 'bank_transfer';
}

// Razorpay interfaces
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Filter and search interfaces
export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'rating' | 'newest' | 'popular';
  featured?: boolean;
  inStock?: boolean;
}

export interface OrderFilters {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// Admin interfaces
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  lastLogin?: string;
  isActive: boolean;
}

export interface AdminAuthResponse {
  admin: AdminUser;
  token: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  ordersToday: number;
  revenueToday: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  recentOrders: any[];
  topProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
    totalRevenue: number;
  }>;
  ordersByStatus: Record<string, number>;
  salesByMonth: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
}

// Form validation interfaces
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// Theme and UI interfaces
export type Theme = 'light' | 'dark' | 'system';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Status enums
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  COD = 'cod',
  BANK_TRANSFER = 'bank_transfer'
}

// Constants
export const PRODUCT_CATEGORIES = ['clothing', 'watches', 'jewelry', 'home-decor', 'kitchen', 'accessories', 'electronics'] as const;
export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'] as const;
export const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' }
] as const;

export default {};