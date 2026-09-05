import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// No Stripe product setup needed — prices are defined inline
const PACK_MAP = {
  boost3:  { credits: 3,  amount: 99,  name: "3 Boosts · Truekly Match"  },
  boost10: { credits: 10, amount: 299, name: "10 Boosts · Truekly Match" },
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
  if (!pack) return Response.json({ error: "Pack no válido" }, { status: 400 });

  const appUrl =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://truekly-match.vercel.app";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: pack.amount,
        product_data: { name: pack.name },
      },
    }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { userId: user.id, boostCredits: String(pack.credits) },
    success_url: `${appUrl}/?boosts=success&n=${pack.credits}`,
    cancel_url: `${appUrl}/`,
  });

  return Response.json({ url: session.url });
}
