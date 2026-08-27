"use client";

import { useEffect, useState } from "react";

const SWAP_CARDS = [
  { id:1, photo:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center", title:"iPhone 14 Pro", category:"Móviles", user:"Carlos, Madrid", rotate:"-7deg", tx:"-22px", ty:"16px", z:1 },
  { id:2, photo:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center", title:"Nike Air Max", category:"Moda", user:"Lucía, Salamanca", rotate:"5deg", tx:"16px", ty:"6px", z:2 },
  { id:3, photo:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center", title:"Bici de montaña", category:"Deportes", user:"Andrés, Getafe", rotate:"-1deg", tx:"0px", ty:"0px", z:3 },
];

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: "#0b0f0e" }}>
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1080&q=80" alt="" className="w-full h-full object-cover" style={{ opacity: 0.18 }} loading="eager" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,15,14,0.55) 0%, rgba(11,15,14,0.2) 30%, rgba(11,15,14,0.85) 65%, #0b0f0e 100%)" }} />
      </div>
      <div className="relative z-10 flex items-center justify-between px-5 pt-12" style={{ opacity: loaded?1:0, transform: loaded?"none":"translateY(-10px)", transition:"all 0.55s ease" }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#10b981,#0ea5e9)" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-white font-black text-lg tracking-tight">Truekly</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.35)", color:"#34d399" }}>📍 Madrid</span>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center" style={{ opacity:loaded?1:0, transform:loaded?"none":"translateY(18px)", transition:"all 0.65s ease 0.12s" }}>
        <div className="relative" style={{ width:"230px", height:"290px" }}>
          {SWAP_CARDS.map((card, i) => (
            <div key={card.id} className="absolute inset-0 rounded-3xl overflow-hidden" style={{ transform:`rotate(${card.rotate}) translateX(${card.tx}) translateY(${card.ty})`, zIndex:card.z, boxShadow:i===2?"0 24px 60px rgba(0,0,0,0.65)":"0 8px 24px rgba(0,0,0,0.45)", opacity:i===0?0.55:i===1?0.78:1 }}>
              <img src={card.photo} alt={card.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,rgba(0,0,0,0.05) 40%,rgba(0,0,0,0.82) 100%)" }} />
              <div className="absolute top-3 left-3"><span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:"rgba(16,185,129,0.85)",color:"white" }}>{card.category}</span></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-black text-base leading-tight">{card.title}</p>
                <p className="text-white/60 text-xs mt-0.5">{card.user}</p>
                {i===2&&(<div className="flex gap-2 mt-3"><button className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background:"rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.85)" }}>Pasar</button><button className="flex-1 py-2 rounded-xl text-xs font-bold text-white" style={{ background:"linear-gradient(135deg,#10b981,#059669)" }}>¡Match!</button></div>)}
              </div>
            </div>
          ))}
          <div className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ top:"10px",right:"-24px",zIndex:10,background:"linear-gradient(135deg,#10b981,#059669)",boxShadow:"0 6px 20px rgba(16,185,129,0.5)",opacity:loaded?1:0,transform:loaded?"scale(1) rotate(6deg)":"scale(0.4) rotate(6deg)",transition:"all 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.75s" }}>
            <span style={{ fontSize:"13px" }}>🔥</span><span className="text-white text-xs font-black">¡Match!</span>
          </div>
        </div>
      </div>
      <div className="relative z-10 px-6 pb-10" style={{ opacity:loaded?1:0, transform:loaded?"none":"translateY(24px)", transition:"all 0.6s ease 0.28s" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            {["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=60&h=60&fit=crop&crop=face","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&crop=face","https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"].map((src,i)=>(<img key={i} src={src} alt="" className="w-8 h-8 rounded-full object-cover" style={{ border:"2px solid #0b0f0e" }} />))}
          </div>
          <p className="text-white/60 text-sm"><span className="text-white font-bold">+2.400</span> trueques en Madrid</p>
        </div>
        <h1 className="text-white font-black leading-none mb-1" style={{ fontSize:"2.1rem" }}>Intercambia</h1>
        <h1 className="font-black leading-none mb-4" style={{ fontSize:"2.1rem",background:"linear-gradient(90deg,#10b981,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>lo que tienes.</h1>
        <div className="flex gap-2 mb-6 flex-wrap">
          {["⚡ Sin dinero","🔄 Haz match","✅ 100% gratis"].map((f)=>(<span key={f} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.65)" }}>{f}</span>))}
        </div>
        <button onClick={onSignUp} className="w-full py-4 rounded-2xl font-black text-lg text-white mb-3 transition-all active:scale-95" style={{ background:"linear-gradient(135deg,#10b981 0%,#059669 100%)",boxShadow:"0 8px 32px rgba(16,185,129,0.45)" }}>Empezar gratis</button>
        <button onClick={onSignIn} className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95" style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.6)" }}>Ya tengo cuenta</button>
        <p className="text-center text-xs mt-3" style={{ color:"rgba(255,255,255,0.22)" }}>Al registrarte aceptas los Términos y Política de privacidad</p>
      </div>
    </div>
  );
}