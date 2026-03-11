import { CartItems } from "@/components/cart/CartItems";
import { CartSummary } from "@/components/cart/CartSummary";
import Link from "next/link";

export default function CartPage() {
  return (
    <main>
      <h1>Shopping Cart</h1>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <CartItems />
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
      <Link href="/checkout">Proceed to Checkout</Link>
    </main>
  );
}
