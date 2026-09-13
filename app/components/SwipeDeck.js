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
    if (outOfSwipes) {
      onUpgrade?.();
      setDrag({ x: 0, y: 0 });
      return;
    }

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
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.access_token}`,
                },
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
            const chance =
              choice === "super"
                ? Math.min(1, (current.matchChance || 0.5) + 0.3)
                : current.matchChance || 0.5;
            shouldMatch = Math.random() < chance;
          }
        }

        if (shouldMatch) {
          const matchData = { ...current, matchId: matchId || null };
          setMatchedProduct(matchData);
          onMatch?.(matchData);
        }

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
  const yesOpacity = Math.min(Math.max(drag.x / 100, 0), 1);
  const noOpacity = Math.min(Math.max(-drag.x / 100, 0), 1);

  const exitTransform =
    decision === "yes"
      ? "translate(650px, -80px) rotate(28deg)"
      : decision === "no"
      ? "translate(-650px, -80px) rotate(-28deg)"
      : decision === "super"
      ? "translate(0, -750px) rotate(0deg) scale(0.5)"
      : `translate(${drag.x}px, ${drag.y * 0.4}px) rotate(${angle}deg)`;

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-16">
        <div
          className="w-36 h-36 rounded-3xl mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)" }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)", animation: "shimmer-btn 2.5s ease-in-out infinite" }} />
          <span style={{ fontSize: 64 }}>🎉</span>
        </div>
        <h2
          className="text-3xl font-black mb-3"
          style={{ background: "linear-gradient(135deg, #047857, #0369a1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          ¡Has visto todo!
        </h2>
        <p className="text-foreground/60 text-base leading-relaxed max-w-xs mb-8">
          Has explorado todos los productos disponibles. Vuelve más tarde o sube algo nuevo.
        </p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <div className="px-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 text-sm text-foreground/60 font-semibold flex items-center gap-2">
            <span>🔄</span> Nuevos productos cada día
          </div>
          <div className="px-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 text-sm text-foreground/60 font-semibold flex items-center gap-2">
            <span>📣</span> Sube más para conseguir más matches
          </div>
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
          style={{
            transform: exitTransform,
            transition: dragging ? "none" : "transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            willChange: "transform",
          }}
        >
          <Card
            item={current}
            depth={0}
            yesOpacity={yesOpacity}
            noOpacity={noOpacity}
            photoIdx={photoIdx}
            expanded={expanded}
            dragging={dragging}
            dragX={drag.x}
          />
        </div>

        {/* Action buttons */}
        <div className="absolute -bottom-28 left-0 right-0 flex justify-center items-end gap-5">
          <ActionButton onClick={() => commit("no")} label="PASO" type="no">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </ActionButton>
          <ActionButton onClick={() => commit("super")} label="SUPER" type="super">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </ActionButton>
          <ActionButton onClick={() => commit("yes")} label="SÍ" type="yes" large>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </ActionButton>
        </div>
      </div>

      {matchedProduct && (
        <MatchModal
          myProduct={MY_PRODUCT}
          theirProduct={matchedProduct}
          onClose={closeMatch}
          onChat={() => {
            const p = matchedProduct;
            closeMatch();
            onOpenChat?.(p);
          }}
        />
      )}
    </>
  );
}

function ActionButton({ children, onClick, label, type, large }) {
  const styles = {
    no: { bg: "linear-gradient(135deg, #fff5f5, #fff)", color: "#ef4444", border: "2px solid #fecaca", shadow: "0 8px 28px rgba(239,68,68,0.2), 0 2px 8px rgba(0,0,0,0.08)" },
    super: { bg: "linear-gradient(135deg, #f0f9ff, #fff)", color: "#0ea5e9", border: "2px solid #bae6fd", shadow: "0 8px 28px rgba(14,165,233,0.2), 0 2px 8px rgba(0,0,0,0.08)" },
    yes: { bg: "linear-gradient(135deg, #10b981, #059669, #0ea5e9)", color: "white", border: "none", shadow: "0 10px 36px rgba(16,185,129,0.5), 0 4px 12px rgba(0,0,0,0.15)" },
  };
  const s = styles[type];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={onClick}
        className="rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90"
        style={{
          width: large ? 72 : 56,
          height: large ? 72 : 56,
          background: s.bg,
          color: s.color,
          border: s.border,
          boxShadow: s.shadow,
        }}
      >
        {children}
      </button>
      <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: type === "yes" ? "#047857" : type === "no" ? "#ef4444" : "#0369a1", opacity: 0.7 }}>
        {label}
      </span>
    </div>
  );
}

function Card({ item, depth, yesOpacity = 0, noOpacity = 0, photoIdx = 0, expanded = false, dragging = false, dragX = 0 }) {
  const scale = 1 - depth * 0.045;
  const translateY = depth * 14;
  const opacity = depth === 0 ? 1 : 0.95 - depth * 0.18;
  const photos = item.photos || [item.image];

  const glowColor = yesOpacity > 0.1
    ? `rgba(16,185,129,${yesOpacity * 0.7})`
    : noOpacity > 0.1
    ? `rgba(239,68,68,${noOpacity * 0.7})`
    : "transparent";

  return (
    <div
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        zIndex: 10 - depth,
        background: "#1a1a1a",
        boxShadow: depth === 0 && (yesOpacity > 0.1 || noOpacity > 0.1)
          ? `0 0 0 3px ${glowColor}, 0 24px 60px rgba(0,0,0,0.4)`
          : "0 24px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)",
        transition: dragging ? "box-shadow 0.1s ease" : "box-shadow 0.3s ease",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${photos[photoIdx]}')`, transition: "background-image 0.3s ease" }}
      />

      {depth === 0 && photos.length > 1 && (
        <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-20">
          {photos.map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-200"
              style={{
                height: 3,
                background: i === photoIdx ? "white" : "rgba(255,255,255,0.28)",
                boxShadow: i === photoIdx ? "0 1px 6px rgba(0,0,0,0.5)" : "none",
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 35%, transparent 50%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.95) 100%)" }} />

      {depth === 0 && (
        <div
          className="absolute top-16 left-5 z-20 rotate-[-14deg]"
          style={{
            opacity: yesOpacity,
            transform: `rotate(-14deg) scale(${0.7 + yesOpacity * 0.3})`,
            transition: dragging ? "none" : "all 0.2s ease",
          }}
        >
          <div className="px-5 py-2.5 rounded-2xl border-[3px] border-brand-green font-black text-2xl uppercase tracking-wide" style={{ background: "rgba(255,255,255,0.97)", color: "#047857", boxShadow: "0 6px 24px rgba(16,185,129,0.45)" }}>
            ME INTERESA ✓
          </div>
        </div>
      )}

      {depth === 0 && (
        <div
          className="absolute top-16 right-5 z-20"
          style={{
            opacity: noOpacity,
            transform: `rotate(14deg) scale(${0.7 + noOpacity * 0.3})`,
            transition: dragging ? "none" : "all 0.2s ease",
          }}
        >
          <div className="px-5 py-2.5 rounded-2xl border-[3px] border-red-500 font-black text-2xl uppercase tracking-wide" style={{ background: "rgba(255,255,255,0.97)", color: "#ef4444", boxShadow: "0 6px 24px rgba(239,68,68,0.45)" }}>
            PASO ✕
          </div>
        </div>
      )}

      {item.gold && depth === 0 && (
        <div
          className="absolute top-10 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs text-white"
          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 2px 16px rgba(245,158,11,0.6)" }}
        >
          ✨ GOLD
        </div>
      )}

      <div className="absolute top-10 right-4 z-10 flex flex-col items-end gap-1.5">
        {item.category && (
          <span className="px-3 py-1 rounded-full text-xs font-bold shadow-md" style={{ background: "rgba(255,255,255,0.95)", color: "#0369a1" }}>
            {item.category}
          </span>
        )}
        {item.neighborhood && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.92)" }}>
            📍 {item.neighborhood}
          </span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div className="flex items-end gap-2 mb-1">
          <h3 className="text-[28px] font-black leading-tight drop-shadow-md">{item.title}</h3>
          {item.storage && <span className="text-base font-light text-white/70 mb-0.5">{item.storage}</span>}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm text-white/85">
            Por <b className="text-white">{item.owner}</b>
          </p>
          {item.verified && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[11px] font-black shadow" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}>✓</span>
          )}
          {item.distance && (
            <>
              <span className="text-white/35 text-xs">·</span>
              <p className="text-xs text-white/65">{item.distance}</p>
            </>
          )}
        </div>

        {expanded && (
          <div className="mb-4 animate-fadeIn">
            <p className="text-sm text-white/90 leading-relaxed mb-3">{item.description}</p>
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs border border-white/20" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className="rounded-2xl p-3.5 border border-brand-green/60"
          style={{ background: "rgba(16,185,129,0.18)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18"/>
            </svg>
            <p className="text-[10px] uppercase tracking-widest text-brand-green font-black">Lo cambia por</p>
          </div>
          <p className="text-base font-bold text-white">{item.wants}</p>
        </div>

        {!expanded && (
          <p className="text-center text-[10px] text-white/40 mt-3 tracking-wide">
            Toca para detalles · Desliza fotos por los lados
          </p>
        )}
      </div>
    </div>
  );
            }
