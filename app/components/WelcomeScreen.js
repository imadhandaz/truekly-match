"use client";

import { useEffect, useState } from "react";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 80);
    const t2 = setTimeout(() => setPhase(2), 450);
    const t3 = setTimeout(() => setPhase(3), 750);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const usps = [
    { icon: "💰", label: "Sin dinero" },
    { icon: "📦", label: "Sin envíos" },
    { icon: "🤝", label: "Sin comisión" },
  ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        minHeight: "var(--app-height, 100vh)",
        background: "radial-gradient(ellipse 100% 70% at 50% -5%, #0d2a1a 0%, #0A0A0C 55%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 52px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 36px)",
        overflowY: "auto",
      }}
    >
      <div key="dot1" style={{
        position: "absolute", borderRadius: "50%",
        width: 280, height: 280, top: "-60px", left: "-80px",
        background: "rgba(16,185,129,0.07)", filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div key="dot2" style={{
        position: "absolute", borderRadius: "50%",
        width: 220, height: 220, bottom: "10%", right: "-60px",
        background: "rgba(14,165,233,0.07)", filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 20, textAlign: "center", width: "100%",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(-16px)",
        transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.2,0.8,0.2,1)",
      }}>
        <div
          className="animate-float"
          style={{
            width: 88, height: 88, borderRadius: 26,
            background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 40,
            boxShadow: "0 8px 40px rgba(16,185,129,0.45), 0 0 0 1px rgba(16,185,129,0.2)",
          }}
        >
          🔄
        </div>

        <div>
          <h1
            className="text-display text-glow-green"
            style={{ color: "#fff", marginBottom: 8, marginTop: 0 }}
          >
            Truekly
          </h1>
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.45)",
            fontWeight: 400, letterSpacing: "0.02em", margin: 0,
          }}>
            Lo tuyo &nbsp;·&nbsp; por &nbsp;·&nbsp; lo suyo
          </p>
        </div>

        <div style={{
          display: "flex", gap: 10, marginTop: 4,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.1s",
        }}>
          {usps.map(({ icon, label }) => (
            <div key={label} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              padding: "12px 14px", borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              minWidth: 80,
            }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
              }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 16px", borderRadius: 99,
          background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.2)",
          marginTop: 4,
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 0.5s ease 0.25s",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#10b981", flexShrink: 0,
            boxShadow: "0 0 8px #10b981",
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#34d399" }}>
            +1.200 trueques completados en Madrid
          </span>
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          marginTop: 4,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.3s",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 16,
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=60&h=60&fit=crop"
              alt="iPhone"
              style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }}
            />
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>iPhone 14</p>
              <p style={{ fontSize: 11, color: "#34d399", margin: 0, marginTop: 2 }}>ofrece →</p>
            </div>
          </div>

          <div style={{
            width: 40, height: 40, borderRadius: 20, flexShrink: 0,
            background: "linear-gradient(135deg, #10b981, #0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(16,185,129,0.5)",
            fontSize: 18,
          }}>🔄</div>

          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 16,
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>Samsung S24</p>
              <p style={{ fontSize: 11, color: "#38bdf8", margin: 0, marginTop: 2 }}>← ofrece</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1567581935884-3349723552ca?w=60&h=60&fit=crop"
              alt="Samsung"
              style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      <div style={{
        width: "100%", maxWidth: 360,
        display: "flex", flexDirection: "column", gap: 12,
        opacity: phase >= 3 ? 1 : 0,
        transform: phase >= 3 ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.2,0.8,0.2,1)",
      }}>
        <button
          type="button"
          onClick={onSignUp}
          style={{
            width: "100%", padding: "17px 0", borderRadius: 99, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
            color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em",
            boxShadow: "0 8px 28px rgba(16,185,129,0.4)",
            transition: "all 0.2s ease", position: "relative", overflow: "hidden",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(16,185,129,0.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,185,129,0.4)"; }}
        >
          <span style={{ position: "relative", zIndex: 1 }}>Empezar gratis →</span>
        </button>

        <button
          type="button"
          onClick={onSignIn}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 99,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.45)", fontSize: 15, fontWeight: 500, cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
        >
          Ya tengo cuenta
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 4 }}>
          {[
            { icon: "🔒", label: "100% seguro" },
            { icon: "✓", label: "Verificado" },
            { icon: "⚡", label: "Instantáneo" },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 12 }}>{icon}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
          Al continuar aceptas los{" "}
          <span style={{ color: "rgba(255,255,255,0.35)", textDecoration: "underline", textUnderlineOffset: 2 }}>Términos</span>
          {" "}y la{" "}
          <span style={{ color: "rgba(255,255,255,0.35)", textDecoration: "underline", textUnderlineOffset: 2 }}>Privacidad</span>
        </p>
      </div>
    </div>
  );
}
