"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: "#0a0e0c" }}>

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-5 pt-12 pb-3"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-black text-lg tracking-tight">Truekly</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.4)", color: "#6ee7b7" }}>📍 Madrid</span>
      </div>

      {/* HERO — Two large people side by side */}
      <div
        className="relative z-10 flex-1 flex gap-2 px-3 pb-2"
        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)", transition: "all 0.6s ease 0.1s", minHeight: 0 }}
      >
        {/* Person A — left card */}
        <div className="relative flex-1 rounded-3xl overflow-hidden" style={{ border: "1.5px solid rgba(16,185,129,0.35)" }}>
          <img
            src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=600&fit=crop&crop=top"
            alt="Carlos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.85) 100%)" }} />
          <div className="absolute bottom-16 left-0 right-0 px-3">
            <p className="text-white font-black text-base">Carlos, 28</p>
            <p className="text-white/60 text-xs">Madrid Centro</p>
          </div>
          <div className="absolute bottom-3 left-2 right-2 flex items-center gap-2 px-2 py-2 rounded-2xl" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=60&h=60&fit=crop" alt="iPhone" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
            <div>
              <p className="text-white text-xs font-bold leading-tight">iPhone 14 Pro</p>
              <p className="text-green-400 text-xs">Ofrece →</p>
            </div>
          </div>
          <div className="absolute top-3 left-3 w-3 h-3 rounded-full" style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
        </div>

        {/* Center exchange badge */}
        <div className="flex flex-col items-center justify-center gap-2 px-0.5">
          <div
            className="flex flex-col items-center justify-center w-11 h-11 rounded-full"
            style={{
              background: "linear-gradient(135deg,#10b981,#059669)",
              boxShadow: "0 0 20px rgba(16,185,129,0.6)",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "scale(1)" : "scale(0.3)",
              transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white/40 text-xs font-bold" style={{ writingMode: "vertical-rl", letterSpacing: "0.1em" }}>MATCH</span>
        </div>

        {/* Person B — right card */}
        <div className="relative flex-1 rounded-3xl overflow-hidden" style={{ border: "1.5px solid rgba(56,189,248,0.35)" }}>
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&crop=top"
            alt="Lucía"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.85) 100%)" }} />
          <div className="absolute bottom-16 left-0 right-0 px-3">
            <p className="text-white font-black text-base">Lucía, 25</p>
            <p className="text-white/60 text-xs">Vallecas</p>
          </div>
          <div className="absolute bottom-3 left-2 right-2 flex items-center gap-2 px-2 py-2 rounded-2xl" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop" alt="Nike" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
            <div>
              <p className="text-white text-xs font-bold leading-tight">Nike Air Max</p>
              <p className="text-blue-400 text-xs">← Ofrece</p>
            </div>
          </div>
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
        </div>
      </div>

      {/* Bottom content */}
      <div
        className="relative z-10 px-6 pb-10 pt-3"
        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(16px)", transition: "all 0.6s ease 0.3s" }}
      >
        <h1 className="text-white font-black leading-tight mb-1" style={{ fontSize: "1.7rem" }}>
          Intercambia lo que tienes{" "}
          <span style={{ background: "linear-gradient(90deg,#10b981,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            por lo que quieres.
          </span>
        </h1>
        <p className="text-white/50 text-sm mb-4">Sin dinero. Haz match. Truekea.</p>

        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-2xl font-black text-lg text-white mb-3 transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg,#10b981 0%,#059669 100%)", boxShadow: "0 8px 28px rgba(16,185,129,0.5)" }}
        >
          Crear cuenta gratis
        </button>
        <button
          onClick={onSignIn}
          className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)" }}
        >
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}
