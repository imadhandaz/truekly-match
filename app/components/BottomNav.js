"use client";

import { useEffect, useRef } from "react";

const tabs = [
  {
    id: "discover",
    label: "Descubrir",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? "#10b981" : "currentColor"} strokeWidth="1.8"/>
        <path d="M16 8l-2.5 5.5L8 16l2.5-5.5L16 8z" fill={active ? "#10b981" : "currentColor"}/>
        <circle cx="12" cy="12" r="1.5" fill={active ? "#fff" : "currentColor"}/>
      </svg>
    ),
  },
  {
    id: "likes",
    label: "Likes",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill={active ? "#10b981" : "none"}
          stroke={active ? "#10b981" : "currentColor"}
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "matches",
    label: "Truekes",
    center: true,
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "chats",
    label: "Chats",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          fill={active ? "#10b981" : "none"}
          stroke={active ? "#10b981" : "currentColor"}
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Perfil",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? "#10b981" : "currentColor"} strokeWidth="1.8"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
          stroke={active ? "#10b981" : "currentColor"}
          strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function NavWaves() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const parent = canvas.parentElement;
    const resize = () => {
      canvas.width = parent.offsetWidth || 320;
      canvas.height = parent.offsetHeight || 70;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const WAVES = [
      { yR: 0.30, amp: 11, f1: 0.020, f2: 0.036, s1: 0.9, s2: 0.6, rgb: "16,185,129",  lw: 1.2, glow: 10 },
      { yR: 0.52, amp: 14, f1: 0.015, f2: 0.028, s1: 0.7, s2: 0.45, rgb: "56,189,248",  lw: 1.0, glow: 12 },
      { yR: 0.72, amp: 10, f1: 0.024, f2: 0.042, s1: 1.1, s2: 0.75, rgb: "167,139,250", lw: 0.9, glow: 9  },
    ];

    function getY(w, x, time) {
      return (
        w.yR * canvas.height
        + Math.sin(x * w.f1 + time * w.s1) * w.amp
        + Math.sin(x * w.f2 + time * w.s2) * w.amp * 0.42
      );
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      WAVES.forEach((w) => {
        // Soft fill
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = getY(w, x, t);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        const fill = ctx.createLinearGradient(0, 0, 0, canvas.height);
        fill.addColorStop(0, `rgba(${w.rgb},0.10)`);
        fill.addColorStop(1, `rgba(${w.rgb},0.02)`);
        ctx.fillStyle = fill;
        ctx.fill();

        // Glowing line
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = getY(w, x, t);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${w.rgb},0.55)`;
        ctx.lineWidth = w.lw;
        ctx.lineJoin = "round";
        ctx.shadowBlur = w.glow;
        ctx.shadowColor = `rgba(${w.rgb},0.9)`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 36, pointerEvents: "none" }}
    />
  );
}

export default function BottomNav({ active = "discover", onChange, matchCount = 0, likesCount = 0 }) {
  return (
    <nav
      className="fixed left-0 right-0 z-30 flex justify-center"
      style={{ bottom: 20 }}
    >
      <div
        className="flex items-center px-3"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "rgba(12,16,14,0.93)",
          backdropFilter: "blur(24px)",
          borderRadius: 36,
          boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07), 0 0 24px rgba(16,185,129,0.08)",
          padding: "6px 6px",
          gap: 2,
        }}
      >
        <NavWaves />
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          if (tab.center) {
            return (
              <button
                key={tab.id}
                onClick={() => onChange?.(tab.id)}
                className="relative flex flex-col items-center justify-center transition-all active:scale-90"
                style={{
                  zIndex: 1,
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: isActive
                    ? "linear-gradient(135deg,#10b981,#059669)"
                    : "linear-gradient(135deg,#1a2e26,#162620)",
                  boxShadow: isActive
                    ? "0 0 0 3px rgba(16,185,129,0.3), 0 8px 20px rgba(16,185,129,0.4)"
                    : "0 4px 12px rgba(0,0,0,0.3)",
                  margin: "0 4px",
                  flexShrink: 0,
                }}
              >
                {tab.icon(isActive)}
                {matchCount > 0 && (
                  <span
                    className="absolute flex items-center justify-center text-white font-black"
                    style={{
                      top: 2, right: 2,
                      minWidth: 18, height: 18,
                      borderRadius: 9,
                      fontSize: 10,
                      background: "#ef4444",
                      paddingInline: 4,
                      boxShadow: "0 2px 6px rgba(239,68,68,0.5)",
                    }}
                  >
                    {matchCount}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChange?.(tab.id)}
              className="relative flex flex-col items-center gap-0.5 transition-all active:scale-90"
              style={{
                zIndex: 1,
                minWidth: 56,
                padding: "8px 6px",
                borderRadius: 26,
                background: isActive ? "rgba(16,185,129,0.14)" : "transparent",
                color: isActive ? "#10b981" : "rgba(255,255,255,0.4)",
              }}
            >
              {tab.icon(isActive)}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: isActive ? "#10b981" : "rgba(255,255,255,0.35)",
                }}
              >
                {tab.label}
              </span>
              {tab.id === "likes" && likesCount > 0 && (
                <span
                  className="absolute flex items-center justify-center text-white font-black"
                  style={{
                    top: 4, right: 8,
                    minWidth: 16, height: 16,
                    borderRadius: 8,
                    fontSize: 9,
                    background: "linear-gradient(135deg,#f59e0b,#f97316)",
                    paddingInline: 3,
                  }}
                >
                  {likesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
