"use client";
import { useEffect, useState, useRef } from "react";
const slides = [
  { gradient: "linear-gradient(135deg,#10b981 0%,#0ea5e9 100%)", emoji: "📱", tag: "ESTA SEMANA", title: "Semana Tech", subtitle: "iPhones, Samsung y AirPods esperando tu oferta" },
  { gradient: "linear-gradient(135deg,#f59e0b 0%,#f97316 100%)", emoji: "👟", tag: "MÁS BUSCADO", title: "+200 zapatillas", subtitle: "Nike, Adidas, New Balance... ¡truekéalas ya!" },
  { gradient: "linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)", emoji: "🔥", tag: "TOP TRUEKES", title: "PS5 · MacBook · GoPro", subtitle: "Los más pedidos en Madrid ahora mismo" },
  { gradient: "linear-gradient(135deg,#0f766e 0%,#0891b2 100%)", emoji: "✅", tag: "100% SEGURO", title: "Perfiles verificados", subtitle: "Intercambia con total confianza" },
];
export default function AnnouncementBanner({ onSlideClick }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);
  const goTo = (idx) => { setFading(true); setTimeout(() => { setCurrent(idx); setFading(false); }, 180); };
  useEffect(() => {
    timerRef.current = setInterval(() => { goTo((current + 1) % slides.length); }, 3800);
    return () => clearInterval(timerRef.current);
  }, [current]);
  const slide = slides[current];
  return (
    <div className="w-full max-w-sm mb-4">
      <button onClick={() => onSlideClick?.()} className="relative w-full overflow-hidden rounded-2xl text-left transition-all active:scale-[0.98]"
        style={{ height: 118, background: slide.gradient, transition: "background 0.5s ease", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
        <div style={{ position:"absolute", right:-24, top:-24, width:110, height:110, borderRadius:"50%", background:"rgba(255,255,255,0.12)" }} />
        <div style={{ position:"absolute", right:28, bottom:-32, width:85, height:85, borderRadius:"50%", background:"rgba(255,255,255,0.09)" }} />
        <div className="absolute inset-0 flex items-center px-5 gap-4"
          style={{ opacity: fading ? 0 : 1, transform: fading ? "translateX(8px)" : "translateX(0)", transition: "opacity 0.18s ease, transform 0.18s ease" }}>
          <span style={{ fontSize:44, lineHeight:1, flexShrink:0 }}>{slide.emoji}</span>
          <div className="flex-1 min-w-0">
            <span className="inline-block font-black tracking-widest mb-0.5" style={{ fontSize:9, color:"rgba(255,255,255,0.75)", letterSpacing:"0.14em" }}>{slide.tag}</span>
            <p className="text-white font-black text-lg leading-tight truncate">{slide.title}</p>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }} className="leading-tight mt-0.5">{slide.subtitle}</p>
          </div>
          <span style={{ color:"rgba(255,255,255,0.7)", fontSize:20, flexShrink:0 }}>›</span>
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {slides.map((_, i) => (<span key={i} style={{ display:"inline-block", width: i===current ? 20 : 6, height:6, borderRadius:3, background: i===current ? "white" : "rgba(255,255,255,0.4)", transition:"all 0.3s ease" }} />))}
        </div>
      </button>
    </div>
  );
}