import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create one-time price products in your Stripe dashboard and set these env vars:
// STRIPE_PRICE_BOOST_3  → price ID for 3-boost pack
// STRIPE_PRICE_BOOST_10 → price ID for 10-boost pack
const PACK_MAP = {
  boost3:  { priceId: process.env.STRIPE_PRICE_BOOST_3,  credits: 3  },
  boost10: { priceId: process.env.STRIPE_PRICE_BOOST_10, credits: 10 },
};

export async function POST(request) {
  const authHeader = request.headers.get("authorization") || "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  if (!jwt) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { data: { user }, error } = await supabase.auth.getUser(jwt);
  if (error || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { packId } = await request.json().catch(() => ({}));
  const pack = PACK_MAP[packId];

  if (!pack?.priceId) {
    return Response.json({ error: "Pack no configurado — añade STRIPE_PRICE_BOOST_3 y STRIPE_PRICE_BOOST_10 en Vercel" }, { status: 400 });
  }

  const appUrl = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://truekly-match.vercel.app";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ price: pack.priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { userId: user.id, boostCredits: String(pack.credits) },
    success_url: `${appUrl}/?boosts=success&n=${pack.credits}`,
    cancel_url: `${appUrl}/`,
  });

  return Response.json({ url: session.url });
}
