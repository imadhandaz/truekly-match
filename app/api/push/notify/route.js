import { NextResponse } from "next/server";
import webpush from "web-push";
import { getSupabaseAdmin } from "@/lib/supabase";

// Configurar VAPID solo si las claves están disponibles
if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hola@truekly.app",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(request) {
  if (!process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ ok: true, skipped: "No VAPID keys" });
  }

  try {
    const { userId, title, body, url } = await request.json();
    if (!userId) return NextResponse.json({ error: "Falta userId" }, { status: 400 });

    const { data: subs } = await getSupabaseAdmin()
      .from("push_subscriptions")
      .select("subscription, endpoint")
      .eq("user_id", userId);

    if (!subs?.length) return NextResponse.json({ ok: true, sent: 0 });

    const payload = JSON.stringify({ title, body, url: url || "/" });

    const results = await Promise.allSettled(
      subs.map((row) => webpush.sendNotification(row.subscription, payload))
    );

    // Elimina suscripciones expiradas (410 Gone)
    const expired = results
      .map((r, i) => ({ r, sub: subs[i] }))
      .filter(({ r }) => r.status === "rejected" && r.reason?.statusCode === 410)
      .map(({ sub }) => sub.endpoint);

    if (expired.length) {
      await getSupabaseAdmin()
        .from("push_subscriptions")
        .delete()
        .in("endpoint", expired);
    }

    return NextResponse.json({ ok: true, sent: subs.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
