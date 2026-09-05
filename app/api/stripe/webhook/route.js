import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const boostCredits = parseInt(session.metadata?.boostCredits || "0");
      if (userId) {
        if (session.mode === "subscription") {
          await supabase.from("profiles").update({ gold: true, boost_credits: 3 }).eq("id", userId);
        } else if (boostCredits > 0) {
          const { data: prof } = await supabase.from("profiles").select("boost_credits").eq("id", userId).maybeSingle();
          const current = prof?.boost_credits || 0;
          await supabase.from("profiles").update({ boost_credits: current + boostCredits }).eq("id", userId);
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await supabase
          .from("profiles")
          .update({ gold: false })
          .eq("id", userId);
      }
      break;
    }
  }

  return Response.json({ received: true });
}
