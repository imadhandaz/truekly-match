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

      {/* FOTO GRANDE */}
      <div className="relative flex-none overflow-hidden" style={{ height: "76vh" }}>
        <img
          src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=900&h=1400&fit=crop&crop=faces,center"
          alt="Personas intercambiando"
          className="w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}
        />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "30%", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))" }} />
        <div className="absolute top-0 left-0 right-0" style={{ height: "35%", background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)" }} />

        {/* LOGO CENTRADO SOBRE LA FOTO */}
        <div
          className="absolute top-0 left-0 right-0 flex flex-col items-center"
          style={{ paddingTop: "14%", opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2" style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-black text-4xl tracking-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>Truekly</span>
          <span className="text-white/80 text-sm font-medium mt-1 uppercase" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)", letterSpacing: "0.15em" }}>Donde truekeas sin dinero</span>
        </div>

        {/* Badges intercambio */}
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
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
            <div>
              <p className="text-gray-900 text-xs font-black leading-none">Nike Air</p>
              <p className="text-blue-500 text-xs font-semibold">← ofrece</p>
            </div>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop" alt="Nike" className="w-8 h-8 rounded-lg object-cover" />
          </div>
        </div>
      </div>

      {/* FRANJA BLANCA ABAJO */}
      <div
        className="flex-1 flex flex-col justify-center px-6 pb-6 pt-2"
        style={{ background: "#fff", opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.4s" }}
      >
        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-full font-black text-lg text-white mb-3 transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 6px 20px rgba(16,185,129,0.4)" }}
        >
          Crear cuenta gratis
        </button>
        <button
          onClick={onSignIn}
          className="w-full py-3 font-semibold text-base transition-all active:scale-95"
          style={{ color: "#374151" }}
        >
          Ya tengo cuenta
        </button>
        <p className="text-center text-xs mt-3" style={{ color: "#9ca3af" }}>
          Al continuar aceptas los{" "}
          <span style={{ textDecoration: "underline" }}>Términos</span>
          {" "}y la{" "}
          <span style={{ textDecoration: "underline" }}>Política de privacidad</span>
        </p>
      </div>
    </div>
  );
}
