import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import toast from 'react-hot-toast';

interface Category {
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

interface CategoryFormData {
  name: string;
  description: string;
  image: string;
  sortOrder: number;
}

interface ApiError {
  message: string;
}

const CategoryManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image: '',
    sortOrder: 0
  });

  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await apiClient.get<any>('/api/categories/admin/all');
      // The API returns { success: true, data: categories }
      return (response as any).data || response || [];
    }
  });

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      return apiClient.post<{ message: string; data: Category }>('/api/categories/admin', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setShowAddForm(false);
      setFormData({ name: '', description: '', image: '', sortOrder: 0 });
      toast.success('Category created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create category');
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
      return apiClient.put<{ message: string; data: Category }>(`/api/categories/admin/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setEditingCategory(null);
      setFormData({ name: '', description: '', image: '', sortOrder: 0 });
      toast.success('Category updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update category');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete<{ message: string }>(`/api/categories/admin/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to delete category');
    }
  });

  const toggleCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.patch<{ message: string }>(`/api/categories/admin/${id}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category status updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update category status');
    }
  });

  const updateSortOrderMutation = useMutation({
    mutationFn: async ({ id, sortOrder }: { id: string; sortOrder: number }) => {
      return apiClient.patch<{ message: string }>(`/api/categories/admin/${id}/sort`, { sortOrder });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category sort order updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update sort order');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory._id, data: formData });
    } else {
      createCategoryMutation.mutate(formData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      sortOrder: category.sortOrder
    });
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setShowAddForm(false);
    setFormData({ name: '', description: '', image: '', sortOrder: 0 });
  };

  const handleDelete = (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      deleteCategoryMutation.mutate(category._id);
    }
  };

  const handleSortOrderChange = (category: Category, direction: 'up' | 'down') => {
    const newSortOrder = direction === 'up' ? category.sortOrder - 1 : category.sortOrder + 1;
    updateSortOrderMutation.mutate({ id: category._id, sortOrder: newSortOrder });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingCategory) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {createCategoryMutation.isPending || updateCategoryMutation.isPending
                    ? 'Saving...'
                    : editingCategory
                    ? 'Update Category'
                    : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Categories List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {categories?.map((category: Category) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {category.productCount} products
                      </span>
                      {category.isActive ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Slug: {category.slug}</span>
                      <span>Sort Order: {category.sortOrder}</span>
                      <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                    </div>
                    {category.image && (
                      <div className="mt-2">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `/api/placeholder/64/64`;
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleSortOrderChange(category, 'up')}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Move Up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSortOrderChange(category, 'down')}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Move Down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-yellow-600 hover:text-yellow-700 p-1"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleCategoryMutation.mutate(category._id)}
                      className={`p-1 ${
                        category.isActive
                          ? 'text-orange-600 hover:text-orange-700'
                          : 'text-green-600 hover:text-green-700'
                      }`}
                      title={category.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {category.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {(!categories || categories.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                No categories found. Create your first category to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
