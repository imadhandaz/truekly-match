"use client";

import { useState, useRef } from "react";
import MatchModal from "./MatchModal";

const MY_PRODUCT = {
  title: "Tu producto",
  photos: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=80"],
  owner: "Tú",
};

export default function SwipeDeck({
  items,
  onMatch,
  onOpenChat,
  onSwipe,
  outOfSwipes,
  onUpgrade,
  userId,
}) {
  const [index, setIndex] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [decision, setDecision] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [matchedProduct, setMatchedProduct] = useState(null);
  const startRef = useRef({ x: 0, y: 0, t: 0 });

  const current = items[index];
  const next1 = items[index + 1];
  const next2 = items[index + 2];

  const onPointerDown = (e) => {
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
  };

  const onPointerUp = (e) => {
    if (!dragging) return;
    setDragging(false);
    const dt = Date.now() - startRef.current.t;
    const moved = Math.abs(drag.x) + Math.abs(drag.y);
    if (drag.x > 110) {
      commit("yes");
    } else if (drag.x < -110) {
      commit("no");
    } else if (moved < 8 && dt < 250) {
      handleTap(e);
      setDrag({ x: 0, y: 0 });
    } else {
      setDrag({ x: 0, y: 0 });
    }
  };

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.width;
    const currentPhotos = current?.photos || (current?.image ? [current.image] : []);
    if (x < w / 3 && currentPhotos.length > 1) {
      setPhotoIdx((p) => (p - 1 + currentPhotos.length) % currentPhotos.length);
    } else if (x > (w * 2) / 3 && currentPhotos.length > 1) {
      setPhotoIdx((p) => (p + 1) % currentPhotos.length);
    } else {
      setExpanded((v) => !v);
    }
  };

  const commit = (choice) => {
    if (outOfSwipes) { onUpgrade?.(); setDrag({ x: 0, y: 0 }); return; }
    setDecision(choice);
    onSwipe?.(current, choice);
    const positive = choice === "yes" || choice === "super";
    const swipePromise =
      positive && userId && current?.id
        ? (async () => {
            try {
              const { getSupabase } = await import("@/lib/supabase");
              const { data: { session } } = await getSupabase().auth.getSession();
              if (!session?.access_token) return null;
              const res = await fetch("/api/swipe", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
                body: JSON.stringify({ productId: current.id, choice }),
              });
              if (res.status === 429) { onUpgrade?.(); return null; }
              const data = await res.json();
              return data.matchId || null;
            } catch { return null; }
          })()
        : Promise.resolve(null);

    setTimeout(() => {
      swipePromise.then((matchId) => {
        let shouldMatch = false;
        if (positive) {
          if (userId) {
            shouldMatch = matchId !== null;
          } else {
            const chance = choice === "super" ? Math.min(1, (current.matchChance || 0.5) + 0.3) : current.matchChance || 0.5;
            shouldMatch = Math.random() < chance;
          }
        }
        if (shouldMatch) { const matchData = { ...current, matchId: matchId || null }; setMatchedProduct(matchData); onMatch?.(matchData); }
        setIndex((i) => i + 1);
        setPhotoIdx(0);
        setExpanded(false);
        setDrag({ x: 0, y: 0 });
        setDecision(null);
      });
    }, 250);
  };

  const closeMatch = () => setMatchedProduct(null);
  const angle = drag.x / 18;
  const yesOpacity = Math.min(Math.max(drag.x / 110, 0), 1);
  const noOpacity = Math.min(Math.max(-drag.x / 110, 0), 1);
  const exitTransform =
    decision === "yes" ? "translate(600px, -80px) rotate(25deg)"
    : decision === "no" ? "translate(-600px, -80px) rotate(-25deg)"
    : decision === "super" ? "translate(0, -700px) rotate(0deg) scale(0.6)"
    : `translate(${drag.x}px, ${drag.y}px) rotate(${angle}deg)`;

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="w-36 h-36 rounded-3xl mb-6 flex items-center justify-center shadow-2xl" style={{ background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)" }}>
          <span style={{ fontSize: 64 }}>🎉</span>
        </div>
        <h2 className="text-3xl font-black mb-3" style={{ background: "linear-gradient(135deg, #047857, #0369a1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ¡Has visto todo!
        </h2>
        <p className="text-foreground/60 text-base leading-relaxed max-w-xs">
          Has explorado todos los productos disponibles.<br />Vuelve más tarde a por nuevos trueques.
        </p>
        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          <div className="px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-xs text-foreground/50 font-semibold">🔄 Nuevos productos cada día</div>
          <div className="px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-xs text-foreground/50 font-semibold">📣 Sube más productos para más matches</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: "3/4.6" }}>
        {next2 && <Card item={next2} depth={2} photoIdx={0} />}
        {next1 && <Card item={next1} depth={1} photoIdx={0} />}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="absolute inset-0 select-none touch-none cursor-grab active:cursor-grabbing"
          style={{ transform: exitTransform, transition: dragging ? "none" : "transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1)", willChange: "transform" }}
        >
          <Card item={current} depth={0} yesOpacity={yesOpacity} noOpacity={noOpacity} photoIdx={photoIdx} expanded={expanded} />
        </div>
        <div className="absolute -bottom-28 left-0 right-0 flex justify-center items-end gap-5">
          <ActionButton onClick={() => commit("no")} label="NO" colorClass="from-red-50 to-white text-red-500 border-red-200" size="md">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </ActionButton>
          <ActionButton onClick={() => commit("super")} label="SUPER" colorClass="from-sky-50 to-white text-brand-blue-dark border-sky-200" size="md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </ActionButton>
          <ActionButton onClick={() => commit("yes")} label="SÍ" colorClass="from-brand-green to-brand-blue text-white border-transparent" size="lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </ActionButton>
        </div>
      </div>
      {matchedProduct && (
        <MatchModal myProduct={MY_PRODUCT} theirProduct={matchedProduct} onClose={closeMatch} onChat={() => { const p = matchedProduct; closeMatch(); onOpenChat?.(p); }} />
      )}
    </>
  );
}

