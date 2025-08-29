export interface User {
  _id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'customer' | 'admin' | 'super_admin';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Address {
  _id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  smsUpdates: boolean;
  emailUpdates: boolean;
  currency: 'INR' | 'USD';
  language: 'en' | 'hi';
  theme: 'light' | 'dark' | 'system';
}

export interface UserProfile {
  name?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  avatar?: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCategory: string;
  memberSince: string;
  loyaltyPoints: number;
  wishlistCount: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  acceptTerms: boolean;
  newsletter?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

export interface AddAddressRequest {
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<AddAddressRequest> {
  _id: string;
}

export interface UserActivity {
  _id: string;
  type: 'login' | 'order' | 'profile_update' | 'password_change' | 'address_add';
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  products: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: Array<{
      url: string;
      alt: string;
      isPrimary: boolean;
    }>;
    category: string;
    isActive: boolean;
    totalStock: number;
  };
}

export default User;