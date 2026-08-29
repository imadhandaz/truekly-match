"use client";
import { useEffect, useState, useRef } from "react";
const slides = [
  { gradient:"linear-gradient(135deg,#10b981 0%,#0ea5e9 100%)", emoji:"📱", tag:"ESTA SEMANA", title:"Semana Tech", subtitle:"iPhones, Samsung y AirPods esperando tu oferta" },
  { gradient:"linear-gradient(135deg,#f59e0b 0%,#f97316 100%)", emoji:"👟", tag:"MÁS BUSCADO", title:"+200 zapatillas", subtitle:"Nike, Adidas, New Balance... ¡truekéalas ya!" },
  { gradient:"linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)", emoji:"🔥", tag:"TOP TRUEKES", title:"PS5 · MacBook · GoPro", subtitle:"Los más pedidos ahora mismo en España" },
  { gradient:"linear-gradient(135deg,#0f766e 0%,#0891b2 100%)", emoji:"✅", tag:"100% SEGURO", title:"Perfiles verificados", subtitle:"Intercambia con total confianza" },
  { gradient:"linear-gradient(135deg,#dc2626 0%,#7c3aed 100%)", emoji:"🎮", tag:"GAMING", title:"Consolas y videojuegos", subtitle:"Switch, Xbox, PS5 y juegos en busca de dueño" },
  { gradient:"linear-gradient(135deg,#db2777 0%,#f59e0b 100%)", emoji:"👗", tag:"MODA", title:"Ropa de marca sin usar", subtitle:"Zara, Pull&Bear, Mango... ¡truekealo!" },
  { gradient:"linear-gradient(135deg,#1d4ed8 0%,#6d28d9 100%)", emoji:"📸", tag:"FOTOGRAFÍA", title:"Cámaras y objetivos", subtitle:"Sony, Canon, GoPro · drones incluidos" },
  { gradient:"linear-gradient(135deg,#065f46 0%,#1e40af 100%)", emoji:"🎵", tag:"MÚSICA", title:"Guitarras y auriculares", subtitle:"Fender, Gibson, Sony WH... ¡truékalos!" },
  { gradient:"linear-gradient(135deg,#92400e 0%,#b45309 100%)", emoji:"🚴", tag:"DEPORTE", title:"Material deportivo", subtitle:"Bicis, pesas, ropa técnica... intercambia ya" },
  { gradient:"linear-gradient(135deg,#0369a1 0%,#0f766e 100%)", emoji:"🏠", tag:"HOGAR", title:"Deco y electrohogar", subtitle:"Lámparas, plantas, Air Fryers y mucho más" },
  { gradient:"linear-gradient(135deg,#f97316 0%,#ef4444 100%)", emoji:"🌴", tag:"INTERCAMBIO DE CASAS", title:"Tu casa por la suya", subtitle:"¿Vives en Barcelona y quieres Málaga? ¡Trueká tu casa!" },
  { gradient:"linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)", emoji:"🏡", tag:"VACACIONES SIN COSTE", title:"Casas por toda España", subtitle:"Madrid, Sevilla, Valencia, Bilbao... ¡sin pagar hotel!" },
  { gradient:"linear-gradient(135deg,#10b981 0%,#84cc16 100%)", emoji:"🌍", tag:"TRUEQUE INTERNACIONAL", title:"Intercambia en todo el mundo", subtitle:"Francia, Italia, UK, EEUU... Truekly no tiene fronteras" },
  { gradient:"linear-gradient(135deg,#374151 0%,#1f2937 100%)", emoji:"🚗", tag:"COCHES Y MOTOS", title:"Intercambia tu vehículo", subtitle:"Busca tu próximo coche o moto haciendo trueque" },
  { gradient:"linear-gradient(135deg,#7c3aed 0%,#db2777 100%)", emoji:"🛵", tag:"MOVILIDAD", title:"Scooters y bicis eléctricas", subtitle:"Cambia tu forma de moverte por la ciudad" },
  { gradient:"linear-gradient(135deg,#16a34a 0%,#15803d 100%)", emoji:"⚽", tag:"ENCUENTRA EQUIPO", title:"Pachanga de fútbol", subtitle:"¿Te faltan jugadores? Encuentra tu once donde estés" },
  { gradient:"linear-gradient(135deg,#ea580c 0%,#dc2626 100%)", emoji:"🏀", tag:"BALONCESTO", title:"Busca 5 para jugar", subtitle:"Completa tu equipo y reserva pista este finde" },
  { gradient:"linear-gradient(135deg,#0284c7 0%,#7c3aed 100%)", emoji:"🎾", tag:"TENIS · PÁDEL", title:"Encuentra pareja de juego", subtitle:"Nivel similar, misma zona — ¡a por ello!" },
  { gradient:"linear-gradient(135deg,#be123c 0%,#9f1239 100%)", emoji:"🏋️", tag:"ENTRENA CON ALGUIEN", title:"Compañero de gym", subtitle:"Running, crossfit, natación... busca tu partner" },
  { gradient:"linear-gradient(135deg,#0e7490 0%,#1d4ed8 100%)", emoji:"🏊", tag:"DEPORTES ACUÁTICOS", title:"Surf, kayak y natación", subtitle:"Encuentra con quien practicar en tu ciudad o playa" },
];
export default function AnnouncementBanner({ onSlideClick }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);
  const goTo = (idx) => { setFading(true); setTimeout(() => { setCurrent(idx); setFading(false); }, 180); };
  useEffect(() => {
    timerRef.current = setInterval(() => { goTo((current + 1) % slides.length); }, 3600);
    return () => clearInterval(timerRef.current);
  }, [current]);
  const slide = slides[current];
  return (
    <div className="w-full max-w-sm mb-4">
      <button onClick={() => onSlideClick?.()} className="relative w-full overflow-hidden rounded-2xl text-left transition-all active:scale-[0.98]"
        style={{ height:118, background:slide.gradient, transition:"background 0.6s ease", boxShadow:"0 8px 24px rgba(0,0,0,0.18)" }}>
        <div style={{ position:"absolute", right:-24, top:-24, width:110, height:110, borderRadius:"50%", background:"rgba(255,255,255,0.12)" }} />
        <div style={{ position:"absolute", right:28, bottom:-32, width:85, height:85, borderRadius:"50%", background:"rgba(255,255,255,0.09)" }} />
        <div style={{ position:"absolute", left:-12, bottom:-18, width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div className="absolute inset-0 flex items-center px-5 gap-4"
          style={{ opacity:fading?0:1, transform:fading?"translateX(8px)":"translateX(0)", transition:"opacity 0.18s ease, transform 0.18s ease" }}>
          <span style={{ fontSize:44, lineHeight:1, flexShrink:0 }}>{slide.emoji}</span>
          <div className="flex-1 min-w-0">
            <span className="inline-block font-black tracking-widest mb-0.5" style={{ fontSize:9, color:"rgba(255,255,255,0.75)", letterSpacing:"0.14em" }}>{slide.tag}</span>
            <p className="text-white font-black text-lg leading-tight truncate">{slide.title}</p>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }} className="leading-tight mt-0.5 line-clamp-2">{slide.subtitle}</p>
          </div>
          <span style={{ color:"rgba(255,255,255,0.7)", fontSize:20, flexShrink:0 }}>›</span>
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {slides.map((_,i) => (<span key={i} style={{ display:"inline-block", width:i===current?20:6, height:6, borderRadius:3, background:i===current?"white":"rgba(255,255,255,0.4)", transition:"all 0.3s cubic-bezier(0.34,1.2,0.64,1)" }} />))}
        </div>
      </button>
    </div>
  );
}