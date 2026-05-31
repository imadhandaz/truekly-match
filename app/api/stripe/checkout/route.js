import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  month: process.env.STRIPE_PRICE_MONTHLY,
  halfyear: process.env.STRIPE_PRICE_HALFYEAR,
  year: process.env.STRIPE_PRICE_YEARLY,
};

export async function POST(request) {
  try {
    const { planId, userId, userEmail } = await request.json();

    const priceId = PRICE_MAP[planId];
    if (!priceId) {
      return Response.json({ error: "Plan no válido" }, { status: 400 });
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://truekly-match.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userEmail || undefined,
      metadata: { userId },
      success_url: `${appUrl}/?gold=success`,
      cancel_url: `${appUrl}/`,
      subscription_data: {
        trial_period_days: 3,
        metadata: { userId },
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
