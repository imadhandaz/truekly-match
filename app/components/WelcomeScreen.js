"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: "linear-gradient(160deg,#0d1f1a 0%,#0a1612 50%,#091410 100%)" }}>

      {/* Logo */}
      <div
        className="relative z-10 flex items-center justify-between px-5 pt-12 pb-2 flex-shrink-0"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-black text-xl tracking-tight">Truekly</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#6ee7b7" }}>📍 Madrid</span>
      </div>

      {/* Cards stack — hero */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}
      >
        <div className="relative w-64" style={{ height: 360 }}>

          {/* Card trasera — Lucía */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              transform: loaded ? "rotate(-7deg) translateX(-18px) translateY(8px)" : "rotate(-7deg) translateX(-18px) translateY(40px)",
              transition: "transform 0.7s cubic-bezier(0.34,1.2,0.64,1) 0.2s",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&crop=top"
              alt="Lucía"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.9) 100%)" }} />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-black text-lg">Lucía, 25</p>
              <div className="flex items-center gap-2 mt-1.5 px-2 py-1.5 rounded-xl" style={{ background: "rgba(56,189,248,0.2)", border: "1px solid rgba(56,189,248,0.4)" }}>
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop" alt="Nike" className="w-7 h-7 rounded-lg object-cover" />
                <span className="text-white text-xs font-bold">Nike Air Max 90</span>
              </div>
            </div>
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(56,189,248,0.3)", color: "#bae6fd" }}>ofrece</div>
          </div>

          {/* Card delantera — Carlos */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              transform: loaded ? "rotate(5deg) translateX(14px) translateY(-6px)" : "rotate(5deg) translateX(14px) translateY(40px)",
              transition: "transform 0.7s cubic-bezier(0.34,1.2,0.64,1) 0.35s",
              boxShadow: "0 24px 70px rgba(0,0,0,0.7)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=600&fit=crop&crop=top"
              alt="Carlos"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.9) 100%)" }} />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-black text-lg">Carlos, 28</p>
              <div className="flex items-center gap-2 mt-1.5 px-2 py-1.5 rounded-xl" style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)" }}>
                <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=50&h=50&fit=crop" alt="iPhone" className="w-7 h-7 rounded-lg object-cover" />
                <span className="text-white text-xs font-bold">iPhone 14 Pro</span>
              </div>
            </div>
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(16,185,129,0.3)", color: "#6ee7b7" }}>ofrece</div>
          </div>

          {/* Match badge flotante */}
          <div
            className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              bottom: -18,
              left: "50%",
              transform: loaded ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0)",
              transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.6s",
              background: "linear-gradient(135deg,#10b981,#059669)",
              boxShadow: "0 6px 24px rgba(16,185,129,0.6)",
              zIndex: 20,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white text-xs font-black">¡MATCH!</span>
          </div>
        </div>
      </div>

      {/* Texto y botones */}
      <div
        className="relative z-10 px-6 pb-10 pt-8 flex-shrink-0"
        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)", transition: "all 0.6s ease 0.4s" }}
      >
        <h1 className="text-white font-black leading-tight mb-1" style={{ fontSize: "1.85rem" }}>
          Intercambia lo que tienes{" "}
          <span style={{ background: "linear-gradient(90deg,#10b981,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            por lo que quieres.
          </span>
        </h1>
        <p className="text-white/50 text-sm mb-5">Sin dinero. Haz match. Truekea.</p>
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
