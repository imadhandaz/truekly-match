import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  month: process.env.STRIPE_PRICE_MONTHLY,
  halfyear: process.env.STRIPE_PRICE_HALFYEAR,
  year: process.env.STRIPE_PRICE_YEARLY,
};

export async function POST(request) {
  // Verify caller via Supabase JWT — never trust userId from the request body
  const authHeader = request.headers.get("authorization") || "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");

  if (!jwt) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const planId = body.planId || body.plan || "year";
    const priceId = PRICE_MAP[planId];

    if (!priceId) {
      return Response.json({ error: "Plan no válido" }, { status: 400 });
    }

    const appUrl =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://truekly-match.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { userId: user.id },
      success_url: `${appUrl}/?gold=success`,
      cancel_url: `${appUrl}/`,
      subscription_data: {
        trial_period_days: 3,
        metadata: { userId: user.id },
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
