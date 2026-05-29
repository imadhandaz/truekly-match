import { NextResponse } from "next/server";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe";

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe no configurado" }, { status: 503 });
  }

  try {
    const { planId, userId, userEmail } = await request.json();
    const priceId = STRIPE_PRICES[planId];

    if (!priceId) {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/?gold=success`,
      cancel_url: `${appUrl}/`,
      metadata: { userId: userId || "", planId },
      ...(userEmail ? { customer_email: userEmail } : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
