"use client";
import { useState, useEffect } from "react";

const SLIDES = [
  {
    emoji: "📦",
    gradient: "linear-gradient(135deg,#10b981 0%,#059669 100%)",
    title: "Sube lo que tienes",
    body: "Fotos, descripción y lo que quieres a cambio. En menos de 2 minutos tu producto está listo para encontrar su match.",
    accent: "#10b981",
  },
  {
    emoji: "👀",
    gradient: "linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)",
    title: "Descubre productos",
    body: "Desliza para ver lo que otros ofrecen. Desliza a la derecha si te interesa, a la izquierda si no. Como Tinder, pero para trueques.",
    accent: "#0ea5e9",
  },
  {
    emoji: "🤝",
    gradient: "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
    title: "¡Match!",
    body: "Cuando tú quieres su producto y él quiere el tuyo… ¡es un match! Os conectamos para que podáis hablar y cerrar el trato.",
    accent: "#8b5cf6",
  },
  {
    emoji: "🚀",
    gradient: "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)",
    title: "¡Truekea!",
    body: "Queda con la otra persona, intercambiad y listo. Sin dinero de por medio, solo valor por valor. Bienvenido a Truekly.",
    accent: "#f59e0b",
    last: true,
  },
];

export default function OnboardingScreen({ onDone }) {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const slide = SLIDES[idx];

  const advance = () => {
    if (animating) return;
    if (idx < SLIDES.length - 1) {
      setAnimating(true);
      setTimeout(() => { setIdx(i => i + 1); setAnimating(false); }, 220);
    } else {
      onDone();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden" style={{background:slide.gradient,transition:"background 400ms"}}>
      {/* Skip */}
      <div className="w-full flex justify-end px-6 pt-14">
        {!slide.last && (
          <button onClick={onDone} className="text-white/70 text-sm font-semibold px-3 py-1.5 rounded-full" style={{background:"rgba(255,255,255,0.15)"}}>
            Saltar
          </button>
        )}
      </div>

      {/* Visual */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          key={idx}
          className="text-[100px] mb-8 select-none"
          style={{transition:"opacity 220ms,transform 220ms",opacity:animating?0:1,transform:animating?"scale(0.85) translateY(16px)":"scale(1) translateY(0)"}}
        >
          {slide.emoji}
        </div>
        <div
          key={"t"+idx}
          style={{transition:"opacity 220ms,transform 220ms",opacity:animating?0:1,transform:animating?"translateY(12px)":"translateY(0)"}}
        >
          <h1 className="text-4xl font-black text-white mb-4 leading-tight">{slide.title}</h1>
          <p className="text-white/85 text-lg leading-relaxed max-w-xs mx-auto">{slide.body}</p>
        </div>
      </div>

      {/* Dots + CTA */}
      <div className="w-full px-8 pb-16 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>setIdx(i)} className="rounded-full transition-all cursor-pointer"
              style={{width:i===idx?24:8,height:8,background:i===idx?"white":"rgba(255,255,255,0.35)"}}/>
          ))}
        </div>
        <button
          onClick={advance}
          className="w-full max-w-xs py-4 rounded-2xl font-black text-xl transition-all active:scale-95"
          style={{background:"white",color:slide.accent,boxShadow:"0 12px 32px rgba(0,0,0,0.25)"}}
        >
          {slide.last ? "¡Empezar!" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}
