import Medusa from "@medusajs/medusa-js";
import { create } from "zustand";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const useMedusaStore = create<{ client: Medusa | null }>(() => ({
  client: null,
}));

export function getMedusaClient() {
  const { client } = useMedusaStore.getState();
  if (!client) {
    const newClient = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });
    useMedusaStore.setState({ client: newClient });
    return newClient;
  }
  return client;
}

export async function getProducts(params?: { limit?: number; offset?: number }) {
  const medusa = getMedusaClient();
  const { products } = await medusa.products.list({
    limit: params?.limit || 20,
    offset: params?.offset || 0,
  });
  return products;
}

export async function getProduct(productId: string) {
  const medusa = getMedusaClient();
  const { product } = await medusa.products.retrieve(productId);
  return product;
}
