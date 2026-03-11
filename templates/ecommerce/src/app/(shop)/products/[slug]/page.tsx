import Link from "next/link";
import { AddToCartButton } from "@/components/products/AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `Product ${slug}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  let product = null;
  
  try {
    const { getProduct } = await import("@/lib/medusa");
    product = await getProduct(slug);
  } catch {
    product = null;
  }

  if (!product) {
    return (
      <main>
        <h1>Product not found</h1>
        <p>The product you're looking for doesn't exist or the backend is not available.</p>
        <Link href="/products">Back to Products</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <AddToCartButton product={product} />
    </main>
  );
}
