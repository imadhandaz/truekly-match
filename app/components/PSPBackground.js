"use client";
import { useEffect, useRef } from "react";

export default function PSPBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId, t = 0;
    const imgs = [];

    const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supaUrl && supaKey) {
      fetch(`${supaUrl}/rest/v1/products?select=photos&active=eq.true&order=created_at.desc&limit=24`, {
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` }
      }).then(r => r.json()).then(data => {
        for (const p of (data || [])) {
          const url = p.photos?.[0];
          if (!url) continue;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = url;
          imgs.push(img);
        }
      }).catch(() => {});
    }

    const SIZE = 38;
    const particles = Array.from({ length: 4 }, (_, ri) =>
      Array.from({ length: 3 }, (_, pi) => ({
        pos: pi / 3 + Math.random() * 0.12,
        speed: 0.00050 + ri * 0.00006 + Math.random() * 0.00018,
        imgIdx: ri * 3 + pi,
      }))
    );

    function bezierPt(u, ax, ay, bx, by, cx, cy2, dx, dy) {
      const m = 1 - u;
      return { x: m*m*m*ax+3*m*m*u*bx+3*m*u*u*cx+u*u*u*dx, y: m*m*m*ay+3*m*m*u*by+3*m*u*u*cy2+u*u*u*dy };
    }

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
        { yFrac:0.28,amp:0.09,speed:0.55,color:"rgba(52,211,153,1)",   glow:"#34d399",lw:12 },
        { yFrac:0.50,amp:0.11,speed:0.38,color:"rgba(56,189,248,1)",   glow:"#38bdf8",lw:10 },
        { yFrac:0.68,amp:0.07,speed:0.75,color:"rgba(110,231,183,0.95)",glow:"#6ee7b7",lw:8  },
        { yFrac:0.83,amp:0.06,speed:0.45,color:"rgba(56,189,248,0.9)", glow:"#38bdf8",lw:6  },
      ] : [
        { yFrac:0.28,amp:0.09,speed:0.55,color:"rgba(16,185,129,0.95)",glow:"#10b981",lw:12 },
        { yFrac:0.50,amp:0.11,speed:0.38,color:"rgba(14,165,233,0.9)", glow:"#0ea5e9",lw:10 },
        { yFrac:0.68,amp:0.07,speed:0.75,color:"rgba(52,211,153,0.85)",glow:"#34d399",lw:8  },
        { yFrac:0.83,amp:0.06,speed:0.45,color:"rgba(14,165,233,0.8)", glow:"#0ea5e9",lw:6  },
      ];

      const curves = ribbons.map(r => {
        const cy  = H*r.yFrac + Math.sin(t*r.speed)*H*r.amp;
        const cp1 = cy - Math.cos(t*r.speed*0.7)*H*r.amp*1.6;
        const cp2 = cy + Math.sin(t*r.speed*0.5+1)*H*r.amp*1.3;
        const ey  = cy + Math.sin(t*r.speed*0.3+2)*H*r.amp;
        return { cy, cp1, cp2, ey };
      });

      // Draw ribbons
      ribbons.forEach((r, i) => {
        const { cy, cp1, cp2, ey } = curves[i];
        const path = () => { ctx.beginPath(); ctx.moveTo(0,cy); ctx.bezierCurveTo(W*.33,cp1,W*.66,cp2,W,ey); ctx.lineCap="round"; };
        path(); ctx.lineWidth=r.lw*8;  ctx.strokeStyle=r.glow+"22"; ctx.shadowBlur=0;  ctx.stroke();
        path(); ctx.lineWidth=r.lw*3;  ctx.strokeStyle=r.glow+"55"; ctx.shadowColor=r.glow; ctx.shadowBlur=40; ctx.stroke();
        path(); ctx.lineWidth=r.lw;    ctx.strokeStyle=r.color;     ctx.shadowColor=r.glow; ctx.shadowBlur=60; ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Draw product thumbnails flowing along ribbons
      if (imgs.length > 0) {
        ribbons.forEach((r, ri) => {
          const { cy, cp1, cp2, ey } = curves[ri];
          particles[ri].forEach(p => {
            p.pos += p.speed;
            if (p.pos > 1.15) { p.pos = -0.12; p.imgIdx = Math.floor(Math.random()*imgs.length); }
            if (p.pos < 0 || p.pos > 1) return;
            const pt = bezierPt(p.pos, 0,cy, W*.33,cp1, W*.66,cp2, W,ey);
            const img = imgs[p.imgIdx % imgs.length];
            if (!img?.complete || !img.naturalWidth) return;
            const s = SIZE, x = pt.x - s/2, y = pt.y - s/2;
            ctx.save();
            ctx.beginPath(); ctx.arc(pt.x,pt.y,s/2+3,0,Math.PI*2);
            ctx.strokeStyle=r.glow; ctx.lineWidth=2.5; ctx.shadowColor=r.glow; ctx.shadowBlur=16; ctx.stroke();
            ctx.beginPath(); ctx.arc(pt.x,pt.y,s/2,0,Math.PI*2); ctx.clip();
            ctx.drawImage(img,x,y,s,s);
            ctx.restore();
          });
        });
      }

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
