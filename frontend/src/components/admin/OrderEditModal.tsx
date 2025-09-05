import React, { useState, useEffect } from 'react';
import { X, Save, Package, Truck, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import toast from 'react-hot-toast';

interface OrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const OrderEditModal: React.FC<OrderEditModalProps> = ({ isOpen, onClose, order }) => {
  const [formData, setFormData] = useState({
    orderStatus: '',
    trackingId: '',
    courier: '',
    expectedDelivery: '',
    internalNotes: ''
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (order) {
      setFormData({
        orderStatus: order.orderStatus || '',
        trackingId: order.trackingId || '',
        courier: order.courier || '',
        expectedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : '',
        internalNotes: order.internalNotes || ''
      });
    }
  }, [order]);

  const updateOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.patch(`/api/orders/${order.orderId}/status`, data);
      return response;
    },
    onSuccess: () => {
      toast.success('Order updated successfully and email notification sent');
      queryClient.invalidateQueries({ queryKey: ['orders', 'admin'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = {};
    if (formData.orderStatus) updateData.orderStatus = formData.orderStatus;
    if (formData.trackingId) updateData.trackingId = formData.trackingId;
    if (formData.courier) updateData.courier = formData.courier;
    if (formData.expectedDelivery) updateData.expectedDelivery = formData.expectedDelivery;
    if (formData.internalNotes) updateData.notes = formData.internalNotes;

    updateOrderMutation.mutate(updateData);
  };

  const handleClose = () => {
    if (!updateOrderMutation.isPending) {
      onClose();
    }
  };

  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Order #{order.orderId}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={updateOrderMutation.isPending}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <select
                value={formData.orderStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, orderStatus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Tracking ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking ID
              </label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.trackingId}
                  onChange={(e) => setFormData(prev => ({ ...prev, trackingId: e.target.value }))}
                  placeholder="Enter tracking ID"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
            </div>

            {/* Courier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courier (Optional)
              </label>
              <input
                type="text"
                value={formData.courier}
                onChange={(e) => setFormData(prev => ({ ...prev, courier: e.target.value }))}
                placeholder="Enter courier name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            {/* Expected Delivery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Delivery Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internal Notes (Admin Only)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
                  placeholder="Add internal notes..."
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={updateOrderMutation.isPending}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateOrderMutation.isPending}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{updateOrderMutation.isPending ? 'Updating...' : 'Update Order'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderEditModal;
