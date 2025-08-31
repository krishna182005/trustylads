import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemsCount: () => number;
  getSubtotal: () => number;
  getCartItem: (productId: string, size: string) => CartItem | undefined;
  isInCart: (productId: string, size?: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem: CartItem) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          item => item.productId === newItem.productId && item.size === newItem.size
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...items];
          const existingItem = updatedItems[existingItemIndex];
          const newQuantity = existingItem.quantity + newItem.quantity;
          
          // Check stock limit
          if (newQuantity <= existingItem.maxStock) {
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity
            };
            set({ items: updatedItems });
          }
        } else {
          // Add new item
          set({ items: [...items, newItem] });
        }
      },

      updateQuantity: (productId: string, size: string, quantity: number) => {
        const { items } = get();
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          set({
            items: items.filter(
              item => !(item.productId === productId && item.size === size)
            )
          });
        } else {
          // Update quantity
          const updatedItems = items.map(item => {
            if (item.productId === productId && item.size === size) {
              return {
                ...item,
                quantity: Math.min(quantity, item.maxStock)
              };
            }
            return item;
          });
          set({ items: updatedItems });
        }
      },

      removeItem: (productId: string, size: string) => {
        const { items } = get();
        set({
          items: items.filter(
            item => !(item.productId === productId && item.size === size)
          )
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getItemsCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartItem: (productId: string, size: string) => {
        const { items } = get();
        return items.find(item => item.productId === productId && item.size === size);
      },

      isInCart: (productId: string, size?: string) => {
        const { items } = get();
        if (size) {
          return items.some(item => item.productId === productId && item.size === size);
        }
        return items.some(item => item.productId === productId);
      },
    }),
    {
      name: 'trustylads-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;