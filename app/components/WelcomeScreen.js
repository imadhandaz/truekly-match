"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: "#000" }}>

      {/* FOTO A PANTALLA COMPLETA */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=1200&fit=crop&crop=center"
          alt="Intercambio"
          className="w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease", objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 30%, transparent 45%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.97) 100%)" }} />
      </div>

      {/* Logo arriba */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-12"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)", boxShadow: "0 4px 12px rgba(16,185,129,0.5)" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-black text-xl tracking-tight" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>Truekly</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)" }}>📍 Madrid</span>
      </div>

      {/* Badges de intercambio flotando sobre la foto */}
      <div
        className="absolute z-10 left-4 right-4"
        style={{ top: "38%", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(10px)", transition: "all 0.6s ease 0.5s" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl flex-1" style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(16,185,129,0.5)", backdropFilter: "blur(12px)" }}>
            <img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=80&h=80&fit=crop&crop=face" alt="Carlos" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
            <div>
              <p className="text-white text-xs font-black">Carlos</p>
              <p className="text-white/60 text-xs">📱 iPhone 14</p>
            </div>
          </div>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#10b981,#059669)",
              boxShadow: "0 0 18px rgba(16,185,129,0.7)",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "scale(1)" : "scale(0)",
              transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl flex-1" style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(56,189,248,0.5)", backdropFilter: "blur(12px)" }}>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" alt="Lucía" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
            <div>
              <p className="text-white text-xs font-black">Lucía</p>
              <p className="text-white/60 text-xs">👟 Nike Air Max</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 pt-4"
        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)", transition: "all 0.6s ease 0.4s" }}
      >
        <h1 className="text-white font-black leading-tight mb-1" style={{ fontSize: "2rem", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
          Intercambia lo que tienes{" "}
          <span style={{ background: "linear-gradient(90deg,#10b981,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            por lo que quieres.
          </span>
        </h1>
        <p className="text-white/60 text-sm mb-5">Sin dinero. Haz match. Truekea.</p>
        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-2xl font-black text-lg text-white mb-3 transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg,#10b981 0%,#059669 100%)", boxShadow: "0 8px 28px rgba(16,185,129,0.55)" }}
        >
          Crear cuenta gratis
        </button>
        <button
          onClick={onSignIn}
          className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
        >
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}
