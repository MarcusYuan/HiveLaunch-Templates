"use client";

import { useState } from "react";
import { usePayment } from "@/hooks/usePayment";
import { useCart } from "@/hooks/useCart";
import { PaymentForm } from "@/components/checkout/PaymentForm";

export function CheckoutForm() {
  const { createPaymentIntent, loading } = usePayment();
  const { total } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleInitializePayment = async () => {
    const secret = await createPaymentIntent(total);
    setClientSecret(secret);
  };

  if (!clientSecret) {
    return (
      <div>
        <p>Total: ¥{total}</p>
        <button onClick={handleInitializePayment} disabled={loading}>
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    );
  }

  return <PaymentForm clientSecret={clientSecret} />;
}
