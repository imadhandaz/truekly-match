"use client";

import { useEffect, useState } from "react";

const CONFETTI_COLORS = [
  "#4ade80", "#60a5fa", "#fbbf24", "#f472b6",
  "#a78bfa", "#34d399", "#fb923c", "#38bdf8",
];

function Confetti() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 1.5,
        duration: Math.random() * 2 + 2,
      }))
    );
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: "-10px",
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: "50%",
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in both`,
            boxShadow: `0 0 ${p.size}px ${p.color}80`,
          }}
        />
      ))}
    </div>
  );
}
export default function MatchModal({ myProduct, theirProduct, onClose, onChat }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.18), rgba(0,0,0,0.94) 70%)",
        backdropFilter: "blur(20px)",
        padding: "0 16px",
      }}
    >
      <Confetti />

      <div
        className="animate-match-pop"
        style={{
          background: "linear-gradient(to bottom, rgba(10,20,15,0.98), rgba(10,10,12,0.98))",
          borderRadius: 28,
          padding: "32px 24px 28px",
          border: "1px solid rgba(16,185,129,0.2)",
          boxShadow: "0 0 60px rgba(16,185,129,0.15), 0 24px 80px rgba(0,0,0,0.6)",
          maxWidth: 360,
          width: "100%",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.85)",
          transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ fontSize: 44, marginBottom: 12, lineHeight: 1 }}>🎉</div>
        <h2 style={{
          fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #10b981, #0ea5e9)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 8, marginTop: 0,
        }}>
          ¡Es un Match!
        </h2>
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 24, marginTop: 0,
        }}>
          Tú tienes lo que{" "}
          <strong style={{ color: "rgba(255,255,255,0.85)" }}>{theirProduct.owner}</strong>
          {" "}busca{" · "}
          <strong style={{ color: "rgba(255,255,255,0.85)" }}>{theirProduct.owner}</strong>
          {" "}tiene lo que tú buscas
        </p>
        {/* Product cards */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, justifyContent: "center" }}>
          {/* My product */}
          <div style={{ flex: 1, maxWidth: 120 }}>
            {myProduct.photos?.[0] ? (
              <img
                src={myProduct.photos[0]}
                alt={myProduct.title}
                style={{
                  width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 16,
                  border: "2px solid rgba(16,185,129,0.4)",
                  display: "block",
                }}
              />
            ) : (
              <div style={{
                width: "100%", aspectRatio: "1", borderRadius: 16,
                background: "rgba(16,185,129,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                border: "2px solid rgba(16,185,129,0.2)",
              }}>
                📦
              </div>
            )}
            <p style={{
              fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 6, marginBottom: 0, fontWeight: 600,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {myProduct.title || "Tu producto"}
            </p>
          </div>

          {/* Divider */}
          <div style={{ fontSize: 22, color: "#10b981", fontWeight: 900, flexShrink: 0, lineHeight: 1 }}>⇄</div>

          {/* Their product */}
          <div style={{ flex: 1, maxWidth: 120 }}>
            {theirProduct.photos?.[0] ? (
              <img
                src={theirProduct.photos[0]}
                alt={theirProduct.title}
                style={{
                  width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 16,
                  border: "2px solid rgba(14,165,233,0.4)",
                  display: "block",
                }}
              />
            ) : (
              <div style={{
                width: "100%", aspectRatio: "1", borderRadius: 16,
                background: "rgba(14,165,233,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                border: "2px solid rgba(14,165,233,0.2)",
              }}>
                📦
              </div>
            )}
            <p style={{
              fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 6, marginBottom: 0, fontWeight: 600,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {theirProduct.title}
            </p>
          </div>
        </div>
        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={onChat}
            style={{
              padding: "16px 0", borderRadius: 99, border: "none", cursor: "pointer", width: "100%",
              background: "linear-gradient(135deg, #10b981, #0ea5e9)",
              color: "#fff", fontSize: 16, fontWeight: 700,
              boxShadow: "0 6px 24px rgba(16,185,129,0.4)",
              transition: "all 0.2s ease",
            }}
            onMouseDown={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            onTouchStart={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onTouchEnd={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Enviar mensaje →
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "14px 0", borderRadius: 99,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "rgba(255,255,255,0.4)",
              fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  );
}
