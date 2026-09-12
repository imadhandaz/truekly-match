"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const PLANS = [
  { id: "month", label: "1 mes", price: "4,99 €", subtitle: "por mes", badge: null, save: null, full: "4,99 €/mes" },
  { id: "year", label: "12 meses", price: "2,49 €", subtitle: "por mes", badge: "MÁS POPULAR", save: "Ahorras 50%", full: "29,99 € facturados anuales" },
  { id: "halfyear", label: "6 meses", price: "3,49 €", subtitle: "por mes", badge: null, save: "Ahorras 30%", full: "20,99 € facturados semestrales" },
];

const FEATURES = [
  { icon: "👀", title: "Ve quién te ha dado like", sub: "Sin esperar al match" },
  { icon: "♾️", title: "Swipes ilimitados", sub: "Sin límite diario" },
  { icon: "⭐", title: "5 Super Likes al día", sub: "Vs 1 gratis" },
  { icon: "🚀", title: "1 Boost al mes", sub: "Tu producto el primero 30 min" },
  { icon: "🔍", title: "Filtros completos", sub: "Categoría, distancia, edad" },
  { icon: "✓✓", title: "Confirmación de lectura", sub: "Ves cuándo leyeron" },
  { icon: "🚫", title: "Sin anuncios", sub: "Experiencia limpia" },
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
      if (data.url) { window.location.href = data.url; } else { setLoading(false); }
    } catch { setLoading(false); }
  }

  const selectedPlan = PLANS.find((p) => p.id === selected);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div className="relative w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[95vh] overflow-y-auto shadow-2xl" style={{ background: "var(--background)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/8 hover:bg-foreground/15 text-foreground/60 flex items-center justify-center text-lg z-10 transition backdrop-blur" aria-label="Cerrar">✕</button>

        <div className="px-6 pt-10 pb-6 text-center relative overflow-hidden" style={{ background: "linear-gradient(160deg, #fef3c7 0%, #fde68a 40%, #fef9ee 70%, #fff 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)", animation: "shimmer 2.8s infinite" }} />
          <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-black text-sm shadow-xl mb-5 text-white relative z-10" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%)", boxShadow: "0 4px 20px rgba(245,158,11,0.5)" }}>✨ TRUEKLY GOLD</div>
          <h1 className="text-4xl font-black mb-1 relative z-10" style={{ color: "#92400e" }}>Más matches.</h1>
          <h1 className="text-4xl font-black mb-3 relative z-10" style={{ background: "linear-gradient(135deg, #047857, #0369a1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Más trueques.</h1>
          {reason && <p className="text-sm text-foreground/55 italic relative z-10">{reason}</p>}
        </div>

        <div className="px-5 pb-3 pt-3 space-y-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border" style={{ background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.15)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))" }}>{f.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{f.title}</p>
                <p className="text-xs text-foreground/50">{f.sub}</p>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3"/></svg>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pt-4 pb-3 space-y-2">
          <p className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-3">Elige tu plan</p>
          {PLANS.map((p) => {
            const isSelected = selected === p.id;
            return (
              <button key={p.id} onClick={() => setSelected(p.id)} className="w-full p-4 rounded-2xl border-2 transition flex items-center justify-between text-left" style={{ borderColor: isSelected ? "#f59e0b" : "rgba(0,0,0,0.1)", background: isSelected ? "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.04))" : "transparent", boxShadow: isSelected ? "0 4px 16px rgba(245,158,11,0.2)" : "none" }}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold">{p.label}</p>
                    {p.badge && <span className="px-2 py-0.5 rounded-full text-white text-[9px] font-black" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>{p.badge}</span>}
                  </div>
                  <p className="text-xs text-foreground/50">{p.full}</p>
                  {p.save && <p className="text-[11px] font-bold mt-0.5" style={{ color: "#047857" }}>{p.save}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">{p.price}</p>
                  <p className="text-[10px] text-foreground/45 uppercase tracking-wide">{p.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-5 pb-8 pt-3">
          <button onClick={handleSubscribe} disabled={loading} className="w-full py-4 rounded-2xl font-black text-lg text-white transition disabled:opacity-70" style={{ background: loading ? "#d97706" : "linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #f59e0b 100%)", boxShadow: "0 6px 28px rgba(245,158,11,0.45)" }} onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "scale(1.02)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            {loading ? "Redirigiendo…" : "Empezar mi prueba gratis — 3 días"}
          </button>
          {selectedPlan && <p className="text-center text-xs text-foreground/40 mt-2 font-semibold">Luego {selectedPlan.full}</p>}
          <p className="text-center text-[11px] text-foreground/40 mt-1.5 leading-relaxed">Cancela cuando quieras · Sin compromiso</p>
        </div>
      </div>
    </div>
  );
    }
