"use client";

import { useState, useRef } from "react";
import MatchModal from "./MatchModal";

const MY_PRODUCT = {
  title: "Tu producto",
  photos: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=80"],
  owner: "Tú",
};

export default function SwipeDeck({ items, onMatch, onOpenChat, onSwipe, outOfSwipes, onUpgrade }) {
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
    const threshold = 110;

    if (drag.x > threshold) {
      commit("yes");
    } else if (drag.x < -threshold) {
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
    if (x < w / 3 && current.photos.length > 1) {
      setPhotoIdx((p) => (p - 1 + current.photos.length) % current.photos.length);
    } else if (x > (w * 2) / 3 && current.photos.length > 1) {
      setPhotoIdx((p) => (p + 1) % current.photos.length);
    } else {
      setExpanded((e) => !e);
    }
  };

  const commit = (choice) => {
    if (outOfSwipes) {
      onUpgrade?.();
      setDrag({ x: 0, y: 0 });
      return;
    }
    setDecision(choice);
    onSwipe?.();
    const positive = choice === "yes" || choice === "super";
    const chance = choice === "super" ? Math.min(1, current.matchChance + 0.3) : current.matchChance;
    const isMatch = positive && Math.random() < chance;

    setTimeout(() => {
      if (isMatch) {
        setMatchedProduct(current);
        onMatch?.(current);
      }
      setIndex((i) => i + 1);
      setPhotoIdx(0);
      setExpanded(false);
      setDrag({ x: 0, y: 0 });
      setDecision(null);
    }, 250);
  };

  const closeMatch = () => setMatchedProduct(null);

  const angle = drag.x / 18;
  const yesOpacity = Math.min(Math.max(drag.x / 110, 0), 1);
  const noOpacity = Math.min(Math.max(-drag.x / 110, 0), 1);

  const exitTransform =
    decision === "yes"
      ? "translate(600px, -80px) rotate(25deg)"
      : decision === "no"
      ? "translate(-600px, -80px) rotate(-25deg)"
      : decision === "super"
      ? "translate(0, -700px) rotate(0deg) scale(0.6)"
      : `translate(${drag.x}px, ${drag.y}px) rotate(${angle}deg)`;

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-brand-blue-dark to-brand-green-dark bg-clip-text text-transparent">
          ¡Has visto todo!
        </h2>
        <p className="text-foreground/70 text-lg">Vuelve más tarde a por nuevos productos.</p>
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
            transition: dragging ? "none" : "transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <Card
            item={current}
            depth={0}
            yesOpacity={yesOpacity}
            noOpacity={noOpacity}
            photoIdx={photoIdx}
            expanded={expanded}
          />
        </div>

        <div className="absolute -bottom-24 left-0 right-0 flex justify-center items-center gap-4">
          <ActionButton onClick={() => commit("no")} aria-label="Pasar" colorClass="from-red-100 to-red-50 text-red-500 border-red-200">
            ✕
          </ActionButton>
          <ActionButton
            onClick={() => commit("super")}
            aria-label="Super interés"
            colorClass="from-blue-100 to-blue-50 text-brand-blue-dark border-blue-200"
          >
            ⭐
          </ActionButton>
          <ActionButton
            onClick={() => commit("yes")}
            aria-label="Me interesa"
            big
            colorClass="from-brand-green to-brand-blue text-white border-transparent"
          >
            💚
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

function ActionButton({ children, onClick, big, colorClass, ...rest }) {
  const size = big ? "w-20 h-20 text-4xl" : "w-16 h-16 text-3xl";
  return (
    <button
      onClick={onClick}
      className={`${size} rounded-full bg-gradient-to-br ${colorClass} border-2 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all font-bold`}
      {...rest}
    >
      {children}
    </button>
  );
}

function Card({ item, depth, yesOpacity = 0, noOpacity = 0, photoIdx = 0, expanded = false }) {
  const scale = 1 - depth * 0.045;
  const translateY = depth * 14;
  const opacity = depth === 0 ? 1 : 0.95 - depth * 0.18;
  const photos = item.photos || [item.image];

  return (
    <div
      className="absolute inset-0 rounded-3xl overflow-hidden bg-white shadow-2xl"
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        zIndex: 10 - depth,
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-300"
        style={{ backgroundImage: `url('${photos[photoIdx]}')` }}
      />

      {depth === 0 && photos.length > 1 && (
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full ${
                i === photoIdx ? "bg-white" : "bg-white/35"
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {depth === 0 && (
        <>
          <div
            className="absolute top-16 left-6 px-4 py-2 rounded-lg border-4 border-brand-green text-brand-green-dark font-black text-2xl rotate-[-12deg] z-20"
            style={{ opacity: yesOpacity, background: "rgba(255,255,255,0.95)" }}
          >
            ME INTERESA
          </div>
          <div
            className="absolute top-16 right-6 px-4 py-2 rounded-lg border-4 border-red-500 text-red-500 font-black text-2xl rotate-[12deg] z-20"
            style={{ opacity: noOpacity, background: "rgba(255,255,255,0.95)" }}
          >
            PASO
          </div>
        </>
      )}

      <div className="absolute top-12 right-4 z-10">
        <span className="px-3 py-1 rounded-full bg-white/95 text-xs font-bold text-brand-blue-dark backdrop-blur-sm shadow">
          {item.category}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-3xl font-bold drop-shadow">{item.title}</h3>
          <span className="text-lg font-light text-white/80">{item.storage}</span>
        </div>
        <p className="text-sm text-white/85 mb-3 flex items-center gap-2">
          <span>📍 {item.location}</span>
          <span className="text-white/50">·</span>
          <span>{item.distance}</span>
        </p>

        {expanded && (
          <div className="mb-3 animate-fadeIn">
            <p className="text-sm text-white/90 leading-relaxed mb-3">{item.description}</p>
            {item.tags && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-white/15 text-xs border border-white/20 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-gradient-to-r from-brand-green/20 to-brand-blue/20 backdrop-blur-md rounded-xl p-3 border border-white/25">
          <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-0.5">
            Lo cambia por
          </p>
          <p className="text-base font-semibold">{item.wants}</p>
        </div>

        {!expanded && (
          <p className="text-center text-xs text-white/60 mt-3">
            Toca para ver detalles · Desliza laterales para más fotos
          </p>
        )}
      </div>
    </div>
  );
}
