"use client";

import { useEffect, useState } from "react";

const CONFETTI_COLORS = [
  "#4ade80", "#60a5fa", "#fbbf24", "#f472b6",
  "#a78bfa", "#34d399", "#fb923c", "#38bdf8",
];

function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: Math.random() * 9 + 5,
        ratio: Math.random() * 0.5 + 0.4,
        delay: Math.random() * 1.4,
        duration: Math.random() * 2 + 2.5,
        rotate: Math.random() * 720 - 360,
        startRotate: Math.random() * 360,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: "-10px",
            left: `${p.left}%`,
            width: p.size,
            height: p.size * p.ratio,
            backgroundColor: p.color,
            borderRadius: "2px",
            transform: `rotate(${p.startRotate}deg)`,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in both`,
          }}
        />
      ))}
    </div>
  );
}

export default function MatchModal({ myProduct, theirProduct, onClose, onChat }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-md bg-black/75 animate-fadeIn overflow-hidden">
      <Confetti />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-green/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md text-center px-6 pb-10 pt-8 sm:rounded-3xl sm:mx-4">
        {/* Title */}
        <div className="mb-1 animate-popIn">
          <p className="text-white/50 text-xs uppercase tracking-[0.22em] font-bold mb-2">
            🎉 ¡Nuevo trueque!
          </p>
          <h1
            className="text-6xl font-black bg-gradient-to-r from-brand-green via-emerald-300 to-brand-blue bg-clip-text text-transparent leading-none"
            style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", letterSpacing: "-0.02em" }}
          >
            ¡Es Match!
          </h1>
          <div className="mt-2 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-brand-green to-brand-blue opacity-60" />
        </div>
        <p className="text-white/75 text-base mt-4 mb-8">
          A <b className="text-white font-bold">{theirProduct.owner}</b> también le interesa tu trueque
        </p>

        {/* Photos */}
        <div className="flex justify-center items-end gap-6 mb-10 animate-fadeInUp">
          {/* My product */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-32 h-40 rounded-2xl bg-cover bg-center border-[3px] border-brand-green shadow-2xl shadow-brand-green/50"
              style={{
                backgroundImage: myProduct.photos?.[0]
                  ? `url('${myProduct.photos[0]}')`
                  : "none",
                backgroundColor: myProduct.photos?.[0] ? undefined : "#1a2e20",
                transform: "rotate(-6deg)",
              }}
            />
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-wide">Tú</p>
          </div>

          {/* Handshake con anillo de pulso */}
          <div className="relative flex items-center justify-center pb-8">
            <div className="absolute w-16 h-16 rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.3), transparent)", animation: "pulse-ring 1.5s ease-out infinite" }} />
            <div className="absolute w-16 h-16 rounded-full" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.2), transparent)", animation: "pulse-ring 1.5s ease-out 0.5s infinite" }} />
            <div className="text-5xl" style={{ animation: "matchPulse 1.2s ease-in-out infinite", filter: "drop-shadow(0 4px 12px rgba(16,185,129,0.5))" }}>
              🤝
            </div>
          </div>

          {/* Their product */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-32 h-40 rounded-2xl bg-cover bg-center border-[3px] border-brand-blue shadow-2xl shadow-brand-blue/50"
              style={{
                backgroundImage: theirProduct.photos?.[0]
                  ? `url('${theirProduct.photos[0]}')`
                  : "none",
                backgroundColor: theirProduct.photos?.[0] ? undefined : "#0e2030",
                transform: "rotate(6deg)",
              }}
            />
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-wide">
              {theirProduct.owner}
            </p>
          </div>
        </div>

        {/* Product titles */}
        <div className="flex justify-between px-2 mb-8 gap-2">
          <p className="text-xs text-white/50 text-center flex-1 leading-snug line-clamp-2">
            {myProduct.title}
          </p>
          <p className="text-white/30 text-xs">⇄</p>
          <p className="text-xs text-white/50 text-center flex-1 leading-snug line-clamp-2">
            {theirProduct.title}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onChat}
            className="w-full py-4 rounded-full text-white font-black text-lg hover:scale-105 active:scale-95 transition"
            style={{
              background: "linear-gradient(135deg, #10b981, #0ea5e9)",
              boxShadow: "0 8px 28px rgba(16,185,129,0.45), 0 0 0 1px rgba(255,255,255,0.1)",
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            }}
          >
            💬 Enviar mensaje
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full font-medium text-white/70 border border-white/10 hover:bg-white/10 active:scale-95 transition text-sm"
          >
            Seguir descubriendo →
          </button>
        </div>
      </div>
    </div>
  );
    }
