import { getSupabase } from "./supabase";
import { products as seedProducts } from "@/app/data/products";
import { notifyUser } from "./notifications";

function toCard(row) {
  return {
    id: row.id,
    title: row.title,
    storage: row.storage_detail || "",
    category: row.category,
    owner: row.profiles?.display_name || "Usuario",
    ownerId: row.owner_id,
    verified: row.profiles?.verified || false,
    location: `Madrid · ${row.neighborhood || "Centro"}`,
    distance: row.neighborhood || "Madrid",
    photos: row.photos?.length
      ? row.photos
      : ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=80"],
    wants: row.wants || "",
    description: row.description || "",
    tags: row.tags || [],
    matchChance: 0.5,
  };
}

// ─── PRODUCTOS ──────────────────────────────────────────────────────────────

export async function fetchDiscoverProducts(userId, filters = {}) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("products")
    .select("*, profiles(display_name, verified)")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("fetchDiscoverProducts:", error);
    return seedProducts;
  }

  let cards = (data || []).map(toCard);

  if (userId) {
    cards = cards.filter((c) => c.ownerId !== userId);

    const { data: swiped } = await supabase
      .from("swipes")
      .select("product_id")
      .eq("swiper_id", userId);

    if (swiped?.length) {
      const swipedIds = new Set(swiped.map((s) => s.product_id));
      cards = cards.filter((c) => !swipedIds.has(c.id));
    }
  }

  if (filters.cats?.length) {
    cards = cards.filter((c) => filters.cats.includes(c.category));
  }
  if (filters.verifiedOnly) {
    cards = cards.filter((c) => c.verified);
  }

  // Si la BD está vacía y el usuario no está autenticado, mostrar datos seed
  if (cards.length === 0 && !userId) return seedProducts;

  return cards;
}

export async function fetchMyProducts(userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*, profiles(display_name, verified)")
    .eq("owner_id", userId)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) { console.error("fetchMyProducts:", error); return []; }
  return (data || []).map(toCard);
}

export async function saveProduct(userId, form, photoFiles) {
  const supabase = getSupabase();

  const photoUrls = [];
  for (const file of photoFiles || []) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-photos")
      .upload(path, file);
    if (upErr) throw upErr;
    const { data: urlData } = supabase.storage
      .from("product-photos")
      .getPublicUrl(path);
    photoUrls.push(urlData.publicUrl);
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      owner_id: userId,
      title: form.title,
      storage_detail: form.storage || null,
      category: form.category,
      neighborhood: form.neighborhood,
      photos: photoUrls,
      wants: form.wants,
      description: form.description || null,
      tags: form.tags || [],
    })
    .select("*, profiles(display_name, verified)")
    .single();

  if (error) throw error;
  return toCard(data);
}

export async function softDeleteProduct(productId) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("products")
    .update({ active: false })
    .eq("id", productId);
  if (error) throw error;
}

// ─── SWIPES Y MATCHES ────────────────────────────────────────────────────────

export async function recordSwipe(swiperId, productId, choice) {
  const supabase = getSupabase();

  const { error: swipeErr } = await supabase
    .from("swipes")
    .upsert(
      { swiper_id: swiperId, product_id: productId, choice },
      { onConflict: "swiper_id,product_id" }
    );
  if (swipeErr) throw swipeErr;

  if (choice === "no") return null;

  const { data: product } = await supabase
    .from("products")
    .select("owner_id")
    .eq("id", productId)
    .single();

  if (!product || product.owner_id === swiperId) return null;
  const ownerId = product.owner_id;

  // ¿Ya existe el match?
  const { data: existing } = await supabase
    .from("matches")
    .select("id")
    .or(
      `and(user_a.eq.${swiperId},user_b.eq.${ownerId}),and(user_a.eq.${ownerId},user_b.eq.${swiperId})`
    )
    .maybeSingle();

  if (existing) return existing.id;

  // ¿Ha dado like el dueño a alguno de mis productos?
  const { data: myProducts } = await supabase
    .from("products")
    .select("id")
    .eq("owner_id", swiperId)
    .eq("active", true);

  if (!myProducts?.length) return null;

  const { data: reverseSwipes } = await supabase
    .from("swipes")
    .select("product_id")
    .eq("swiper_id", ownerId)
    .in("product_id", myProducts.map((p) => p.id))
    .in("choice", ["yes", "super"]);

  if (!reverseSwipes?.length) return null;

  const { data: match, error: matchErr } = await supabase
    .from("matches")
    .insert({
      user_a: swiperId,
      user_b: ownerId,
      product_a: reverseSwipes[0].product_id,
      product_b: productId,
    })
    .select("id")
    .single();

  if (matchErr) throw matchErr;

  // Notificar al otro usuario del match
  notifyUser(
    ownerId,
    "¡Nuevo match! 💚",
    "Alguien quiere hacer trueque contigo",
    "/?tab=matches"
  );

  return match.id;
}

export async function fetchMyMatches(userId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("matches")
    .select(`
      id, created_at, user_a, user_b,
      product_a:products!product_a(id, title, photos, wants, neighborhood, owner_id, profiles(display_name, verified)),
      product_b:products!product_b(id, title, photos, wants, neighborhood, owner_id, profiles(display_name, verified))
    `)
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) { console.error("fetchMyMatches:", error); return []; }

  return (data || []).map((m) => {
    const isA = m.user_a === userId;
    const their = isA ? m.product_b : m.product_a;

    return {
      matchId: m.id,
      id: their?.id || m.id,
      title: their?.title || "Producto",
      owner: their?.profiles?.display_name || "Usuario",
      ownerId: isA ? m.user_b : m.user_a,
      verified: their?.profiles?.verified || false,
      photos: their?.photos?.length
        ? their.photos
        : ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=80"],
      wants: their?.wants || "",
      location: `Madrid · ${their?.neighborhood || "Madrid"}`,
      createdAt: m.created_at,
    };
  });
}

// ─── MENSAJES Y REALTIME ─────────────────────────────────────────────────────

export async function fetchMessages(matchId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (error) { console.error("fetchMessages:", error); return []; }
  return data || [];
}

export async function sendMessage(matchId, senderId, text) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("messages")
    .insert({ match_id: matchId, sender_id: senderId, text })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function subscribeToMessages(matchId, callback) {
  const supabase = getSupabase();
  const channel = supabase
    .channel(`messages-${matchId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
