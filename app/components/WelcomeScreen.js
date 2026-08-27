"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85&fit=crop&crop=center" alt="Personas intercambiando" className="w-full h-full object-cover object-center" loading="eager" />
        <div className="absolute inset-0" style={{ background:"linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.0) 45%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.96) 100%)" }} />
      </div>
      <div className="relative z-10 flex items-center justify-between px-5 pt-12" style={{ opacity:loaded?1:0, transform:loaded?"none":"translateY(-8px)", transition:"opacity 0.5s ease, transform 0.5s ease" }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background:"linear-gradient(135deg,#10b981,#0ea5e9)" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-white font-black text-lg tracking-tight drop-shadow-lg">Truekly</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:"rgba(16,185,129,0.2)", border:"1px solid rgba(16,185,129,0.5)", color:"#6ee7b7", backdropFilter:"blur(8px)" }}>📍 Madrid</span>
      </div>
      <div className="flex-1" />
      <div className="relative z-10 px-6 pb-10" style={{ opacity:loaded?1:0, transform:loaded?"none":"translateY(20px)", transition:"opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex -space-x-2">
            {["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&h=80&fit=crop&crop=face","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face","https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"].map((src,i)=>(<img key={i} src={src} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-black" />))}
          </div>
          <p className="text-white/80 text-sm"><span className="text-white font-bold">+2.400 personas</span> ya truekean</p>
        </div>
        <h1 className="text-white font-black leading-tight mb-2" style={{ fontSize:"2.2rem", textShadow:"0 2px 16px rgba(0,0,0,0.5)" }}>
          Intercambia lo<br />
          <span style={{ background:"linear-gradient(90deg,#10b981,#38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>que tienes.</span>
        </h1>
        <p className="text-white/65 text-base mb-6 leading-snug">Sin dinero. Haz match con alguien que quiera lo tuyo y tú lo suyo.</p>
        <button onClick={onSignUp} className="w-full py-4 rounded-2xl font-black text-lg text-white mb-3 transition-all active:scale-95" style={{ background:"linear-gradient(135deg,#10b981 0%,#059669 100%)", boxShadow:"0 8px 32px rgba(16,185,129,0.5)" }}>Crear cuenta gratis</button>
        <button onClick={onSignIn} className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95" style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)" }}>Ya tengo cuenta</button>
        <p className="text-center text-xs mt-4" style={{ color:"rgba(255,255,255,0.3)" }}>Al registrarte aceptas los Términos y Política de privacidad</p>
      </div>
    </div>
  );
}