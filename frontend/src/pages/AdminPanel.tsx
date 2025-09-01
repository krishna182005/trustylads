import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Search,
  Download,
  LogOut,
  Lock,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { apiClient } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import ProductForm from '../components/ProductForm'; // Added import for ProductForm
import ReviewManagement from '../components/admin/ReviewManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import OrderEditModal from '../components/admin/OrderEditModal';
import AdminPasswordChange from '../components/admin/AdminPasswordChange';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: any[];
  topProducts: any[];
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { logout, token: userToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrderEditModal, setShowOrderEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  // const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  // const [selectedReview, setSelectedReview] = useState<any>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Let API 401 handling drive redirects; don't pre-gate by local state

  // Ensure admin token is present: proactively refresh using stored refresh token if needed
  // Remove adminReady gating; let server 401 handling drive redirects
  React.useEffect(() => {
    (async () => {
      // If admin tokens are missing but user token exists (from recent login), promote it to admin token
      const existingAdmin = localStorage.getItem('adminToken') || localStorage.getItem('trustylads-admin-token');
      if (!existingAdmin && userToken) {
        localStorage.setItem('adminToken', userToken);
        localStorage.setItem('trustylads-admin-token', userToken);
      }
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('trustylads-admin-token');
      const refreshToken = localStorage.getItem('trustylads-refresh-token');
      if (adminToken) {
        return;
      }
      if (refreshToken) {
        try {
          const r: any = await apiClient.post('/api/admin/refresh', { refreshToken });
          if (r?.token) {
            localStorage.setItem('adminToken', r.token);
            localStorage.setItem('trustylads-admin-token', r.token);
            return;
          }
        } catch {
          // fall through
        }
      }
    })();
  }, [userToken]);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiClient.get<DashboardStats>('/api/admin/stats');
      return response;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await apiClient.get<any>('/api/admin/orders');
      return response || [];
    },
    refetchInterval: 30000,
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await apiClient.get<any>('/api/admin/products');
      return response || [];
    },
    refetchInterval: 30000,
  });

  // Reviews feature disabled

  // Avoid leaking console logs in production

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('trustylads-admin-token');
    localStorage.removeItem('trustylads-refresh-token');
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiClient.put(`/api/admin/orders/${orderId}`, { orderStatus: status });
      toast.success('Order status updated');
      // Refetch orders
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // const handleApproveReview = async (...) => {}

  // const handleCreateMockReview = async (reviewData: any) => {
  //   try {
  //     await apiClient.post('/api/reviews/admin/mock', reviewData);
  //     toast.success('Mock review created successfully');
  //     setShowAddReviewForm(false);
  //     queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
  //   } catch (error) {
  //     toast.error('Failed to create mock review');
  //   }
  // };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setShowOrderEditModal(true);
  };

  const handleGenerateTrackingId = async (orderId: string) => {
    // Generate a random tracking ID
    const trackingId = `TLX${Math.random().toString(36).substring(2, 8).toUpperCase()}${Date.now().toString().slice(-6)}`;
    
    try {
      await apiClient.put(`/api/orders/${orderId}/tracking`, { trackingId });
      toast.success('Tracking ID generated successfully');
      // Refetch orders
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch {
      toast.error('Failed to generate tracking ID');
    }
  };

  const handleUpdateTrackingId = async (orderId: string, currentTrackingId: string) => {
    const newTrackingId = prompt('Enter new tracking ID:', currentTrackingId);
    if (!newTrackingId || newTrackingId === currentTrackingId) return;

    try {
      await apiClient.put(`/api/orders/${orderId}/tracking`, { trackingId: newTrackingId });
      toast.success('Tracking ID updated successfully');
      // Refetch orders
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch {
      toast.error('Failed to update tracking ID');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/api/admin/products/${productId}`);
        toast.success('Product deleted successfully');
        
        // Invalidate and refetch relevant queries
        await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        await queryClient.invalidateQueries({ queryKey: ['home-products'] });
        await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        
        toast.success('Product deleted successfully! Changes will be reflected on the home page.');
      } catch {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleCreateProduct = async (productData: any) => {
    try {
      console.log('AdminPanel: Creating product with data:', productData);
      const response = await apiClient.post('/api/admin/products', productData);
      console.log('AdminPanel: Product creation response:', response);
      toast.success('Product created successfully');
      setShowAddProductForm(false);
      
      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      await queryClient.invalidateQueries({ queryKey: ['home-products'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      
      toast.success('Product added successfully! Home page will now show the new product.');
    } catch (error: any) {
      console.error('AdminPanel: Product creation error:', error);
      toast.error(error.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (productId: string, productData: any) => {
    try {
      await apiClient.put(`/api/admin/products/${productId}`, productData);
      toast.success('Product updated successfully');
      setEditingProduct(null);
      
      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      await queryClient.invalidateQueries({ queryKey: ['home-products'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      
      toast.success('Product updated successfully! Changes will be reflected on the home page.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'categories', label: 'Categories', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Do not gate admin panel by regular user auth; admin token is sufficient

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.svg" 
                alt="TrustyLads Logo" 
                className='w-8 h-8 object-contain' 
              />
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPasswordChange(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
                         {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => handleTabChange(tab.id)}
                 className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                   activeTab === tab.id
                     ? 'border-yellow-400 text-yellow-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 <tab.icon className="h-4 w-4" />
                 <span>{tab.label}</span>
               </button>
             ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {statsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹{(stats?.totalRevenue ?? 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Package className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Orders */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                      {stats?.recentOrders?.slice(0, 5).map((order: any) => (
                        <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <p className="font-medium">{order.orderId}</p>
                            <p className="text-sm text-gray-600">{order.customer.name || order.customer.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{(order?.total ?? 0).toLocaleString()}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                    <div className="space-y-4">
                      {stats?.topProducts?.slice(0, 5).map((product: any) => (
                        <div key={product._id} className="flex items-center space-x-3">
                          <img
                            src={product.images && product.images.length > 0 ? product.images[0].url : '/api/placeholder/40/50'}
                            alt={product.name}
                            className="w-10 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-600">{product.totalQuantity ?? product.salesCount ?? 0} sold</p>
                          </div>
                          <p className="font-semibold">₹{(product.totalRevenue ?? product.price ?? 0).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button className="flex items-center space-x-2 bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tracking ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders?.map((order: any) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div>
                              <p className="font-medium">{order.orderId}</p>
                              <p className="text-xs text-gray-500">#{order.orderId.slice(-5)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.trackingId ? (
                              <div className="flex items-center">
                                <a
                                  href={`/track?trackingId=${encodeURIComponent(order.trackingId)}&t=1`}
                                  className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mr-2 underline"
                                  title="Open tracking details"
                                >
                                  {order.trackingId}
                                </a>
                                <button 
                                  onClick={() => navigator.clipboard.writeText(order.trackingId)}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                  title="Copy Tracking ID"
                                >
                                  Copy
                                </button>
                                <button 
                                  onClick={() => handleGenerateTrackingId(order._id)}
                                  className="text-xs text-yellow-600 hover:text-yellow-800 ml-2"
                                  title="Generate New Tracking ID"
                                >
                                  Generate
                                </button>
                                <button 
                                  onClick={() => handleUpdateTrackingId(order._id, order.trackingId)}
                                  className="text-xs text-purple-600 hover:text-purple-800 ml-2"
                                  title="Edit Tracking ID"
                                >
                                  Edit
                                </button>
                              </div>
                            ) : (
                              <div>
                                <span className="text-gray-400 text-xs">Not generated</span>
                                <button 
                                  onClick={() => handleGenerateTrackingId(order._id)}
                                  className="block text-xs text-yellow-600 hover:text-yellow-800 mt-1"
                                  title="Generate Tracking ID"
                                >
                                  Generate
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{order.customer.name || 'N/A'}</p>
                              <p className="text-sm text-gray-500">{order.customer.email}</p>
                              <p className="text-xs text-gray-400">{order.customer.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <p className="font-medium">{order.items?.length || 0} items</p>
                              <p className="text-xs text-gray-500">
                                {order.items?.map((item: any) => `${item.name} (${item.size})`).join(', ')}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <p className="font-medium">₹{order.total.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-full border-0 ${
                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                              order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <p>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</p>
                              <p className="text-xs">{order?.createdAt ? new Date(order.createdAt).toLocaleTimeString() : '-'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleViewOrder(order)}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleEditOrder(order)}
                                className="text-yellow-600 hover:text-yellow-800"
                                title="Edit Order"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Product Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
                <button 
                  onClick={() => setShowAddProductForm(true)}
                  className="flex items-center space-x-2 bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product: any) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0].url : '/api/placeholder/300/400'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                                             <p className="text-sm text-gray-600 mb-2 capitalize">
                         {product.category && typeof product.category === 'object' && product.category.name 
                           ? product.category.name 
                           : product.category || 'Uncategorized'}
                       </p>
                          <p className="font-bold text-gray-900 mb-3">₹{(product?.price ?? 0).toLocaleString()}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.totalStock > 10 ? 'bg-green-100 text-green-800' :
                          product.totalStock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.totalStock} in stock
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ReviewManagement />
          </motion.div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CategoryManagement />
          </motion.div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Management</h3>
            <p className="text-gray-600">Customer management features coming soon!</p>
          </motion.div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductForm && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setShowAddProductForm(false)}
          mode="create"
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={(data) => handleUpdateProduct(editingProduct._id, data)}
          onCancel={() => setEditingProduct(null)}
          mode="edit"
        />
      )}

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking ID:</span>
                      <span className="font-medium font-mono">
                        {selectedOrder.trackingId || 'Not generated'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedOrder.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        selectedOrder.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        selectedOrder.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedOrder.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedOrder.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">
                        {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.customer.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedOrder.customer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedOrder.customer.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">
                    {selectedOrder.shipping.firstName} {selectedOrder.shipping.lastName}
                  </p>
                  <p className="text-gray-600">{selectedOrder.shipping.address}</p>
                  {selectedOrder.shipping.apartment && (
                    <p className="text-gray-600">{selectedOrder.shipping.apartment}</p>
                  )}
                  <p className="text-gray-600">
                    {selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.pinCode}
                  </p>
                  <p className="text-gray-600">{selectedOrder.shipping.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                      <img
                        src={item.image || '/api/placeholder/60/60'}
                        alt={item.name}
                        className="w-15 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{(item?.price ?? 0).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total: ₹{(((item?.price ?? 0) * (item?.quantity ?? 0)) || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{(selectedOrder?.subtotal ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">₹{(selectedOrder?.shippingCost ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium text-green-600">Includes all taxes ✓</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-semibold text-gray-900">₹{(selectedOrder?.total ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Edit Modal */}
      {showOrderEditModal && editingOrder && (
        <OrderEditModal
          isOpen={showOrderEditModal}
          onClose={() => {
            setShowOrderEditModal(false);
            setEditingOrder(null);
          }}
          order={editingOrder}
        />
      )}

      {/* Password Change Modal */}
      {showPasswordChange && (
        <AdminPasswordChange
          onClose={() => setShowPasswordChange(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;