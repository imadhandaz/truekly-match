"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [phase, setPhase] = useState(0); // 0=hidden, 1=image, 2=overlays, 3=panel

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 80);
    const t2 = setTimeout(() => setPhase(2), 550);
    const t3 = setTimeout(() => setPhase(3), 950);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const particles = [
    { size: 6, left: "14%", top: "22%", color: "#10b981", delay: 0.2, dur: 3.2 },
    { size: 4, left: "78%", top: "38%", color: "#0ea5e9", delay: 0.5, dur: 2.8 },
    { size: 5, left: "42%", top: "62%", color: "#10b981", delay: 0.1, dur: 3.6 },
    { size: 3, left: "88%", top: "18%", color: "#0ea5e9", delay: 0.7, dur: 2.5 },
    { size: 7, left: "22%", top: "78%", color: "#34d399", delay: 0.3, dur: 4.0 },
    { size: 4, left: "62%", top: "48%", color: "#38bdf8", delay: 0.9, dur: 3.0 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: "#080f0c" }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            background: p.color,
            opacity: phase >= 2 ? 0.8 : 0,
            transition: `opacity 1s ease ${p.delay}s`,
            animation: phase >= 2
              ? `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`
              : "none",
            boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
          }}
        />
      ))}

      <div className="relative flex-none overflow-hidden" style={{ height: "67vh" }}>
        <img
          src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=900&h=1400&fit=crop&crop=faces,center"
          alt="Personas intercambiando"
          className="w-full h-full object-cover"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1)" : "scale(1.05)",
            transition: "opacity 1s ease, transform 1.4s cubic-bezier(0.2,0.8,0.2,1)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 60%, transparent 25%, rgba(0,0,0,0.55) 100%)" }} />
        <div className="absolute top-0 left-0 right-0" style={{ height: "48%", background: "linear-gradient(to bottom, rgba(8,15,12,0.9) 0%, rgba(8,15,12,0.4) 60%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "42%", background: "linear-gradient(to bottom, transparent, rgba(8,15,12,0.98))" }} />

        <div
          className="absolute top-0 left-0 right-0 flex flex-col items-center"
          style={{
            paddingTop: "12%",
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(-14px)",
            transition: "opacity 0.8s ease 0.25s, transform 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.25s",
          }}
        >
          <div
            className="relative w-[72px] h-[72px] rounded-[24px] flex items-center justify-center mb-3"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 40%, #0ea5e9 100%)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.18), 0 8px 40px rgba(16,185,129,0.55), 0 0 80px rgba(16,185,129,0.2)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 8h14M15 5l4 3-4 3M19 16H5M9 19l-4-3 4-3" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {phase >= 2 && (
              <div className="absolute inset-0 rounded-[24px]" style={{ animation: "glow-pulse 2.8s ease-out 1.2s infinite" }} />
            )}
          </div>

          <span
            className="text-white font-black leading-none"
            style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", fontSize: 54, letterSpacing: "-0.03em", textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}
          >
            Truekly
          </span>

          <div
            className="flex items-center gap-2.5 mt-2.5"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.6s ease 0.7s",
            }}
          >
            <div style={{ width: 28, height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.3))" }} />
            <span className="text-white/60 text-xs font-bold uppercase tracking-[0.22em]" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              Dale nueva vida a tus cosas
            </span>
            <div style={{ width: 28, height: 1, background: "linear-gradient(to left, transparent, rgba(255,255,255,0.3))" }} />
          </div>
        </div>

        <div
          className="absolute left-1/2"
          style={{ top: "42%", transform: "translateX(-50%)", opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.5s ease 1s" }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap"
            style={{ background: "rgba(16,185,129,0.12)", backdropFilter: "blur(16px)", border: "1px solid rgba(16,185,129,0.35)", boxShadow: "0 4px 24px rgba(16,185,129,0.18)" }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 1.6s ease-in-out infinite", boxShadow: "0 0 8px #10b981" }} />
            <span className="text-white text-xs font-bold">1.240 intercambios esta semana</span>
          </div>
        </div>

        <div
          className="absolute bottom-5 left-0 right-0 flex items-center justify-between px-4"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(14px)",
            transition: "all 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.65s",
          }}
        >
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=60&h=60&fit=crop" alt="iPhone" className="w-10 h-10 rounded-xl object-cover" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.35)" }} />
            <div>
              <p className="text-white text-xs font-black leading-tight">iPhone 14</p>
              <p className="text-emerald-400 text-[11px] font-semibold mt-0.5">ofrece →</p>
            </div>
          </div>

          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)", boxShadow: "0 4px 24px rgba(16,185,129,0.65), 0 0 0 3px rgba(255,255,255,0.08)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
            <div>
              <p className="text-white text-xs font-black leading-tight">Samsung S24</p>
              <p className="text-sky-400 text-[11px] font-semibold mt-0.5">← ofrece</p>
            </div>
            <img src="https://images.unsplash.com/photo-1567581935884-3349723552ca?w=60&h=60&fit=crop" alt="Samsung" className="w-10 h-10 rounded-xl object-cover" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.35)" }} />
          </div>
        </div>
      </div>

      <div
        className="flex-1 flex flex-col justify-center px-6 pb-10 pt-5 relative"
        style={{
          background: "#080f0c",
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.65s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      >
        <div className="absolute top-0 left-10 right-10" style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(16,185,129,0.45), rgba(14,165,233,0.45), transparent)" }} />

        <div className="text-center mb-6">
          <h2
            className="font-black text-white leading-tight mb-2"
            style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", fontSize: 30, letterSpacing: "-0.025em" }}
          >
            Intercambia lo que tienes
            <br />
            <span style={{ background: "linear-gradient(90deg, #10b981 0%, #0ea5e9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              por lo que quieres
            </span>
          </h2>
          <p className="text-white/45 text-sm font-medium">Sin dinero. Sin complicaciones. Solo trueques.</p>
        </div>

        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-2xl font-black text-lg text-white mb-3 relative overflow-hidden transition-all active:scale-95 hover:opacity-95"
          style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 45%, #0ea5e9 100%)", boxShadow: "0 10px 36px rgba(16,185,129,0.5), 0 2px 10px rgba(0,0,0,0.3)", fontFamily: "var(--font-jakarta), system-ui, sans-serif" }}
        >
          <span className="relative z-10">Empezar gratis</span>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)", animation: "shimmer-btn 3s ease-in-out 1.5s infinite" }} />
        </button>

        <button
          onClick={onSignIn}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
          style={{ color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", fontFamily: "var(--font-jakarta), system-ui, sans-serif" }}
        >
          Ya tengo cuenta
        </button>

        <div className="flex items-center justify-center gap-5 mt-5 mb-1">
          {[{ icon: "🔒", label: "100% seguro" }, { icon: "✓", label: "Verificado" }, { icon: "⚡", label: "Instantáneo" }].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-xs leading-none">{icon}</span>
              <span className="text-[11px] text-white/30 font-medium">{label}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] mt-3 text-white/25">
          Al continuar aceptas los{" "}
          <span className="text-white/40 underline underline-offset-2">Términos</span>
          {" "}y la{" "}
          <span className="text-white/40 underline underline-offset-2">Política de privacidad</span>
        </p>
      </div>
    </div>
  );
}
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

      {/* ===== FOTO GRANDE — ocupa ~68% de la pantalla ===== */}
      <div className="relative flex-none overflow-hidden" style={{ height: "68vh" }}>
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
        <div className="absolute top-0 left-0 right-0" style={{ height: "35%", background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)" }} />

        {/* ===== LOGO CENTRADO SOBRE LA FOTO (como Muzz) ===== */}
        <div
          className="absolute top-0 left-0 right-0 flex flex-col items-center"
          style={{ paddingTop: "14%", opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}
        >
          {/* Icono */}
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)", boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 0 3px rgba(255,255,255,0.15)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 8h14M15 5l4 3-4 3M19 16H5M9 19l-4-3 4-3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-black text-5xl tracking-tight" style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>Truekly</span>
          <span className="text-white/75 text-sm font-semibold mt-2 tracking-widest uppercase" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)", letterSpacing: "0.18em" }}>Dale nueva vida a tus cosas</span>
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
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
