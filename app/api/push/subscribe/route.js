import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { userId, subscription } = await request.json();
    if (!userId || !subscription?.endpoint) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
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
