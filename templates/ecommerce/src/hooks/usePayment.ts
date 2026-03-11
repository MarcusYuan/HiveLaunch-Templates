"use client";

import { useState } from "react";

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPaymentIntent(amount: number, currency = "cny") {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }),
      });

      const data = await response.json();
      return data.clientSecret;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createPaymentIntent, loading, error };
}
