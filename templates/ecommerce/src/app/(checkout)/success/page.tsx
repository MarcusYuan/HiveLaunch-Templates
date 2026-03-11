import Link from "next/link";

export default function SuccessPage() {
  return (
    <main>
      <h1>Payment Successful!</h1>
      <p>Thank you for your order.</p>
      <Link href="/">Continue Shopping</Link>
    </main>
  );
}
