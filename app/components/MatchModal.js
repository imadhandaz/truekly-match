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
      Array.from({ length: 56 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 2,
        duration: Math.random() * 2.5 + 2,
      }))
    );
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: 32 }}>
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
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    /* OVERLAY */
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        padding: "24px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
      onClick={onClose}
    >
      {/* MODAL CARD */}
      <div
        className="animate-match-pop"
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 380,
          background: "linear-gradient(160deg, #0d2a1a 0%, #0A0A0C 60%)",
          borderRadius: 32,
          border: "1px solid rgba(16,185,129,0.28)",
          boxShadow: "0 0 100px rgba(16,185,129,0.14), 0 40px 100px rgba(0,0,0,0.75)",
          padding: "36px 28px 28px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Confetti />

        {/* Radial glow decoration */}
        <div style={{
          position: "absolute", top: -70, left: "50%", transform: "translateX(-50%)",
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Floating emoji */}
        <div
          className="animate-float"
          style={{ fontSize: 54, marginBottom: 14, lineHeight: 1, position: "relative", zIndex: 1 }}
        >
          🎉
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 36, fontWeight: 900, letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #10b981 0%, #38bdf8 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          margin: "0 0 10px",
          position: "relative", zIndex: 1,
        }}>
          ¡Es un Trueque!
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.42)",
          marginBottom: 32, marginTop: 0, lineHeight: 1.5,
          position: "relative", zIndex: 1,
        }}>
          Tú tienes lo que{" "}
          <span style={{ color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>
            {theirProduct?.owner || "el otro usuario"}
          </span>{" "}
          busca, y viceversa
        </p>

        {/* Circular product photos */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 32, position: "relative", zIndex: 1,
        }}>
          {/* My product */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 108, height: 108, borderRadius: "50%",
              border: "3px solid #10b981",
              boxShadow: "0 0 28px rgba(16,185,129,0.55), 0 0 56px rgba(16,185,129,0.2)",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.04))",
              flexShrink: 0,
            }}>
              {myProduct?.photos?.[0] ? (
                <img
                  src={myProduct.photos[0]}
                  alt={myProduct.title || "Tu producto"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
                }}>📦</div>
              )}
            </div>
            <p style={{
              fontSize: 11, fontWeight: 700, color: "#10b981",
              marginTop: 8, marginBottom: 0,
              maxWidth: 100, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {myProduct?.title || "Tu producto"}
            </p>
          </div>

          {/* Swap icon */}
          <div style={{
            width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "rgba(255,255,255,0.55)",
            margin: "0 -5px", marginBottom: 22,
            zIndex: 2,
          }}>⇄</div>

          {/* Their product */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 108, height: 108, borderRadius: "50%",
              border: "3px solid #0ea5e9",
              boxShadow: "0 0 28px rgba(14,165,233,0.55), 0 0 56px rgba(14,165,233,0.2)",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(14,165,233,0.04))",
              flexShrink: 0,
            }}>
              {theirProduct?.photos?.[0] ? (
                <img
                  src={theirProduct.photos[0]}
                  alt={theirProduct.title || "Su producto"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
                }}>📦</div>
              )}
            </div>
            <p style={{
              fontSize: 11, fontWeight: 700, color: "#38bdf8",
              marginTop: 8, marginBottom: 0,
              maxWidth: 100, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {theirProduct?.title || "Su producto"}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 1 }}>
          {/* Primary */}
          <button
            type="button"
            onClick={onChat}
            style={{
              padding: "17px 0", borderRadius: 99, border: "none", cursor: "pointer", width: "100%",
              background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
              color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em",
              boxShadow: "0 6px 28px rgba(16,185,129,0.42)",
              transition: "all 0.15s ease",
            }}
            onMouseDown={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            onTouchStart={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onTouchEnd={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            💬 Enviar mensaje
          </button>

          {/* Secondary */}
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "14px 0", borderRadius: 99,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "rgba(255,255,255,0.32)",
              fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.32)"; }}
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  );
}
