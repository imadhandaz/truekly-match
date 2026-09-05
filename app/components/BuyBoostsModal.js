"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

const PACKS = [
  { id: "boost3",  label: "3 Boosts",  price: "0,99 €", boosts: 3,  popular: false },
  { id: "boost10", label: "10 Boosts", price: "2,99 €", boosts: 10, popular: true  },
];

export default function BuyBoostsModal({ currentCredits = 0, onClose }) {
  const [loading, setLoading] = useState(null);

  const buy = async (packId) => {
    setLoading(packId);
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/boost/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silently fail
    }
    setLoading(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slideInUp overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-foreground/5 text-center">
          <div className="text-4xl mb-2">🚀</div>
          <h2 className="text-xl font-bold">Comprar Boosts</h2>
          {currentCredits > 0 ? (
            <p className="text-sm text-foreground/60 mt-1">
              Te quedan <b>{currentCredits} boost{currentCredits !== 1 ? "s" : ""}</b>. Compra más para tenerlos de reserva.
            </p>
          ) : (
            <p className="text-sm text-foreground/60 mt-1">
              Sin boosts disponibles — elige un pack para volver al top
            </p>
          )}
        </div>

        <div className="px-6 py-6 space-y-4">
          <p className="text-xs text-foreground/50 text-center">
            🔝 Un Boost sube tu producto al top del deck durante 24h
          </p>

          {PACKS.map((pack) => (
            <button
              key={pack.id}
              onClick={() => buy(pack.id)}
              disabled={!!loading}
              className={`relative w-full p-4 rounded-2xl border-2 text-left transition hover:scale-[1.01] active:scale-95 disabled:opacity-60 ${
                pack.popular
                  ? "border-brand-green bg-gradient-to-r from-brand-green/8 to-brand-blue/8"
                  : "border-foreground/10 hover:bg-foreground/3"
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white text-[10px] font-black">
                  MÁS POPULAR
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{pack.label}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    {pack.boosts} boost{pack.boosts !== 1 ? "s" : ""} · pago único · sin caducidad
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="font-black text-lg">{pack.price}</p>
                </div>
              </div>
              {loading === pack.id && (
                <div className="absolute inset-0 rounded-2xl bg-background/70 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          ))}

          <button onClick={onClose} className="w-full py-2 text-sm text-foreground/40 hover:text-foreground/60 transition">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
