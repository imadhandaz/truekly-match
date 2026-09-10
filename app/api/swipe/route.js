import { createClient } from "@supabase/supabase-js";

const FREE_DAILY_LIMIT = 20;

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

export async function POST(request) {
  const jwt = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!jwt) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(jwt);
  if (authErr || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { productId, choice } = body;
  if (!productId || !["yes", "no", "super"].includes(choice)) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("gold")
    .eq("id", user.id)
    .single();

  if (!profile?.gold) {
    const today = new Date().toISOString().slice(0, 10);
    const { count } = await supabase
      .from("swipes")
      .select("id", { count: "exact", head: true })
      .eq("swiper_id", user.id)
      .gte("created_at", `${today}T00:00:00.000Z`);

    if ((count ?? 0) >= FREE_DAILY_LIMIT) {
      return Response.json({ error: "limit", remaining: 0 }, { status: 429 });
    }
  }

  const { error: swipeErr } = await supabase
    .from("swipes")
    .upsert(
      { swiper_id: user.id, product_id: productId, choice },
      { onConflict: "swiper_id,product_id" }
    );
  if (swipeErr) return Response.json({ error: swipeErr.message }, { status: 500 });

  if (choice === "no") return Response.json({ matchId: null });

  const { data: matchId, error: matchErr } = await supabase
    .rpc("try_create_match", { p_swiper: user.id, p_product_swiped: productId });

  if (matchErr) {
    console.warn("try_create_match unavailable, using fallback:", matchErr.message);
    const fallbackId = await matchFallback(supabase, user.id, productId);
    return Response.json({ matchId: fallbackId });
  }

  if (matchId) {
    const { data: product } = await supabase
      .from("products").select("owner_id").eq("id", productId).single();
    if (product?.owner_id) {
      const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://truekly-match.vercel.app";
      fetch(`${origin}/api/push/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ targetUserId: product.owner_id, title: "\u00a1Nuevo match! \ud83d\udc9a", body: "Alguien quiere hacer trueque contigo", url: "/?tab=matches" }),
      }).catch(() => null);
    }
  }

  return Response.json({ matchId: matchId || null });
}

async function matchFallback(supabase, swiperId, productId) {
  const { data: product } = await supabase.from("products").select("owner_id").eq("id", productId).single();
  if (!product || product.owner_id === swiperId) return null;
  const ownerId = product.owner_id;

  const { data: existing } = await supabase.from("matches").select("id")
    .or(`and(user_a.eq.${swiperId},user_b.eq.${ownerId}),and(user_a.eq.${ownerId},user_b.eq.${swiperId})`)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: myProducts } = await supabase.from("products").select("id").eq("owner_id", swiperId).eq("active", true);
  if (!myProducts?.length) return null;

  const { data: reverseSwipes } = await supabase.from("swipes").select("product_id")
    .eq("swiper_id", ownerId).in("product_id", myProducts.map((p) => p.id)).in("choice", ["yes", "super"]);
  if (!reverseSwipes?.length) return null;

  const { data: match } = await supabase.from("matches")
    .insert({ user_a: swiperId, user_b: ownerId, product_a: reverseSwipes[0].product_id, product_b: productId })
    .select("id").single();
  return match?.id || null;
}
