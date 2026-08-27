"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background:"#0c0f0d" }}>
      <div className="relative flex-1 overflow-hidden" style={{ opacity:loaded?1:0, transition:"opacity 0.7s ease" }}>
        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=700&fit=crop&crop=right" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background:"linear-gradient(90deg, rgba(12,15,13,0) 60%, rgba(12,15,13,0.95) 100%)" }} />
          <div className="absolute inset-0" style={{ background:"linear-gradient(180deg, rgba(12,15,13,0.5) 0%, transparent 30%, rgba(12,15,13,0.7) 85%, rgba(12,15,13,1) 100%)" }} />
          <div className="absolute bottom-24 left-3"><div className="px-2.5 py-1 rounded-lg text-xs font-bold text-white" style={{ background:"rgba(16,185,129,0.85)" }}>📱 iPhone 14</div></div>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=700&fit=crop&crop=left" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background:"linear-gradient(270deg, rgba(12,15,13,0) 60%, rgba(12,15,13,0.95) 100%)" }} />
          <div className="absolute inset-0" style={{ background:"linear-gradient(180deg, rgba(12,15,13,0.5) 0%, transparent 30%, rgba(12,15,13,0.7) 85%, rgba(12,15,13,1) 100%)" }} />
          <div className="absolute bottom-24 right-3"><div className="px-2.5 py-1 rounded-lg text-xs font-bold text-white" style={{ background:"rgba(14,165,233,0.85)" }}>🎮 PS5</div></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center" style={{ opacity:loaded?1:0, transform:loaded?"scale(1)":"scale(0.5)", transition:"all 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s" }}>
          <div className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl" style={{ background:"rgba(12,15,13,0.75)", border:"1.5px solid rgba(16,185,129,0.4)", backdropFilter:"blur(12px)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12h18" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round"/></svg>
            <span className="text-xs font-black" style={{ color:"#34d399" }}>TRUEKLY</span>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-12 z-10" style={{ opacity:loaded?1:0, transform:loaded?"none":"translateY(-8px)", transition:"all 0.5s ease" }}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background:"linear-gradient(135deg,#10b981,#0ea5e9)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-white font-black text-lg tracking-tight drop-shadow-lg">Truekly</span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:"rgba(16,185,129,0.2)", border:"1px solid rgba(16,185,129,0.5)", color:"#6ee7b7", backdropFilter:"blur(8px)" }}>📍 Madrid</span>
        </div>
      </div>
      <div className="relative z-10 px-6 pt-4 pb-10" style={{ opacity:loaded?1:0, transform:loaded?"none":"translateY(20px)", transition:"all 0.6s ease 0.25s" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            {["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&h=80&fit=crop&crop=face","https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"].map((src,i)=>(<img key={i} src={src} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-black" />))}
          </div>
          <p className="text-white/75 text-sm"><span className="text-white font-bold">+2.400 personas</span> ya truekean</p>
        </div>
        <h1 className="text-white font-black leading-tight mb-1" style={{ fontSize:"1.9rem" }}>
          Intercambia lo que tienes{" "}
          <span style={{ background:"linear-gradient(90deg,#10b981,#38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>por lo que quieres.</span>
        </h1>
        <p className="text-white/55 text-sm mb-5 mt-1">Sin dinero. Solo haz match y truekea.</p>
        <button onClick={onSignUp} className="w-full py-4 rounded-2xl font-black text-lg text-white mb-3 transition-all active:scale-95" style={{ background:"linear-gradient(135deg,#10b981 0%,#059669 100%)", boxShadow:"0 8px 28px rgba(16,185,129,0.5)" }}>Crear cuenta gratis</button>
        <button onClick={onSignIn} className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95" style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.18)", color:"rgba(255,255,255,0.8)", backdropFilter:"blur(8px)" }}>Ya tengo cuenta</button>
        <p className="text-center text-xs mt-3" style={{ color:"rgba(255,255,255,0.25)" }}>Al registrarte aceptas los Términos y Política de privacidad</p>
      </div>
    </div>
  );
}