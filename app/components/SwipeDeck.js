"use client";

import { useState, useRef } from "react";
import MatchModal from "./MatchModal";

const MY_PRODUCT = {
  title: "Tu producto",
  photos: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=80"],
  owner: "Tú",
};

// Returns true if the card's "wants" text overlaps meaningfully with user's product titles
function isCompatible(wants = "", myProducts = []) {
  if (!wants || !myProducts.length) return false;
  const wl = wants.toLowerCase();
  return myProducts.some((p) => {
    const words = (p.title || "").toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    return words.some((w) => wl.includes(w));
  });
}

export default function SwipeDeck({
  items,
  onMatch,
  onOpenChat,
  onSwipe,
  outOfSwipes,
  onUpgrade,
  userId,
  myProducts = [],
}) {
  const [index, setIndex] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [snapBack, setSnapBack] = useState(false);
  const [decision, setDecision] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [matchedProduct, setMatchedProduct] = useState(null);
  const startRef = useRef({ x: 0, y: 0, t: 0 });
  const isSwipingRef = useRef(false);

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
      setSnapBack(true);
      setDrag({ x: 0, y: 0 });
      setTimeout(() => setSnapBack(false), 500);
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
    if (isSwipingRef.current) return;
    isSwipingRef.current = true;

    if (outOfSwipes) {
      onUpgrade?.();
      setDrag({ x: 0, y: 0 });
      isSwipingRef.current = false;
      return;
    }

    setDecision(choice);
    onSwipe?.(current, choice);

    const positive = choice === "yes" || choice === "super";

    setTimeout(() => {
      if (positive && !userId) {
        const chance =
          choice === "super"
            ? Math.min(1, (current.matchChance || 0.5) + 0.3)
            : current.matchChance || 0.5;
        if (Math.random() < chance) {
          const matchData = { ...current, matchId: null };
          setMatchedProduct(matchData);
          onMatch?.(matchData);
        }
      }

      setIndex((i) => i + 1);
      setPhotoIdx(0);
      setExpanded(false);
      setDrag({ x: 0, y: 0 });
      setDecision(null);
      isSwipingRef.current = false;
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
          <span style={{ fontSize: 64 }}>🔍</span>
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
      <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: "3/4.6", maxHeight: "calc(100dvh - 200px)", minHeight: 360 }}>
        {next2 && <Card item={next2} depth={2} photoIdx={0} myProducts={myProducts} />}
        {next1 && <Card item={next1} depth={1} photoIdx={0} myProducts={myProducts} />}

        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="absolute inset-0 select-none touch-none cursor-grab active:cursor-grabbing"
          style={{
            transform: exitTransform,
            transition: dragging ? "none" : snapBack ? "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)" : "transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)",
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
            myProducts={myProducts}
          />
        </div>

        {/* Action buttons */}
        <div className="absolute -bottom-[88px] left-0 right-0 flex justify-center items-end gap-5">
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
    no: { bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "1.5px solid rgba(239,68,68,0.3)", shadow: "0 4px 24px rgba(239,68,68,0.15), inset 0 1px 0 rgba(255,255,255,0.08)", blur: true },
    super: { bg: "rgba(14,165,233,0.12)", color: "#38bdf8", border: "1.5px solid rgba(14,165,233,0.3)", shadow: "0 4px 24px rgba(14,165,233,0.15), inset 0 1px 0 rgba(255,255,255,0.08)", blur: true },
    yes: { bg: "rgba(16,185,129,0.12)", color: "#34d399", border: "1.5px solid rgba(16,185,129,0.3)", shadow: "0 4px 24px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.08)", blur: true },
  };
  const s = styles[type];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={onClick}
        className="rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90"
        style={{
          width: large ? 72 : 56,
          height: large ? 72 : 56,
          background: s.bg,
          color: s.color,
          border: s.border,
          boxShadow: s.shadow,
          backdropFilter: s.blur ? "blur(12px)" : "none",
          WebkitBackdropFilter: s.blur ? "blur(12px)" : "none",
        }}
      >
        {children}
      </button>
      <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: type === "yes" ? "#34d399" : type === "no" ? "#f87171" : "#38bdf8", opacity: 0.85 }}>
        {label}
      </span>
    </div>
  );
}

