"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const PLANS = [
  { id: "month",   label: "1 mes",    price: "4,99 €", subtitle: "por mes", badge: null,         save: null,         full: "4,99 €/mes" },
  { id: "year",    label: "12 meses", price: "2,49 €", subtitle: "por mes", badge: "MÁS POPULAR", save: "Ahorras 50%", full: "29,99 € facturados anuales" },
  { id: "halfyear",label: "6 meses",  price: "3,49 €", subtitle: "por mes", badge: null,         save: "Ahorras 30%", full: "20,99 € facturados semestrales" },
];

const FEATURES = [
  { icon: "👀", title: "Ve quién te ha dado like", sub: "Sin esperar al match" },
  { icon: "♾️", title: "Swipes ilimitados",         sub: "Sin límite diario" },
  { icon: "⭐", title: "5 Super Likes al día",       sub: "Vs 1 gratis" },
  { icon: "🚀", title: "1 Boost al mes",             sub: "Tu producto el primero 30 min" },
  { icon: "🔍", title: "Filtros completos",           sub: "Categoría, distancia, edad" },
  { icon: "✓✓", title: "Confirmación de lectura",    sub: "Ves cuándo leyeron" },
  { icon: "🚫", title: "Sin anuncios",               sub: "Experiencia limpia" },
];

export default function GoldPaywall({ onClose, reason }) {
  const [selected, setSelected] = useState("year");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selected, userId: user?.id, userEmail: user?.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { console.error("Stripe checkout error:", data.error); setLoading(false); }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div
        className="w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[95vh] overflow-y-auto shadow-2xl"
        style={{ background: "linear-gradient(180deg, #1a1200 0%, #0d0d0d 40%, #0a0a0a 100%)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center justify-center text-lg z-10"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Header */}
        <div className="px-6 pt-10 pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black text-sm shadow-lg mb-5">
            ✨ TRUEKLY GOLD
          </div>
          <h1 className="text-4xl font-black mb-1">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
              Más matches.
            </span>
          </h1>
          <h1 className="text-4xl font-black mb-3">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Más trueques.
            </span>
          </h1>
          {reason && <p className="text-sm text-white/50 italic">{reason}</p>}
        </div>

        {/* Features */}
        <div className="px-5 pb-3 space-y-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-2xl">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white">{f.title}</p>
                <p className="text-xs text-white/50">{f.sub}</p>
              </div>
              <span className="text-emerald-400 text-lg font-black">✓</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="px-5 pt-4 pb-3 space-y-2.5">
          {PLANS.map((p) => {
            const isSel = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className="w-full p-4 rounded-2xl transition flex items-center justify-between text-left"
                style={{
                  background: isSel ? "rgba(234,179,8,0.12)" : "rgba(255,255,255,0.05)",
                  border: isSel ? "2px solid rgba(234,179,8,0.7)" : "2px solid rgba(255,255,255,0.08)",
                  boxShadow: isSel ? "0 0 20px rgba(234,179,8,0.15)" : "none",
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-white">{p.label}</p>
                    {p.badge && (
                      <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[9px] font-black">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40">{p.full}</p>
                  {p.save && <p className="text-[11px] font-bold text-emerald-400 mt-0.5">{p.save}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{p.price}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wide">{p.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="px-5 pb-8 pt-2">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-lg shadow-2xl transition hover:scale-[1.02] disabled:opacity-70 disabled:scale-100"
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316, #eab308)", color: "#000" }}
          >
            {loading ? "Redirigiendo…" : "Empezar mi prueba gratis 3 días"}
          </button>
          <p className="text-center text-[11px] text-white/35 mt-3 leading-relaxed">
            Después tu plan elegido se renueva automáticamente.
            <br />Cancela cuando quieras.
          </p>
        </div>
      </div>
    </div>
  );
}
