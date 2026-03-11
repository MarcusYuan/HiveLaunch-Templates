"use client";

import { useCartStore } from "@/stores/cartStore";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.total);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total: total(),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}
