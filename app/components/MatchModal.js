"use client";

import { useEffect, useState } from "react";

const CONFETTI_COLORS = [
  "#4ade80", "#60a5fa", "#fbbf24", "#f472b6",
  "#a78bfa", "#34d399", "#fb923c", "#38bdf8",
  "#86efac", "#93c5fd", "#fcd34d", "#f9a8d4",
];

function Confetti() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(Array.from({ length: 72 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.random() * 10 + 5,
      ratio: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 1.8,
      duration: Math.random() * 2.5 + 2,
      rotate: Math.random() * 720 - 360,
      startRotate: Math.random() * 360,
      shape: i % 3 === 0 ? "circle" : "rect",
    })));
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div key={p.id} style={{ position: "absolute", top: "-10px", left: `${p.left}%`, width: p.size, height: p.shape === "circle" ? p.size : p.size * p.ratio, backgroundColor: p.color, borderRadius: p.shape === "circle" ? "50%" : "2px", transform: `rotate(${p.startRotate}deg)`, animation: `confettiFall ${p.duration}s ${p.delay}s ease-in both`, boxShadow: `0 0 ${p.size}px ${p.color}60` }} />
      ))}
    </div>
  );
}

function FloatingSparkle({ x, y, delay, size = 16 }) {
  return (
    <div className="absolute pointer-events-none text-yellow-300" style={{ left: x, top: y, fontSize: size, animation: `float ${2 + delay}s ease-in-out ${delay}s infinite alternate`, filter: "drop-shadow(0 0 6px rgba(251,191,36,0.8))" }}>✦</div>
  );
}

export default function MatchModal({ myProduct, theirProduct, onClose, onChat }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.25), rgba(0,0,0,0.92) 70%)", backdropFilter: "blur(20px)" }}>
      <Confetti />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[25%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.35), transparent 70%)", animation: "blob-drift-1 8s ease-in-out infinite" }} />
        <div className="absolute bottom-[20%] right-[25%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.3), transparent 70%)", animation: "blob-drift-2 10s ease-in-out infinite" }} />
        <div className="absolute top-[50%] left-[50%] w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(52,211,153,0.2), transparent 70%)", transform: "translate(-50%, -50%)", animation: "blob-drift-3 6s ease-in-out infinite" }} />
      </div>
      <FloatingSparkle x="8%" y="15%" delay={0} size={20} />
      <FloatingSparkle x="88%" y="20%" delay={0.4} size={14} />
      <FloatingSparkle x="5%" y="65%" delay={0.8} size={18} />
      <FloatingSparkle x="92%" y="70%" delay={0.2} size={12} />
      <FloatingSparkle x="50%" y="8%" delay={0.6} size={16} />

      <div className="relative w-full max-w-md text-center px-6 pb-10 pt-8 sm:rounded-3xl sm:mx-4">
        <div className="mb-2" style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "scale(1) translateY(0)" : "scale(0.7) translateY(-20px)", transition: "all 0.6s cubic-bezier(0.2,1.4,0.5,1)" }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-0.5 rounded-full" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.4))" }} />
            <p className="text-white/60 text-[11px] uppercase tracking-[0.25em] font-bold">Nuevo trueque</p>
            <div className="w-8 h-0.5 rounded-full" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.4))" }} />
          </div>
          <div className="relative inline-block">
            <h1 className="text-[64px] font-black leading-none" style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", letterSpacing: "-0.03em", background: "linear-gradient(135deg, #34d399 0%, #a7f3d0 30%, #38bdf8 60%, #34d399 100%)", backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradient-shift 3s linear infinite" }}>¡Match!</h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl" style={{ background: "linear-gradient(90deg, #10b981, #0ea5e9)" }} />
          </div>
        </div>

        <p className="text-white/70 text-sm mt-5 mb-8 leading-relaxed" style={{ opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>
          A <b className="text-white font-bold">{theirProduct.owner}</b> también le interesa<br />lo que tienes para truekear
        </p>

        <div className="flex justify-center items-end gap-4 mb-8" style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)", transition: "all 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.15s" }}>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)", opacity: 0.7, animation: "pulse-ring 2s ease-out infinite" }} />
              <div className="relative w-32 h-40 rounded-2xl bg-cover bg-center border-[3px] border-brand-green" style={{ backgroundImage: myProduct.photos?.[0] ? `url('${myProduct.photos[0]}')` : "none", backgroundColor: myProduct.photos?.[0] ? undefined : "#1a2e20", transform: "rotate(-6deg)", boxShadow: "0 12px 40px rgba(16,185,129,0.5)" }} />
            </div>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-wider">Tú</p>
          </div>
          <div className="relative flex items-center justify-center pb-8">
            <div className="absolute w-20 h-20 rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.4), transparent)", animation: "pulse-ring 1.5s ease-out infinite" }} />
            <div className="absolute w-20 h-20 rounded-full" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.3), transparent)", animation: "pulse-ring 1.5s ease-out 0.6s infinite" }} />
            <span style={{ fontSize: 48, animation: "matchPulse 1.4s ease-in-out infinite", filter: "drop-shadow(0 4px 16px rgba(16,185,129,0.7))" }}>🤝</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl" style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)", opacity: 0.7, animation: "pulse-ring 2s ease-out 0.5s infinite" }} />
              <div className="relative w-32 h-40 rounded-2xl bg-cover bg-center border-[3px] border-brand-blue" style={{ backgroundImage: theirProduct.photos?.[0] ? `url('${theirProduct.photos[0]}')` : "none", backgroundColor: theirProduct.photos?.[0] ? undefined : "#0e2030", transform: "rotate(6deg)", boxShadow: "0 12px 40px rgba(14,165,233,0.5)" }} />
            </div>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-wider">{theirProduct.owner}</p>
          </div>
        </div>

        <div className="flex justify-between items-center px-2 mb-8 gap-3" style={{ opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}>
          <p className="text-xs text-white/50 text-center flex-1 leading-snug line-clamp-2 font-semibold">{myProduct.title}</p>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(14,165,233,0.3))", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18"/></svg>
          </div>
          <p className="text-xs text-white/50 text-center flex-1 leading-snug line-clamp-2 font-semibold">{theirProduct.title}</p>
        </div>

        <div className="space-y-3" style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateY(0)" : "translateY(16px)", transition: "all 0.5s cubic-bezier(0.2,0.8,0.2,1)" }}>
          <button onClick={onChat} className="relative w-full py-4 rounded-full text-white font-black text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-95" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #0ea5e9 100%)", backgroundSize: "200% 100%", boxShadow: "0 10px 36px rgba(16,185,129,0.55), 0 0 0 1px rgba(255,255,255,0.12)", fontFamily: "var(--font-jakarta), system-ui, sans-serif" }}>
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Enviar mensaje
            </span>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)", animation: "shimmer-btn 3s ease-in-out 1s infinite" }} />
          </button>
          <button onClick={onClose} className="w-full py-3.5 rounded-full font-semibold text-white/60 border border-white/10 hover:bg-white/10 active:scale-95 transition text-sm">
            Seguir descubriendo →
          </button>
        </div>
        <p className="text-white/25 text-[10px] mt-4">¡No dejes que este match se enfríe!</p>
      </div>
    </div>
  );
                     }
