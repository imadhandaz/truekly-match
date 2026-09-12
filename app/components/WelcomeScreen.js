"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#fff" }}>

      {/* ===== FOTO GRANDE — ocupa ~76% de la pantalla ===== */}
      <div className="relative flex-none overflow-hidden" style={{ height: "76vh" }}>
        {/* Foto: dos personas juntas, warm & lifestyle */}
        <img
          src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=900&h=1400&fit=crop&crop=faces,center"
          alt="Personas intercambiando"
          className="w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}
        />

        {/* Degradado suave abajo para transición a blanco */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "30%", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))" }} />

        {/* Degradado oscuro arriba para el logo */}
        <div className="absolute top-0 left-0 right-0" style={{ height: "40%", background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)" }} />

        {/* ===== LOGO CENTRADO SOBRE LA FOTO ===== */}
        <div
          className="absolute top-0 left-0 right-0 flex flex-col items-center"
          style={{ paddingTop: "14%", opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}
        >
          {/* Icono — flechas de intercambio bidireccional */}
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mb-3"
            style={{
              background: "linear-gradient(135deg,#10b981,#0ea5e9)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 0 3px rgba(255,255,255,0.15)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 8h14M15 5l4 3-4 3M19 16H5M9 19l-4-3 4-3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span
            className="text-white font-black text-5xl tracking-tight"
            style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
          >
            Truekly
          </span>
          <span
            className="text-white/75 text-sm font-semibold mt-2 tracking-widest uppercase"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)", letterSpacing: "0.18em" }}
          >
            Dale nueva vida a tus cosas
          </span>
        </div>

        {/* Badges de intercambio sobre la foto (abajo) */}
        <div
          className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-4"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(8px)", transition: "all 0.5s ease 0.5s" }}
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=60&h=60&fit=crop" alt="iPhone" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <p className="text-gray-900 text-xs font-black leading-none">iPhone 14</p>
              <p className="text-green-500 text-xs font-semibold">ofrece →</p>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 4px 16px rgba(16,185,129,0.5)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 8h14M15 5l4 3-4 3M19 16H5M9 19l-4-3 4-3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
            <div>
              <p className="text-gray-900 text-xs font-black leading-none">Samsung S24 Ultra</p>
              <p className="text-blue-500 text-xs font-semibold">← ofrece</p>
            </div>
            <img src="https://images.unsplash.com/photo-1567581935884-3349723552ca?w=60&h=60&fit=crop" alt="Samsung" className="w-8 h-8 rounded-lg object-cover" />
          </div>
        </div>
      </div>

      {/* ===== FRANJA BLANCA ABAJO — botones ===== */}
      <div
        className="flex-1 flex flex-col justify-center px-6 pb-8 pt-3"
        style={{ background: "#fff", opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.4s" }}
      >
        <p className="text-center text-sm font-medium mb-4" style={{ color: "#6b7280" }}>
          Empieza a intercambiar en segundos
        </p>
        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-full font-black text-lg text-white mb-3 transition-all active:scale-95 hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 8px 28px rgba(16,185,129,0.45)" }}
        >
          Crear cuenta gratis
        </button>
        <button
          onClick={onSignIn}
          className="w-full py-3.5 rounded-full font-semibold text-base transition-all active:scale-95 border"
          style={{ color: "#374151", borderColor: "#e5e7eb", background: "rgba(0,0,0,0.02)" }}
        >
          Ya tengo cuenta
        </button>
        <p className="text-center text-xs mt-4" style={{ color: "#9ca3af" }}>
          Al continuar aceptas los{" "}
          <span style={{ textDecoration: "underline" }}>Términos</span>
          {" "}y la{" "}
          <span style={{ textDecoration: "underline" }}>Política de privacidad</span>
        </p>
      </div>
    </div>
  );
          }
