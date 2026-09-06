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
      const W = canvas.width;
      const H = canvas.height;

      // Dark teal-to-navy background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#062a20");
      bg.addColorStop(1, "#071828");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // 3 animated ribbon bezier curves
      const ribbons = [
        { yFrac: 0.38, amp: 0.09, speed: 0.55, color: "rgba(16,185,129,0.20)", lw: H * 0.20 },
        { yFrac: 0.58, amp: 0.11, speed: 0.38, color: "rgba(14,165,233,0.16)", lw: H * 0.24 },
        { yFrac: 0.74, amp: 0.07, speed: 0.75, color: "rgba(52,211,153,0.13)", lw: H * 0.16 },
      ];

      for (const r of ribbons) {
        const cy  = H * r.yFrac + Math.sin(t * r.speed) * H * r.amp;
        const cp1 = cy - Math.cos(t * r.speed * 0.7) * H * r.amp * 1.6;
        const cp2 = cy + Math.sin(t * r.speed * 0.5 + 1) * H * r.amp * 1.3;
        const ey  = cy + Math.sin(t * r.speed * 0.3 + 2) * H * r.amp;

        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.bezierCurveTo(W * 0.33, cp1, W * 0.66, cp2, W, ey);
        ctx.lineWidth = r.lw;
        ctx.strokeStyle = r.color;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      t += 0.008;
      rafId = requestAnimationFrame(draw); // loop
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
