import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeApiKey 
  ? new Stripe(stripeApiKey, { apiVersion: "2025-02-24.acacia" })
  : null;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch {
    return NextResponse.json({ error: "Webhook验签失败" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      break;
    }
    case "payment_intent.payment_failed": {
      break;
    }
  }

  return NextResponse.json({ received: true });
}
