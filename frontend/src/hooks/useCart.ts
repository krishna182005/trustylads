import { useCallback } from 'react';
import { useCartStore } from '../store/useCartStore';
import { CartItem } from '../types';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

/**
 * Custom hook for cart management with enhanced functionality
 * Provides cart operations with API synchronization and error handling
 */
export const useCart = () => {
  const {
    items,
    isOpen,
    addItem: addItemToStore,
    updateQuantity: updateQuantityInStore,
    removeItem: removeItemFromStore,
    clearCart: clearCartInStore,
    openCart,
    closeCart,
    getItemsCount,
    getSubtotal
  } = useCartStore();

  /**
   * Add item to cart with validation and API sync
   */
  const addItem = useCallback(async (item: CartItem) => {
    try {
      // Validate item
      if (!item.productId || !item.size || item.quantity <= 0) {
        toast.error('Invalid item data');
        return false;
      }

      // Check if item already exists
      const existingItem = items.find(
        cartItem => cartItem.productId === item.productId && cartItem.size === item.size
      );

      const newQuantity = existingItem ? existingItem.quantity + item.quantity : item.quantity;

      // Validate stock
      if (newQuantity > item.maxStock) {
        toast.error(`Only ${item.maxStock} items available in stock`);
        return false;
      }

      // Add to local store
      addItemToStore(item);

      // Sync with API (optional - for logged-in users)
      try {
        await apiClient.post('/api/cart/add', {
          productId: item.productId,
          size: item.size,
          quantity: item.quantity
        });
      } catch (error) {
        console.warn('Failed to sync cart with server:', error);
        // Continue with local storage - don't show error to user
      }

      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
      return false;
    }
  }, [items, addItemToStore]);

  /**
   * Update item quantity with validation
   */
  const updateQuantity = useCallback(async (productId: string, size: string, quantity: number) => {
    try {
      if (quantity < 0) {
        toast.error('Quantity cannot be negative');
        return false;
      }

      const item = items.find(cartItem => cartItem.productId === productId && cartItem.size === size);
      
      if (!item) {
        toast.error('Item not found in cart');
        return false;
      }

      if (quantity > item.maxStock) {
        toast.error(`Only ${item.maxStock} items available in stock`);
        return false;
      }

      // Update in local store
      updateQuantityInStore(productId, size, quantity);

      // Sync with API
      try {
        if (quantity === 0) {
          await apiClient.delete(`/api/cart/remove/${productId}/${size}`);
        } else {
          await apiClient.put('/api/cart/update', {
            productId,
            size,
            quantity
          });
        }
      } catch (error) {
        console.warn('Failed to sync cart with server:', error);
      }

      return true;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error('Failed to update quantity');
      return false;
    }
  }, [items, updateQuantityInStore]);

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(async (productId: string, size: string) => {
    try {
      // Remove from local store
      removeItemFromStore(productId, size);

      // Sync with API
      try {
        await apiClient.delete(`/api/cart/remove/${productId}/${size}`);
      } catch (error) {
        console.warn('Failed to sync cart with server:', error);
      }

      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item');
      return false;
    }
  }, [removeItemFromStore]);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(async () => {
    try {
      // Clear local store
      clearCartInStore();

      // Sync with API
      try {
        await apiClient.delete('/api/cart/clear');
      } catch (error) {
        console.warn('Failed to sync cart with server:', error);
      }

      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    }
  }, [clearCartInStore]);

  /**
   * Get cart summary
   */
  const getCartSummary = useCallback(() => {
    const subtotal = getSubtotal();
    const itemsCount = getItemsCount();
    const shipping = subtotal >= 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemsCount,
      freeShippingThreshold: 999,
      freeShippingRemaining: Math.max(0, 999 - subtotal)
    };
  }, [getSubtotal, getItemsCount]);

  /**
   * Check if product is in cart
   */
  const isInCart = useCallback((productId: string, size?: string) => {
    if (size) {
      return items.some(item => item.productId === productId && item.size === size);
    }
    return items.some(item => item.productId === productId);
  }, [items]);

  /**
   * Get item from cart
   */
  const getCartItem = useCallback((productId: string, size: string) => {
    return items.find(item => item.productId === productId && item.size === size);
  }, [items]);

  /**
   * Validate cart before checkout
   */
  const validateCart = useCallback(async () => {
    try {
      if (items.length === 0) {
        toast.error('Your cart is empty');
        return false;
      }

      // Validate each item's stock
      const validationPromises = items.map(async (item) => {
        try {
          const response = await apiClient.get<any>(`/api/products/${item.productId}`);
          const product = response as any;
          const sizeData = product.sizes.find((s: any) => s.size === item.size);
          
          if (!sizeData || sizeData.stock < item.quantity) {
            return {
              valid: false,
              item,
              availableStock: sizeData?.stock || 0
            };
          }
          
          return { valid: true, item };
        } catch (error) {
          return { valid: false, item, error: 'Product not found' };
        }
      });

      const validationResults = await Promise.all(validationPromises);
      const invalidItems = validationResults.filter(result => !result.valid);

      if (invalidItems.length > 0) {
        invalidItems.forEach(({ item, availableStock, error }) => {
          if (error) {
            toast.error(`${item.name} is no longer available`);
            removeItem(item.productId, item.size);
          } else {
            toast.error(`${item.name} (${item.size}) - Only ${availableStock} available`);
            if (availableStock > 0) {
              updateQuantity(item.productId, item.size, availableStock);
            } else {
              removeItem(item.productId, item.size);
            }
          }
        });
        return false;
      }

      return true;
    } catch {
      console.error('Error validating cart');
      toast.error('Failed to validate cart');
      return false;
    }
  }, [items, removeItem, updateQuantity]);

  /**
   * Sync cart with server (for logged-in users)
   */
  const syncCart = useCallback(async () => {
    try {
      const response = await apiClient.get<any>('/api/cart');
      const serverCart = (response as any).items || [];
      
      // Merge server cart with local cart
      // This is a simplified merge - in production, you might want more sophisticated logic
      if (serverCart.length > 0) {
        // Clear local cart and add server items
        clearCartInStore();
        serverCart.forEach((item: CartItem) => {
          addItemToStore(item);
        });
      }
    } catch {
      console.warn('Failed to sync cart with server');
    }
  }, [clearCartInStore, addItemToStore]);

  return {
    // State
    items,
    isOpen,
    
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    
    // Computed values
    getCartSummary,
    getItemsCount,
    getSubtotal,
    
    // Utilities
    isInCart,
    getCartItem,
    validateCart,
    syncCart
  };
};

export default useCart;