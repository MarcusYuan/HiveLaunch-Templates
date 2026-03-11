"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts as fetchProducts } from "@/lib/medusa";

export function useProducts(limit = 20) {
  return useQuery({
    queryKey: ["products", limit],
    queryFn: async () => {
      return fetchProducts({ limit });
    },
    staleTime: 60 * 1000,
  });
}
