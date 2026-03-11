"use client";

import { useCart } from "@/hooks/useCart";

export function CartSummary() {
  const { total } = useCart();

  return (
    <div>
      <h2>Summary</h2>
      <p>Total: ¥{total}</p>
    </div>
  );
}
