"use client";

import { useCart } from "@/hooks/useCart";

export function CartItems() {
  const { items, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <h3>{item.title}</h3>
          <p>¥{item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
            min={1}
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
