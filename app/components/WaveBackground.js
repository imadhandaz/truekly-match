"use client";
import { useEffect, useRef } from "react";

export default function WaveBackground() {
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

    // PS-style flowing ribbon waves: multiple sine components per wave
    const WAVES = [
      { yR: 0.20, amp: 70,  f1: 0.0062, f2: 0.0115, s1: 0.50, s2: 0.33, rgb: "16,185,129",  lw: 2.2, glow: 24 },
      { yR: 0.37, amp: 90,  f1: 0.0046, f2: 0.0088,  s1: 0.42, s2: 0.26, rgb: "14,165,233",  lw: 2.6, glow: 28 },
      { yR: 0.53, amp: 58,  f1: 0.0078, f2: 0.0148,  s1: 0.66, s2: 0.48, rgb: "99,102,241",  lw: 2.0, glow: 22 },
      { yR: 0.67, amp: 76,  f1: 0.0053, f2: 0.0097,  s1: 0.36, s2: 0.60, rgb: "52,211,153",  lw: 1.6, glow: 18 },
      { yR: 0.82, amp: 48,  f1: 0.0092, f2: 0.0165,  s1: 0.78, s2: 0.44, rgb: "167,139,250", lw: 1.3, glow: 16 },
    ];

    function getY(w, x, time) {
      return (
        w.yR * canvas.height
        + Math.sin(x * w.f1 + time * w.s1) * w.amp
        + Math.sin(x * w.f2 + time * w.s2) * w.amp * 0.38
        + Math.cos(x * w.f1 * 0.6 + time * w.s2 * 0.8) * w.amp * 0.18
      );
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;

      WAVES.forEach((w) => {
        const step = 3;

        // Soft fill under the wave crest
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width + step; x += step) {
          const y = getY(w, x, t);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        const fillG = ctx.createLinearGradient(0, (w.yR - 0.12) * canvas.height, 0, canvas.height);
        fillG.addColorStop(0, `rgba(${w.rgb},0.08)`);
        fillG.addColorStop(1, `rgba(${w.rgb},0.01)`);
        ctx.fillStyle = fillG;
        ctx.fill();

        // Glowing ribbon line
        ctx.beginPath();
        for (let x = 0; x <= canvas.width + step; x += step) {
          const y = getY(w, x, t);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${w.rgb},0.5)`;
        ctx.lineWidth = w.lw;
        ctx.lineJoin = "round";
        ctx.shadowBlur = w.glow;
        ctx.shadowColor = `rgba(${w.rgb},0.75)`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="wave-bg"
    />
  );
}
