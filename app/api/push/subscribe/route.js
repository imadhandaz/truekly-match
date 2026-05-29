import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId, subscription } = await request.json();
    if (!userId || !subscription?.endpoint) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("push_subscriptions")
      .upsert(
        { user_id: userId, endpoint: subscription.endpoint, subscription },
        { onConflict: "endpoint" }
      );

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
