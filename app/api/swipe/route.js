import { createClient } from "@supabase/supabase-js";

const FREE_DAILY_LIMIT = 20;
// Basic UUID v4 pattern for input validation
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

export async function POST(request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const jwt = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!jwt) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(jwt);
  if (authErr || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // ── Validate body ─────────────────────────────────────────────────────────
  const body = await request.json().catch(() => ({}));
  const { productId, choice } = body;
  if (!productId || !UUID_RE.test(productId) || !["yes", "no", "super"].includes(choice)) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  // ── Verify user does NOT own the product they are swiping on ─────────────
  const { data: swipedProduct, error: prodErr } = await supabase
    .from("products")
    .select("id, owner_id, title")
    .eq("id", productId)
    .single();
  if (prodErr || !swipedProduct) return Response.json({ error: "Product not found" }, { status: 404 });
  if (swipedProduct.owner_id === user.id) {
    return Response.json({ error: "Cannot swipe own product" }, { status: 400 });
  }

  // ── Server-side swipe limit (free users only) ─────────────────────────────
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

  // ── Record swipe ──────────────────────────────────────────────────────────
  const { error: swipeErr } = await supabase
    .from("swipes")
    .upsert(
      { swiper_id: user.id, product_id: productId, choice },
      { onConflict: "swiper_id,product_id" }
    );
  if (swipeErr) return Response.json({ error: swipeErr.message }, { status: 500 });

  if (choice === "no") return Response.json({ matchId: null });

  // ── Atomic match detection via DB function ────────────────────────────────
  const { data: matchId, error: matchErr } = await supabase
    .rpc("try_create_match", {
      p_swiper: user.id,
      p_product_swiped: productId,
    });

  if (matchErr) {
    // DB function not deployed yet — fall back to JS logic
    const fallbackId = await matchFallback(supabase, user.id, productId, swipedProduct);
    return Response.json({ matchId: fallbackId });
  }

  // ── Notify match partner ──────────────────────────────────────────────────
  if (matchId) {
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://truekly-match.vercel.app";
    // Fire-and-forget: notify the owner of the swiped product
    fetch(`${origin}/api/push/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({
        targetUserId: swipedProduct.owner_id,
        title: "¡Nuevo match! 💚",
        body: `¡Match con ${swipedProduct.title}! Propón un trueque →`,
        url: "/?tab=matches",
      }),
    }).catch(() => null);
  }

  return Response.json({ matchId: matchId || null });
}

// Fallback (JS) match logic — canonical UUID ordering prevents duplicate matches
async function matchFallback(supabase, swiperId, productId, swipedProduct) {
  const ownerId = swipedProduct.owner_id;

  // Check if a match already exists (either direction)
  const [idA, idB] = swiperId < ownerId ? [swiperId, ownerId] : [ownerId, swiperId];
  const { data: existing } = await supabase
    .from("matches")
    .select("id")
    .eq("user_a", idA)
    .eq("user_b", idB)
    .maybeSingle();

  if (existing) return existing.id;

  // Get the swiper's active products
  const { data: myProducts } = await supabase
    .from("products")
    .select("id")
    .eq("owner_id", swiperId)
    .eq("active", true);

  if (!myProducts?.length) return null;

  // Check if the other user swiped yes/super on any of the swiper's products
  const { data: reverseSwipes } = await supabase
    .from("swipes")
    .select("product_id")
    .eq("swiper_id", ownerId)
    .in("product_id", myProducts.map((p) => p.id))
    .in("choice", ["yes", "super"]);

  if (!reverseSwipes?.length) return null;

  // Canonical ordering: smaller UUID always goes to user_a/product_a
  const myProductId = reverseSwipes[0].product_id;
  const [userA, userB, prodA, prodB] =
    swiperId < ownerId
      ? [swiperId, ownerId, myProductId, productId]
      : [ownerId, swiperId, productId, myProductId];

  const { data: match, error: insertErr } = await supabase
    .from("matches")
    .insert({ user_a: userA, user_b: userB, product_a: prodA, product_b: prodB })
    .select("id")
    .single();

  if (insertErr) {
    // Likely a unique-constraint violation — match was created concurrently; fetch it
    const { data: raceMatch } = await supabase
      .from("matches")
      .select("id")
      .eq("user_a", idA)
      .eq("user_b", idB)
      .maybeSingle();
    return raceMatch?.id || null;
  }

  return match?.id || null;
}
