"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a0e0c" }}>

      {/* ===== HERO: Dos personas grandes a pantalla completa ===== */}
      <div
        className="relative flex-none"
        style={{ height: "64vh", opacity: loaded ? 1 : 0, transition: "opacity 0.7s ease" }}
      >
        {/* Foto izquierda — Carlos */}
        <div className="absolute top-0 left-0 bottom-0" style={{ width: "50%" }}>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=800&fit=crop&crop=top"
            alt="Carlos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(10,14,12,0.6) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.9) 100%)" }} />
          <div className="absolute bottom-4 left-3 right-2">
            <p className="text-white font-black text-base leading-tight">Carlos, 28</p>
            <p className="text-white/55 text-xs mb-2">Madrid</p>
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl" style={{ background: "rgba(16,185,129,0.25)", border: "1px solid rgba(16,185,129,0.5)", backdropFilter: "blur(8px)" }}>
              <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=60&h=60&fit=crop" alt="iPhone" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              <div>
                <p className="text-white text-xs font-bold leading-none">iPhone 14 Pro</p>
                <p className="text-green-400 text-xs">ofrece →</p>
              </div>
            </div>
          </div>
        </div>

        {/* Foto derecha — Lucía */}
        <div className="absolute top-0 right-0 bottom-0" style={{ width: "50%" }}>
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=800&fit=crop&crop=top"
            alt="Lucía"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to left, transparent 60%, rgba(10,14,12,0.6) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.9) 100%)" }} />
          <div className="absolute bottom-4 left-2 right-3">
            <p className="text-white font-black text-base leading-tight">Lucía, 25</p>
            <p className="text-white/55 text-xs mb-2">Vallecas</p>
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl" style={{ background: "rgba(56,189,248,0.25)", border: "1px solid rgba(56,189,248,0.5)", backdropFilter: "blur(8px)" }}>
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop" alt="Nike" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              <div>
                <p className="text-white text-xs font-bold leading-none">Nike Air Max</p>
                <p className="text-blue-400 text-xs">← ofrece</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-black text-lg" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>Truekly</span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)" }}>📍 Madrid</span>
        </div>

        {/* Icono intercambio centro */}
        <div
          className="absolute left-1/2 flex items-center justify-center"
          style={{
            top: "50%",
            transform: loaded ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(0)",
            transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#10b981,#059669)",
              boxShadow: "0 0 0 4px rgba(10,14,12,0.8), 0 6px 24px rgba(16,185,129,0.7)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM ===== */}
      <div
        className="flex-1 flex flex-col justify-center px-6 pb-8 pt-4"
        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(16px)", transition: "all 0.6s ease 0.35s" }}
      >
        <h1 className="text-white font-black leading-tight mb-1.5" style={{ fontSize: "1.9rem" }}>
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
