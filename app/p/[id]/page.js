import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { data: p } = await getSupabaseAdmin()
    .from("products")
    .select("title, wants, photos, description, profiles!owner_id(display_name)")
    .eq("id", params.id)
    .maybeSingle();

  if (!p) return { title: "Truekly Match" };

  const owner = p.profiles?.display_name || "Alguien";
  const desc = owner + " ofrece " + p.title + " a cambio de " + p.wants + ". \u{00A1}\u{00DA}nete al trueque!";

  return {
    title: p.title + " | Truekly Match",
    description: desc,
    openGraph: {
      title: p.title + " \u{1F91D} Truekly Match",
      description: "A cambio de: " + p.wants,
      images: p.photos?.[0] ? [{ url: p.photos[0], width: 800, height: 600 }] : [],
      url: (process.env.NEXT_PUBLIC_APP_URL || "") + "/p/" + params.id,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: p.title + " | Truekly Match",
      description: desc,
      images: p.photos?.[0] ? [p.photos[0]] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { data: p } = await getSupabaseAdmin()
    .from("products")
    .select("*, profiles!owner_id(display_name, verified)")
    .eq("id", params.id)
    .eq("active", true)
    .maybeSingle();

  if (!p) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">\u{1F615}</div>
        <h1 className="text-2xl font-bold mb-2">Producto no encontrado</h1>
        <p className="text-foreground/60 mb-6">Es posible que ya haya sido intercambiado</p>
        <Link href="/" className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold">
          Ver Truekly Match
        </Link>
      </div>
    );
  }

  const owner = p.profiles?.display_name || "Usuario";
  const photo = p.photos?.[0];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://truekly-match.vercel.app";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white font-black text-xl shadow-lg">
            T
          </div>
          <span className="font-black text-xl bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
            Truekly Match
          </span>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-6" style={{ aspectRatio: "3/4" }}>
          {photo ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('" + photo + "')" }} />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-blue/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {p.category && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-white/95 text-xs font-bold text-brand-blue-dark">{p.category}</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h1 className="text-3xl font-bold mb-1">{p.title}</h1>
            <div className="flex items-center gap-1.5 mb-3">
              <p className="text-sm text-white/80">Por <b>{owner}</b></p>
              {p.profiles?.verified && (
                <span className="w-4 h-4 rounded-full bg-gradient-to-br from-brand-green to-brand-blue text-white text-[9px] font-black flex items-center justify-center">\u{2713}</span>
              )}
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3 border border-white/20">
              <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-0.5">Lo cambia por</p>
              <p className="font-semibold">{p.wants}</p>
            </div>
          </div>
        </div>

        {p.description && (
          <p className="text-sm text-foreground/70 text-center mb-5 leading-relaxed px-2">
            {p.description.slice(0, 160)}{p.description.length > 160 ? "..." : ""}
          </p>
        )}

        <Link href={appUrl} className="block w-full py-4 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-lg text-center shadow-2xl hover:scale-[1.02] transition">
          \u{1F91D} Ver en Truekly Match
        </Link>
        <p className="text-center text-xs text-foreground/50 mt-3">Trueque \u{00B7} Intercambio \u{00B7} Sin dinero</p>
      </div>
    </div>
  );
}
