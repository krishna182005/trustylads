export interface Order {
  _id: string;
  orderId: string;
  userId?: string; // Optional for guest checkout
  customer: Customer;
  items: OrderItem[];
  shipping: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  trackingId?: string;
  courier?: string;
  statusHistory: StatusHistory[];
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
}

export interface Customer {
  name?: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cod' | 'bank_transfer';

export interface OrderCreateRequest {
  customer: Customer;
  items: Omit<OrderItem, 'productId'>[];
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes?: string;
}

export interface OrderUpdateRequest {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingId?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface OrderFilters {
  orderId?: string;
  customerEmail?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'total-asc' | 'total-desc';
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  limit: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  ordersByPaymentMethod: Record<PaymentMethod, number>;
  recentOrders: Order[];
  topProducts: Array<{
    productId: string;
    name: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

export interface OrderTracking {
  orderId: string;
  trackingId?: string;
  carrier?: string;
  trackingUrl?: string;
  currentStatus: OrderStatus;
  statusHistory: StatusHistory[];
  estimatedDelivery?: string;
  actualDelivery?: string;
  shippingAddress: ShippingAddress;
  trackingEvents: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location?: string;
  description: string;
  isDelivered?: boolean;
  isException?: boolean;
}

export interface OrderInvoice {
  orderId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customer: Customer;
  billing: ShippingAddress;
  shipping: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface OrderRefund {
  _id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  refundMethod: 'original' | 'bank_transfer' | 'wallet';
  razorpayRefundId?: string;
  processedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRefundRequest {
  orderId: string;
  amount: number;
  reason: string;
  refundMethod?: 'original' | 'bank_transfer' | 'wallet';
  notes?: string;
}

export interface OrderReturn {
  _id: string;
  orderId: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    reason: string;
    condition: 'new' | 'used' | 'damaged';
  }>;
  reason: string;
  status: 'requested' | 'approved' | 'rejected' | 'received' | 'processed';
  returnMethod: 'pickup' | 'drop_off' | 'mail';
  trackingId?: string;
  refundAmount: number;
  restockingFee?: number;
  images?: string[];
  notes?: string;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
}

export interface CreateReturnRequest {
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
    reason: string;
    condition: 'new' | 'used' | 'damaged';
  }>;
  reason: string;
  returnMethod: 'pickup' | 'drop_off' | 'mail';
  images?: string[];
  notes?: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  repeatCustomerRate: number;
  ordersByStatus: Record<OrderStatus, number>;
  ordersByPaymentMethod: Record<PaymentMethod, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    email: string;
    orders: number;
    totalSpent: number;
  }>;
  geographicDistribution: Array<{
    state: string;
    orders: number;
    revenue: number;
  }>;
}

export default Order;