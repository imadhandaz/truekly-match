"use client";

import { useState } from "react";

const PLANS = [
  {
    id: "month",
    label: "1 mes",
    price: "4,99 €",
    subtitle: "por mes",
    badge: null,
    save: null,
    full: "4,99 €/mes",
  },
  {
    id: "year",
    label: "12 meses",
    price: "2,49 €",
    subtitle: "por mes",
    badge: "MÁS POPULAR",
    save: "Ahorras 50%",
    full: "29,99 € facturados anuales",
  },
  {
    id: "halfyear",
    label: "6 meses",
    price: "3,49 €",
    subtitle: "por mes",
    badge: null,
    save: "Ahorras 30%",
    full: "20,99 € facturados semestrales",
  },
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

export default function GoldPaywall({ onClose, reason, userId, userEmail }) {
  const [selected, setSelected] = useState("year");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selected, userId, userEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al conectar con el servidor");
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió URL de pago");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const stripeConfigured = true; // Siempre intentamos; el servidor devuelve 503 si no está listo

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div className="bg-gradient-to-b from-yellow-50 via-white to-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 text-foreground/70 flex items-center justify-center text-lg z-10 backdrop-blur"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="px-6 pt-10 pb-4 text-center bg-gradient-to-b from-yellow-100/60 to-transparent">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-black text-sm shadow-lg mb-4">
            ✨ TRUEKLY GOLD
          </div>
          <h1 className="text-3xl font-black mb-2">
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
              Más matches.
            </span>
          </h1>
          <h1 className="text-3xl font-black mb-3">
            <span className="bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
              Más trueques.
            </span>
          </h1>
          {reason && <p className="text-sm text-foreground/60 italic">{reason}</p>}
        </div>

        <div className="px-6 pb-2 space-y-2.5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-yellow-100"
            >
              <div className="text-2xl">{f.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{f.title}</p>
                <p className="text-xs text-foreground/55">{f.sub}</p>
              </div>
              <span className="text-brand-green text-lg">✓</span>
            </div>
          ))}
        </div>

        <div className="px-6 pt-5 pb-4 space-y-2">
          {PLANS.map((p) => {
            const isSelected = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`w-full p-4 rounded-2xl border-2 transition flex items-center justify-between text-left ${
                  isSelected
                    ? "border-yellow-500 bg-yellow-50 shadow-lg"
                    : "border-foreground/10 bg-white hover:border-yellow-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold">{p.label}</p>
                    {p.badge && (
                      <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] font-black">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/60">{p.full}</p>
                  {p.save && (
                    <p className="text-[11px] font-bold text-brand-green-dark mt-0.5">{p.save}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">{p.price}</p>
                  <p className="text-[10px] text-foreground/50 uppercase tracking-wide">{p.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 pb-8">
          {error && (
            <div className="mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 text-white font-black text-lg shadow-2xl hover:scale-[1.02] transition disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Redirigiendo...
              </>
            ) : (
              "Empezar mi prueba gratis 3 días ✨"
            )}
          </button>
          <p className="text-center text-[11px] text-foreground/50 mt-3 leading-relaxed">
            Después tu plan elegido se renueva automáticamente.
            <br />
            Cancela cuando quieras. Pago seguro con Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
