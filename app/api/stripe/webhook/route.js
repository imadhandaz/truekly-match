import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const stripe = getStripe();
  const sig = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook inválido: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (userId) {
      await supabaseAdmin
        .from("profiles")
        .update({ gold: true })
        .eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    // Buscar usuario por customer ID de Stripe
    const { data: subs } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", subscription.customer);

    if (subs?.length) {
      await supabaseAdmin
        .from("profiles")
        .update({ gold: false })
        .eq("stripe_customer_id", subscription.customer);
    }
  }

  return NextResponse.json({ received: true });
}
