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
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: Math.random() * 8 + 5,
        ratio: Math.random() * 0.5 + 0.4,
        delay: Math.random() * 1.2,
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

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-green/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md text-center px-6 pb-10 pt-8 sm:rounded-3xl sm:mx-4">
        <div className="mb-1 animate-popIn">
          <p className="text-white/60 text-sm uppercase tracking-widest font-bold mb-1">
            🎉 ¡Nuevo trueque!
          </p>
          <h1 className="text-5xl font-black bg-gradient-to-r from-brand-green to-brand-blue bg-clip-text text-transparent leading-none">
            ¡Es Match!
          </h1>
        </div>
        <p className="text-white/80 text-base mt-3 mb-8">
          A <b className="text-white">{theirProduct.owner}</b> también le interesa tu trueque
        </p>

        <div className="flex justify-center items-end gap-6 mb-10 animate-fadeInUp">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-32 h-40 rounded-2xl bg-cover bg-center border-[3px] border-brand-green shadow-2xl shadow-brand-green/50"
              style={{
                backgroundImage: myProduct.photos?.[0] ? `url('${myProduct.photos[0]}')` : "none",
                backgroundColor: myProduct.photos?.[0] ? undefined : "#1a2e20",
                transform: "rotate(-6deg)",
              }}
            />
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-wide">Tú</p>
          </div>

          <div className="text-4xl pb-8" style={{ animation: "matchPulse 1s ease-in-out infinite" }}>
            🤝
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className="w-32 h-40 rounded-2xl bg-cover bg-center border-[3px] border-brand-blue shadow-2xl shadow-brand-blue/50"
              style={{
                backgroundImage: theirProduct.photos?.[0] ? `url('${theirProduct.photos[0]}')` : "none",
                backgroundColor: theirProduct.photos?.[0] ? undefined : "#0e2030",
                transform: "rotate(6deg)",
              }}
            />
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-wide">
              {theirProduct.owner}
            </p>
          </div>
        </div>

        <div className="flex justify-between px-2 mb-8 gap-2">
          <p className="text-xs text-white/50 text-center flex-1 leading-snug line-clamp-2">{myProduct.title}</p>
          <p className="text-white/30 text-xs">⇄</p>
          <p className="text-xs text-white/50 text-center flex-1 leading-snug line-clamp-2">{theirProduct.title}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onChat}
            className="w-full py-4 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition"
          >
            💬 Enviar mensaje
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-white/10 text-white/80 font-medium border border-white/15 hover:bg-white/20 active:scale-95 transition"
          >
            Seguir descubriendo
          </button>
        </div>
      </div>
    </div>
  );
}