function Card({ item, depth, yesOpacity = 0, noOpacity = 0, photoIdx = 0, expanded = false, dragging = false, dragX = 0, myProducts = [] }) {
  const scale = 1 - depth * 0.05;
  const translateY = depth * 10;
  const opacity = depth === 0 ? 1 : depth === 1 ? 0.7 : 0.4;
  const photos = (item.photos?.length ? item.photos : item.image ? [item.image] : []).filter(Boolean);

  const compatible = depth === 0 && isCompatible(item.wants, myProducts);

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
        background: photos[photoIdx] ? "#1a1a1a" : "linear-gradient(135deg, #0d2018 0%, #0a1f2e 50%, #071612 100%)",
        boxShadow: depth === 0 && (yesOpacity > 0.1 || noOpacity > 0.1)
          ? `0 0 0 3px ${glowColor}, 0 24px 60px rgba(0,0,0,0.4)`
          : "0 24px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)",
        transition: dragging ? "box-shadow 0.1s ease" : "box-shadow 0.3s ease",
      }}
    >
      {/* Photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${photos[photoIdx]}')`, transition: "background-image 0.3s ease" }}
      />

      {/* Indicadores de foto — barra superior estilo Stories */}
      {depth === 0 && photos.length > 1 && (
        <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-20">
          {photos.map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-300"
              style={{
                height: 3,
                background: i === photoIdx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.28)",
                boxShadow: i === photoIdx ? "0 1px 6px rgba(0,0,0,0.5)" : "none",
                transform: i === photoIdx ? "scaleY(2.5)" : "scaleY(1)",
              }}
            />
          ))}
        </div>
      )}

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 35%, transparent 50%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.95) 100%)" }} />

      {/* Swipe right overlay — green */}
      {depth === 0 && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
          background: "linear-gradient(135deg, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.05) 100%)",
          opacity: yesOpacity,
          transition: "opacity 0.1s ease",
        }} />
      )}
      {/* Swipe left overlay — red */}
      {depth === 0 && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
          background: "linear-gradient(225deg, rgba(239,68,68,0.35) 0%, rgba(239,68,68,0.05) 100%)",
          opacity: noOpacity,
          transition: "opacity 0.1s ease",
        }} />
      )}

      {/* YES stamp */}
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

      {/* NO stamp */}
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

      {/* ⚡ Encaja contigo badge */}
      {compatible && (
        <div
          className="absolute z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs text-white animate-badge-pop"
          style={{
            top: item.gold ? 56 : 10,
            right: 14,
            background: "rgba(0,0,0,0.45)",
            boxShadow: "0 2px 16px rgba(16,185,129,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          ⚡ Encaja contigo
        </div>
      )}

      {/* Gold badge */}
      {item.gold && depth === 0 && (
        <div
          className="absolute top-10 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs text-white"
          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 2px 16px rgba(245,158,11,0.6)" }}
        >
          ✨ GOLD
        </div>
      )}

      {/* Neighborhood pill — top right */}
      {item.neighborhood && (
        <div className="absolute top-10 right-4 z-10">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}>
            📍 {item.neighborhood}
          </span>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* Título + categoría */}
        <div className="mb-2">
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-lg flex-1 min-w-0 line-clamp-2">{item.title}</h3>
            {item.storage && <span className="text-sm font-light text-white/70 mb-0.5 shrink-0">{item.storage}</span>}
          </div>
          {item.category && (
            <span
              className="text-xs font-bold uppercase mt-1 inline-block"
              style={{ color: "rgba(16,185,129,0.9)", letterSpacing: "0.12em" }}
            >
              {item.category}
            </span>
          )}
        </div>

        {/* Chip "Busca:" — inline, sobre la fila del dueño */}
        {item.wants && (
          <div className="flex items-start gap-1.5 mb-3">
            <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: "rgba(16,185,129,0.8)" }}>🔄</span>
            <p className="text-sm font-semibold leading-snug" style={{ color: "rgba(255,255,255,0.85)" }}>
              <span className="font-bold" style={{ color: "#10b981" }}>Busca: </span>
              {item.wants.length > 45 ? item.wants.slice(0, 45) + "…" : item.wants}
            </p>
          </div>
        )}

        {/* Owner row with avatar */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)", boxShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
          >
            {(item.owner || "U").charAt(0).toUpperCase()}
          </div>
          <p className="text-[13px] text-white/90 font-semibold truncate">
            {item.owner}
          </p>
          {item.verified && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white shrink-0" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)", fontSize: 8, fontWeight: 900 }}>✓</span>
          )}
          {item.neighborhood && (
            <>
              <span className="text-white/30 text-xs shrink-0">·</span>
              <p className="text-[11px] text-white/60 truncate">📍 {item.neighborhood}</p>
            </>
          )}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mb-3 animate-fadeIn">
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
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                const url = `https://truekly-match.vercel.app/p/${item.id}`;
                if (navigator.share) {
                  navigator.share({ title: item.title, text: `Mira este trueque 🤝`, url });
                } else {
                  navigator.clipboard?.writeText(url).then(() => import("@/lib/toast").then(({ toast }) => toast("¡Link copiado!")));
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/80 hover:bg-white/20 transition border border-white/20"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
            >
              🔗 Compartir
            </button>
          </div>
        )}

        {!expanded && (
          <p className="text-center text-[10px] text-white/35 mt-2.5 tracking-wide">
            Toca para detalles · Desliza fotos por los lados
          </p>
        )}
      </div>
    </div>
  );
}