function ActionButton({ children, onClick, label, size, colorClass }) {
  const isLg = size === "lg";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button onClick={onClick} className={`rounded-full bg-gradient-to-br ${colorClass} border-2 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all font-bold ${isLg ? "w-[72px] h-[72px]" : "w-14 h-14"}`}>
        {children}
      </button>
      <span className={`text-[10px] font-black tracking-widest uppercase ${isLg ? "text-foreground/70" : "text-foreground/40"}`}>{label}</span>
    </div>
  );
}

function Card({ item, depth, yesOpacity = 0, noOpacity = 0, photoIdx = 0, expanded = false }) {
  const scale = 1 - depth * 0.045;
  const translateY = depth * 14;
  const opacity = depth === 0 ? 1 : 0.95 - depth * 0.18;
  const photos = item.photos || [item.image];
  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden bg-white shadow-2xl" style={{ transform: `scale(${scale}) translateY(${translateY}px)`, opacity, zIndex: 10 - depth }}>
      <div className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-300" style={{ backgroundImage: `url('${photos[photoIdx]}')` }} />
      {depth === 0 && photos.length > 1 && (
        <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-20">
          {photos.map((_, i) => (
            <div key={i} className="flex-1 rounded-full" style={{ height: 3, background: i === photoIdx ? "white" : "rgba(255,255,255,0.3)", boxShadow: i === photoIdx ? "0 1px 4px rgba(0,0,0,0.4)" : "none", transition: "background 0.2s" }} />
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      {depth === 0 && (
        <>
          <div className="absolute top-16 left-5 px-5 py-2.5 rounded-2xl border-[3px] border-brand-green font-black text-2xl rotate-[-14deg] z-20 uppercase tracking-wide" style={{ opacity: yesOpacity, background: "rgba(255,255,255,0.97)", color: "#047857", boxShadow: "0 4px 20px rgba(16,185,129,0.35)" }}>ME INTERESA ✓</div>
          <div className="absolute top-16 right-5 px-5 py-2.5 rounded-2xl border-[3px] border-red-500 font-black text-2xl rotate-[14deg] z-20 uppercase tracking-wide" style={{ opacity: noOpacity, background: "rgba(255,255,255,0.97)", color: "#ef4444", boxShadow: "0 4px 20px rgba(239,68,68,0.35)" }}>PASO ✕</div>
        </>
      )}
      {item.gold && depth === 0 && (
        <div className="absolute top-10 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", boxShadow: "0 2px 12px rgba(245,158,11,0.5)" }}>✨ GOLD</div>
      )}
      <div className="absolute top-10 right-4 z-10 flex flex-col items-end gap-1.5">
        <span className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow" style={{ background: "rgba(255,255,255,0.95)", color: "#0369a1" }}>{item.category}</span>
        {item.neighborhood && <span className="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.9)" }}>📍 {item.neighborhood}</span>}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div className="flex items-end gap-2 mb-1">
          <h3 className="text-[28px] font-black leading-tight drop-shadow">{item.title}</h3>
          {item.storage && <span className="text-base font-light text-white/75 mb-0.5">{item.storage}</span>}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm text-white/85">Por <b className="text-white">{item.owner}</b></p>
          {item.verified && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[11px] font-black shadow" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }} title="Identidad verificada">✓</span>}
          {item.distance && <><span className="text-white/35 text-xs">·</span><p className="text-xs text-white/65">{item.distance}</p></>}
        </div>
        {expanded && (
          <div className="mb-4 animate-fadeIn">
            <p className="text-sm text-white/90 leading-relaxed mb-3">{item.description}</p>
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag) => <span key={tag} className="px-2.5 py-1 rounded-full text-xs border border-white/20 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.12)" }}>{tag}</span>)}
              </div>
            )}
            <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); const url = `https://truekly-match.vercel.app/p/${item.id}`; if (navigator.share) { navigator.share({ title: item.title, text: `Mira este trueque 🤝`, url }); } else { navigator.clipboard?.writeText(url).then(() => import("@/lib/toast").then(({ toast }) => toast("¡Link copiado!"))); } }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/80 hover:bg-white/25 transition border border-white/20" style={{ background: "rgba(255,255,255,0.12)" }}>🔗 Compartir</button>
          </div>
        )}
        <div className="rounded-2xl p-3.5 border border-brand-green/60" style={{ background: "rgba(16,185,129,0.18)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-brand-green text-sm">🔄</span>
            <p className="text-[10px] uppercase tracking-widest text-brand-green font-black">Lo cambia por</p>
          </div>
          <p className="text-base font-bold text-white">{item.wants}</p>
        </div>
        {!expanded && <p className="text-center text-[10px] text-white/45 mt-3 tracking-wide">Toca para detalles · Desliza laterales para fotos</p>}
      </div>
    </div>
  );
      }
