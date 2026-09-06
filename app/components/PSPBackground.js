"use client";
import { useEffect, useRef } from "react";

export default function PSPBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId, t = 0;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const W = canvas.width, H = canvas.height;
      const isDark = document.documentElement.classList.contains("dark");
      const bg = ctx.createLinearGradient(0, 0, W, H);
      isDark ? (bg.addColorStop(0,"#062a20"),bg.addColorStop(1,"#071828"))
             : (bg.addColorStop(0,"#e8f5f0"),bg.addColorStop(1,"#e8f0f8"));
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      const ribbons = isDark ? [
        { yFrac:0.28,amp:0.09,speed:0.55,color:"rgba(52,211,153,1)",    glow:"#34d399",lw:12 },
        { yFrac:0.50,amp:0.11,speed:0.38,color:"rgba(56,189,248,1)",    glow:"#38bdf8",lw:10 },
        { yFrac:0.68,amp:0.07,speed:0.75,color:"rgba(110,231,183,0.95)",glow:"#6ee7b7",lw:8  },
        { yFrac:0.83,amp:0.06,speed:0.45,color:"rgba(56,189,248,0.9)",  glow:"#38bdf8",lw:6  },
      ] : [
        { yFrac:0.28,amp:0.09,speed:0.55,color:"rgba(16,185,129,0.95)", glow:"#10b981",lw:12 },
        { yFrac:0.50,amp:0.11,speed:0.38,color:"rgba(14,165,233,0.9)",  glow:"#0ea5e9",lw:10 },
        { yFrac:0.68,amp:0.07,speed:0.75,color:"rgba(52,211,153,0.85)", glow:"#34d399",lw:8  },
        { yFrac:0.83,amp:0.06,speed:0.45,color:"rgba(14,165,233,0.8)",  glow:"#0ea5e9",lw:6  },
      ];

      ribbons.forEach(r => {
        const cy  = H*r.yFrac + Math.sin(t*r.speed)*H*r.amp;
        const cp1 = cy - Math.cos(t*r.speed*0.7)*H*r.amp*1.6;
        const cp2 = cy + Math.sin(t*r.speed*0.5+1)*H*r.amp*1.3;
        const ey  = cy + Math.sin(t*r.speed*0.3+2)*H*r.amp;
        const path = () => { ctx.beginPath(); ctx.moveTo(0,cy); ctx.bezierCurveTo(W*.33,cp1,W*.66,cp2,W,ey); ctx.lineCap="round"; };
        path(); ctx.lineWidth=r.lw*8;  ctx.strokeStyle=r.glow+"22"; ctx.shadowBlur=0;  ctx.stroke();
        path(); ctx.lineWidth=r.lw*3;  ctx.strokeStyle=r.glow+"55"; ctx.shadowColor=r.glow; ctx.shadowBlur=40; ctx.stroke();
        path(); ctx.lineWidth=r.lw;    ctx.strokeStyle=r.color;     ctx.shadowColor=r.glow; ctx.shadowBlur=60; ctx.stroke();
      });
      ctx.shadowBlur = 0;

      t += 0.008;
      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:"fixed",top:0,left:0,width:"100%",height:"100%",
      zIndex:-1,pointerEvents:"none",
    }} />
  );
}
