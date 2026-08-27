"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050f0a 0%, #071a12 50%, #050d14 100%)" }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-120px", left: "-80px",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-80px", right: "-60px",
          width: "350px", height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "40%", right: "-100px",
          width: "300px", height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-6 pt-14"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-12px)",
          transition: "all 0.6s ease",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-black text-lg tracking-tight">Truekly</span>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold tracking-wider"
          style={{
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#34d399",
          }}
        >
          MADRID
        </div>
      </div>

      {/* Hero cards stack */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center px-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease 0.15s",
        }}
      >
        <div className="relative" style={{ width: "260px", height: "300px" }}>
          {/* Card 3 — back */}
          <SwapCard
            emoji="🎮"
            title="PS5 Digital"
            tag="Consolas"
            rotate="-8deg"
            translateX="-18px"
            translateY="12px"
            opacity="0.5"
            scale="0.88"
            delay="0"
            color="#0ea5e9"
          />
          {/* Card 2 — middle */}
          <SwapCard
            emoji="📱"
            title="iPhone 14 Pro"
            tag="Móviles"
            rotate="4deg"
            translateX="14px"
            translateY="5px"
            opacity="0.75"
            scale="0.93"
            delay="0.1s"
            color="#10b981"
          />
          {/* Card 1 — front */}
          <SwapCard
            emoji="🚴"
            title="Bici eléctrica"
            tag="Deportes"
            rotate="-2deg"
            translateX="0px"
            translateY="0px"
            opacity="1"
            scale="1"
            delay="0.2s"
            color="#10b981"
            isFront
          />

          {/* Match badge */}
          <div
            className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              bottom: "20px",
              right: "-20px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 8px 24px rgba(16,185,129,0.45)",
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.5)",
              transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s",
            }}
          >
            <span className="text-sm">🔥</span>
            <span className="text-white text-xs font-bold">¡Match!</span>
          </div>
        </div>
      </div>

      {/* Text content */}
      <div
        className="relative z-10 px-6 pb-2"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.6s ease 0.3s",
        }}
      >
        <h1 className="text-white font-black leading-tight" style={{ fontSize: "2rem" }}>
          Intercambia<br />
          <span style={{ background: "linear-gradient(90deg, #10b981, #0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            lo que tienes
          </span>
          <br />
          <span className="text-white/70 font-bold text-2xl">por lo que quieres</span>
        </h1>

        {/* Feature pills */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {["⚡ Sin dinero", "🔄 Haz match", "✅ 100% gratis"].map((feat) => (
            <span
              key={feat}
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {feat}
            </span>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div
        className="relative z-10 px-6 pb-10 pt-5 flex flex-col gap-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.6s ease 0.42s",
        }}
      >
        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            boxShadow: "0 8px 32px rgba(16,185,129,0.4), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Empezar gratis
        </button>
        <button
          onClick={onSignIn}
          className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          Ya tengo cuenta
        </button>
        <p className="text-center text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
          Al registrarte aceptas los Términos y Política de privacidad
        </p>
      </div>
    </div>
  );
}

function SwapCard({ emoji, title, tag, rotate, translateX, translateY, opacity, scale, delay, color, isFront }) {
  return (
    <div
      className="absolute inset-0 rounded-3xl flex flex-col justify-between p-5"
      style={{
        transform: `rotate(${rotate}) translateX(${translateX}) translateY(${translateY}) scale(${scale})`,
        opacity,
        background: isFront
          ? "linear-gradient(145deg, #0d2018 0%, #0a1a14 100%)"
          : "linear-gradient(145deg, #0a1814 0%, #08130f 100%)",
        border: isFront
          ? `1px solid rgba(16,185,129,0.25)`
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isFront
          ? "0 24px 60px rgba(0,0,0,0.5), 0 4px 20px rgba(16,185,129,0.1)"
          : "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: `rgba(16,185,129,0.12)`,
            color: "#34d399",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          {tag}
        </span>
        {isFront && (
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400/60" />
            <div className="w-2 h-2 rounded-full bg-green-400/30" />
          </div>
        )}
      </div>

      {/* Emoji */}
      <div className="flex items-center justify-center flex-1">
        <span style={{ fontSize: "4rem", lineHeight: 1 }}>{emoji}</span>
      </div>

      {/* Bottom */}
      <div>
        <p className="text-white font-bold text-base leading-tight">{title}</p>
        {isFront && (
          <div className="flex gap-2 mt-2.5">
            <button
              className="flex-1 py-2 rounded-xl text-xs font-bold text-white/90"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Pasar
            </button>
            <button
              className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
            >
              ¡Match!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
