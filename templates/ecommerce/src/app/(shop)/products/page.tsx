import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: Array<{ id?: string; title?: string }> = [];
  
  try {
    const { getProducts } = await import("@/lib/medusa");
    products = await getProducts();
  } catch {
    products = [];
  }

  return (
    <main>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products available. Please configure Medusa backend.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="product-card">
                <h2>{product.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
