import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (product) => set((state) => {
    const existing = state.items.find((item) => item.id === product.id);
    if (existing) {
      return {
        items: state.items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    ),
  })),
  clearCart: () => set({ items: [] }),
  getCartTotal: (paymentMethod = 'transfer') => {
    const count = get().getCartCount();
    if (count === 0) return 0;

    if (paymentMethod === 'transfer') {
      if (count >= 6) return count * 147;
      if (count >= 2) return count * 150;
      return count * 170;
    } else {
      if (count >= 6) return count * 165;
      if (count >= 2) return count * 170;
      return count * 190;
    }
  },
  getCartCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}));
