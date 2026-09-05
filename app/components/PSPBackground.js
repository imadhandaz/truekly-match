"use client";
import { useEffect, useRef } from "react";

export default function PSPBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.0025; // very slow — PS style

      // ── Background gradient ────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, w * 0.4, h);
      bg.addColorStop(0,   "#062a20");
      bg.addColorStop(0.4, "#083548");
      bg.addColorStop(1,   "#0e4a62");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ── Wave ribbons (PSP-style smooth curved bands) ───────
      // Each ribbon = filled bezier shape with soft edge gradient

      const ribbons = [
        { yBase: 0.18, yThick: 0.13, cp1y: -0.05, cp2y: 0.30, phase: 0,    speed: 0.6, alpha: 0.20 },
        { yBase: 0.50, yThick: 0.11, cp1y:  0.35, cp2y: 0.62, phase: 1.2,  speed: 0.5, alpha: 0.17 },
        { yBase: 0.80, yThick: 0.10, cp1y:  0.65, cp2y: 0.92, phase: 2.4,  speed: 0.7, alpha: 0.13 },
      ];

      ribbons.forEach(r => {
        const breathe = Math.sin(t * r.speed + r.phase) * h * 0.035;
        const yTop    = r.yBase * h + breathe;
        const yBot    = yTop + r.yThick * h;
        const cy1     = r.cp1y * h + Math.sin(t * r.speed * 0.8 + r.phase) * h * 0.025;
        const cy2     = r.cp2y * h + Math.sin(t * r.speed * 0.6 + r.phase + 0.5) * h * 0.025;

        ctx.beginPath();
        // top edge
        ctx.moveTo(-w * 0.05, yTop);
        ctx.bezierCurveTo(w * 0.3, cy1, w * 0.7, cy2, w * 1.05, yTop + breathe * 0.3);
        // bottom edge (reversed)
        ctx.bezierCurveTo(w * 0.7, cy2 + r.yThick * h, w * 0.3, cy1 + r.yThick * h, -w * 0.05, yBot);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, yTop, 0, yBot);
        grad.addColorStop(0,   `rgba(255,255,255,${r.alpha})`);
        grad.addColorStop(0.4, `rgba(255,255,255,${r.alpha * 0.7})`);
        grad.addColorStop(1,   `rgba(255,255,255,0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
