"use client";
import { useEffect, useRef } from "react";

export default function PSPBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId;
    let t = 0;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      const W = canvas.width, H = canvas.height;
      const isDark = document.documentElement.classList.contains("dark");
      const bg = ctx.createLinearGradient(0, 0, W, H);
      if (isDark) {
        bg.addColorStop(0, "#062a20");
        bg.addColorStop(1, "#071828");
      } else {
        bg.addColorStop(0, "#e8f5f0");
        bg.addColorStop(1, "#e8f0f8");
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      const ribbons = isDark ? [
        { yFrac: 0.38, amp: 0.09, speed: 0.55, color: "rgba(52,211,153,0.55)", glow: "rgba(16,185,129,0.7)",  lw: H * 0.08 },
        { yFrac: 0.58, amp: 0.11, speed: 0.38, color: "rgba(56,189,248,0.45)", glow: "rgba(14,165,233,0.65)", lw: H * 0.09 },
        { yFrac: 0.74, amp: 0.07, speed: 0.75, color: "rgba(110,231,183,0.40)", glow: "rgba(52,211,153,0.6)", lw: H * 0.07 },
      ] : [
        { yFrac: 0.38, amp: 0.09, speed: 0.55, color: "rgba(16,185,129,0.35)", glow: "rgba(16,185,129,0.5)",  lw: H * 0.08 },
        { yFrac: 0.58, amp: 0.11, speed: 0.38, color: "rgba(14,165,233,0.30)", glow: "rgba(14,165,233,0.45)", lw: H * 0.09 },
        { yFrac: 0.74, amp: 0.07, speed: 0.75, color: "rgba(52,211,153,0.28)", glow: "rgba(52,211,153,0.4)",  lw: H * 0.07 },
      ];
      for (const r of ribbons) {
        const cy = H * r.yFrac + Math.sin(t * r.speed) * H * r.amp;
        const cp1 = cy - Math.cos(t * r.speed * 0.7) * H * r.amp * 1.6;
        const cp2 = cy + Math.sin(t * r.speed * 0.5 + 1) * H * r.amp * 1.3;
        const ey = cy + Math.sin(t * r.speed * 0.3 + 2) * H * r.amp;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.bezierCurveTo(W * 0.33, cp1, W * 0.66, cp2, W, ey);
        ctx.lineWidth = r.lw;
        ctx.strokeStyle = r.color;
        ctx.shadowColor = r.glow;
        ctx.shadowBlur = 60;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      t += 0.008;
      rafId = requestAnimationFrame(draw);
    }
    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      zIndex: -1, pointerEvents: "none",
    }} />
  );
}
