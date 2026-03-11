import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Our Store</h1>
      <nav>
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/checkout">Checkout</Link>
      </nav>
    </main>
  );
}
