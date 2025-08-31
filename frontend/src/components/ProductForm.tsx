import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel, mode }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    featured: false,
    totalStock: '',
    sizes: [{ size: '', stock: '' }],
    images: [{ url: '', alt: '', isPrimary: false }],
    specifications: [{ key: '', value: '' }],
    fakeReviews: [] as Array<{ userName: string; rating: number; title: string; comment: string; }>
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response: any = await apiClient.get('/api/categories');
      // response can be either an array or {data: array}; normalize to array
      return Array.isArray(response) ? response : (response?.data || response || []);
    }
  });

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category && typeof product.category === 'object' && product.category.name 
          ? product.category.name 
          : (product.category || ''),
        tags: product.tags?.join(', ') || '',
        featured: product.featured || false,
        totalStock: product.totalStock?.toString() || '',
        sizes: product.sizes?.length > 0 ? product.sizes.map((s: any) => ({ size: s.size, stock: s.stock.toString() })) : [{ size: '', stock: '' }],
        images: product.images?.length > 0 ? product.images.map((img: any) => ({ url: img.url, alt: img.alt || '', isPrimary: img.isPrimary })) : [{ url: '', alt: '', isPrimary: false }],
        specifications: product.specifications?.length > 0 ? product.specifications.map((spec: any) => ({ key: spec.key, value: spec.value })) : [{ key: '', value: '' }],
        fakeReviews: product.fakeReviews || []
      });
    }
  }, [product, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasSizes = formData.sizes.some(size => size.size && size.stock);
    
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      // Only include totalStock if no sizes are defined (for products without sizes like jewelry)
      ...(hasSizes ? {} : { totalStock: parseInt(formData.totalStock) }),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      sizes: formData.sizes.filter(size => size.size && size.stock).map(size => ({
        size: size.size,
        stock: parseInt(size.stock)
      })),
      images: formData.images.filter(img => img.url && img.alt).map((img, index) => ({
        url: img.url,
        alt: img.alt,
        isPrimary: index === 0 || img.isPrimary
      })),
      specifications: formData.specifications.filter(spec => spec.key && spec.value)
    };

    onSubmit(submitData);
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', stock: '' }]
    }));
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const updateSize = (index: number, field: 'size' | 'stock', value: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '', isPrimary: false }]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, field: 'url' | 'alt' | 'isPrimary', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Add New Product' : 'Edit Product'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                disabled={categoriesLoading}
              >
                <option value="">Select Category</option>
                {categoriesLoading ? (
                  <option value="" disabled>Loading categories...</option>
                ) : (
                  (Array.isArray(categories) ? categories : []).map((category: any) => {
                    const value = category?.name || category?.slug || '';
                    return (
                      <option key={category._id || value} value={value}>
                        {category?.name || value}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>
            {/* Only show totalStock for products without sizes (like jewelry) */}
            {formData.sizes.length === 1 && !formData.sizes[0].size && !formData.sizes[0].stock && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.totalStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalStock: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Product
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="streetwear, fashion, trendy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>

          {/* Sizes and Stock */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Sizes and Stock *
              </label>
              <div className="flex items-center space-x-4">
                {/* Show computed total stock for products with sizes */}
                {formData.sizes.some(size => size.size && size.stock) && (
                  <div className="text-sm text-gray-600">
                    Total Stock: <span className="font-semibold">
                      {formData.sizes
                        .filter(size => size.size && size.stock)
                        .reduce((total, size) => total + (parseInt(size.stock) || 0), 0)
                      }
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={addSize}
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  + Add Size
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Size (e.g., S, M, L, XL)"
                    value={size.size}
                    onChange={(e) => updateSize(index, 'size', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    min="0"
                    value={size.stock}
                    onChange={(e) => updateSize(index, 'stock', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  {formData.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Product Images *
              </label>
              <button
                type="button"
                onClick={addImage}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
              >
                + Add Image
              </button>
            </div>
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={image.url}
                    onChange={(e) => updateImage(index, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    placeholder="Image Alt Text"
                    value={image.alt}
                    onChange={(e) => updateImage(index, 'alt', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`primary-${index}`}
                      checked={image.isPrimary}
                      onChange={(e) => updateImage(index, 'isPrimary', e.target.checked)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`primary-${index}`} className="text-sm text-gray-600">
                      Primary
                    </label>
                  </div>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Specifications
              </label>
              <button
                type="button"
                onClick={addSpecification}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
              >
                + Add Specification
              </button>
            </div>
            <div className="space-y-3">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Key (e.g., Material, Brand)"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  {formData.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fake Reviews Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Add Fake Reviews (Optional)
              </label>
              <button
                type="button"
                onClick={() => {
                  const fakeReviews = [
                    {
                      userName: "John D.",
                      rating: 5,
                      title: "Excellent product!",
                      comment: "This is exactly what I was looking for. Great quality and fast delivery."
                    },
                    {
                      userName: "Sarah M.",
                      rating: 4,
                      title: "Very good quality",
                      comment: "Product meets my expectations. Would recommend to others."
                    },
                    {
                      userName: "Mike R.",
                      rating: 5,
                      title: "Amazing!",
                      comment: "Exceeded my expectations. The quality is outstanding."
                    }
                  ];
                  
                  // Add fake reviews to the product data
                  setFormData(prev => ({
                    ...prev,
                    fakeReviews: fakeReviews
                  }));
                  
                  toast.success('Added 3 fake reviews!');
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                + Add 3 Fake Reviews
              </button>
            </div>
            
            {formData.fakeReviews && formData.fakeReviews.length > 0 && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Fake Reviews Added:</h4>
                {formData.fakeReviews.map((review, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{review.userName}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <h5 className="font-medium text-gray-800 mb-1">{review.title}</h5>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, fakeReviews: [] }))}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove All Fake Reviews
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{mode === 'create' ? 'Create Product' : 'Update Product'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductForm;
