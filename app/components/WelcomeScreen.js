"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: "#090d0b" }}>

      {/* Background atmosphere */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80&fit=crop&crop=center"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.22, filter: "saturate(0.6)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(9,13,11,0.6) 0%, rgba(9,13,11,0.3) 40%, rgba(9,13,11,0.85) 75%, #090d0b 100%)" }} />
      </div>

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-5 pt-12"
        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(-8px)", transition: "all 0.5s ease" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-black text-lg tracking-tight">Truekly</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.4)", color: "#6ee7b7" }}>📍 Madrid</span>
      </div>

      {/* HERO — Swap scene */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center px-4"
        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(16px)", transition: "all 0.65s ease 0.15s" }}
      >
        <div className="w-full max-w-xs">

          {/* Person A card */}
          <div
            className="flex items-center gap-3 p-3 rounded-2xl mb-3"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=120&h=120&fit=crop&crop=face"
              alt="Carlos"
              className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">Carlos, 28</p>
              <p className="text-white/50 text-xs">Madrid</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <img
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop"
                  alt="iPhone"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">iPhone 14 Pro</p>
                  <p className="text-green-400 text-xs">ofrece esto →</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange arrow */}
          <div className="flex items-center justify-center gap-3 my-1">
            <div className="flex-1 h-px" style={{ background: "rgba(16,185,129,0.2)" }} />
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "linear-gradient(135deg,#10b981,#059669)",
                boxShadow: "0 4px 20px rgba(16,185,129,0.45)",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "scale(1)" : "scale(0.5)",
                transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-white text-xs font-black">¡MATCH!</span>
            </div>
            <div className="flex-1 h-px" style={{ background: "rgba(16,185,129,0.2)" }} />
          </div>

          {/* Person B card */}
          <div
            className="flex items-center gap-3 p-3 rounded-2xl mt-3"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face"
              alt="Lucía"
              className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">Lucía, 25</p>
              <p className="text-white/50 text-xs">Vallecas</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop"
                  alt="Nike"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">Nike Air Max 90</p>
                  <p className="text-blue-400 text-xs">← ofrece esto</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom content */}
      <div
        className="relative z-10 px-6 pb-10 pt-2"
        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)", transition: "all 0.6s ease 0.3s" }}
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
        <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
          Al registrarte aceptas los Términos y Política de privacidad
        </p>
      </div>
    </div>
  );
}
