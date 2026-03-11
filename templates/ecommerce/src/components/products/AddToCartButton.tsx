"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface Props {
  product: unknown;
}

export function AddToCartButton({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const p = product as { id?: string; title?: string; variants?: Array<{ id?: string }> };

  const handleAddToCart = async () => {
    setLoading(true);
    const variantId = p.variants?.[0]?.id || "";
    
    addItem({
      id: p.id || "",
      variantId,
      title: p.title || "",
      price: 0,
      quantity: 1,
      image: "",
    });

    setLoading(false);
  };

  return (
    <button onClick={handleAddToCart} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
