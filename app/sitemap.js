import { createClient } from "@supabase/supabase-js";

export default async function sitemap() {
  const base = "https://truekly-match.vercel.app";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { data: products } = await supabase
    .from("products")
    .select("id, created_at")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1000);

  const productUrls = (products || []).map((p) => ({
    url: `${base}/p/${p.id}`,
    lastModified: p.created_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...productUrls,
  ];
}
