"use client";

import { useState, useRef } from "react";
import MatchModal from "./MatchModal";

const MY_PRODUCT = {
  title: "Tu producto",
  photos: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=80"],
  owner: "Tú",
};

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

  const angle = drag.x * 0.08;
  const yesOpacity = Math.min(Math.max(drag.x / 100, 0), 1);
  const noOpacity = Math.min(Math.max(-drag.x / 100, 0), 1);

  const exitTransform =
    decision === "yes"
      ? "translate(650px, -80px) rotate(28deg)"
      : decision === "no"
      ? "translate(-650px, -80px) rotate(-28deg)"
      : decision === "super"
      ? "translate(0, -750px) rotate(0deg) scale(0.5)"
      : `rotate(${angle}deg) translate(${drag.x}px, ${drag.y * 0.4}px)`;

  if (!current) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "calc(var(--app-height, 100dvh) - 200px)", gap: 16, padding: "0 32px", textAlign: "center",
      }}>
        <div style={{ fontSize: 64, filter: "grayscale(0.3)" }}>🔍</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em", margin: 0 }}>
          Has visto todo por ahora
        </h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, margin: 0 }}>
          Vuelve mañana o sube un producto para conseguir más matches
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          height: "calc(var(--app-height, 100dvh) - 180px)",
          maxHeight: 680,
          minHeight: 420,
        }}>
          {next2 && <StackCard item={next2} depth={2} photoIdx={0} myProducts={myProducts} />}
          {next1 && <StackCard item={next1} depth={1} photoIdx={0} myProducts={myProducts} />}

          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="select-none touch-none"
            style={{
              position: "absolute", inset: 0,
              transform: exitTransform,
              transition: dragging
                ? "none"
                : snapBack
                ? "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                : "transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)",
              willChange: "transform",
              cursor: dragging ? "grabbing" : "grab",
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
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 20, marginTop: 16, marginBottom: 8,
        }}>
          <button
            type="button"
            onClick={() => commit("no")}
            style={{
              width: 60, height: 60, borderRadius: 30,
              background: "rgba(239,68,68,0.12)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              border: "1.5px solid rgba(239,68,68,0.35)",
              boxShadow: "0 4px 20px rgba(239,68,68,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, cursor: "pointer", color: "#f87171",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(239,68,68,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(239,68,68,0.2)"; }}
          >
            ✕
          </button>

          <button
            type="button"
            onClick={() => commit("super")}
            style={{
              width: 52, height: 52, borderRadius: 26,
              background: "rgba(14,165,233,0.12)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              border: "1.5px solid rgba(14,165,233,0.35)",
              boxShadow: "0 4px 20px rgba(14,165,233,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, cursor: "pointer", color: "#38bdf8",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            ⚡
          </button>

          <button
            type="button"
            onClick={() => commit("yes")}
            style={{
              width: 68, height: 68, borderRadius: 34,
              background: "rgba(16,185,129,0.15)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              border: "1.5px solid rgba(16,185,129,0.4)",
              boxShadow: "0 4px 24px rgba(16,185,129,0.3), 0 0 0 1px rgba(16,185,129,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, cursor: "pointer", color: "#34d399",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(16,185,129,0.3), 0 0 0 1px rgba(16,185,129,0.1)"; }}
          >
            ✓
          </button>
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

function StackCard({ item, depth, photoIdx = 0, myProducts = [] }) {
  const scale = 1 - depth * 0.04;
  const translateY = depth * 12;
  const opacity = depth === 1 ? 0.65 : 0.35;

  return (
    <div style={{
      position: "absolute", inset: 0,
      borderRadius: 28, overflow: "hidden",
      transform: `scale(${scale}) translateY(${translateY}px)`,
      opacity,
      zIndex: 10 - depth,
      background: "#111116",
      boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
    }}>
      {item.photos?.[0] || item.image ? (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${item.photos?.[0] || item.image}')`,
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
      ) : null}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
    </div>
  );
}

function Card({ item, depth, yesOpacity = 0, noOpacity = 0, photoIdx = 0, expanded = false, dragging = false, dragX = 0, myProducts = [] }) {
  const photos = (item.photos?.length ? item.photos : item.image ? [item.image] : []).filter(Boolean);
  const compatible = isCompatible(item.wants, myProducts);

  return (
    <div style={{
      position: "absolute", inset: 0,
      borderRadius: 28, overflow: "hidden",
      background: photos[photoIdx] ? "#0A0A0C" : "linear-gradient(135deg, #0d2018 0%, #0a1f2e 50%, #071612 100%)",
      boxShadow: yesOpacity > 0.1
        ? `0 0 0 3px rgba(16,185,129,${yesOpacity * 0.8}), 0 24px 60px rgba(0,0,0,0.5)`
        : noOpacity > 0.1
        ? `0 0 0 3px rgba(239,68,68,${noOpacity * 0.8}), 0 24px 60px rgba(0,0,0,0.5)`
        : "0 24px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.3)",
      transition: dragging ? "box-shadow 0.1s ease" : "box-shadow 0.3s ease",
    }}>
      {photos[photoIdx] && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${photos[photoIdx]}')`,
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
      )}

      {photos.length > 1 && (
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", gap: 4, zIndex: 10 }}>
          {photos.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: i === photoIdx ? 3 : 2, borderRadius: 99,
              background: i === photoIdx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
              boxShadow: i === photoIdx ? "0 0 6px rgba(255,255,255,0.5)" : "none",
            }} />
          ))}
        </div>
      )}

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 65%, transparent 100%)",
      }} />

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 80,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
      }} />

      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        background: "linear-gradient(145deg, rgba(16,185,129,0.45) 0%, transparent 70%)",
        opacity: Math.min(Math.max(dragX / 80, 0), 1),
        transition: dragging ? "none" : "opacity 0.2s ease",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "10%",
          transform: "translateY(-50%) rotate(-15deg)",
          fontSize: 52,
          opacity: Math.min(Math.max(dragX / 100, 0), 1),
          filter: "drop-shadow(0 0 12px #10b981)",
        }}>✓</div>
      </div>

      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        background: "linear-gradient(215deg, rgba(239,68,68,0.45) 0%, transparent 70%)",
        opacity: Math.min(Math.max(-dragX / 80, 0), 1),
        transition: dragging ? "none" : "opacity 0.2s ease",
      }}>
        <div style={{
          position: "absolute", top: "50%", right: "10%",
          transform: "translateY(-50%) rotate(15deg)",
          fontSize: 52,
          opacity: Math.min(Math.max(-dragX / 100, 0), 1),
          filter: "drop-shadow(0 0 12px #ef4444)",
        }}>✕</div>
      </div>

      {compatible && (
        <div className="animate-badge-pop" style={{
          position: "absolute", top: 44, left: 12, zIndex: 10,
          background: "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(14,165,233,0.2))",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(16,185,129,0.4)",
          borderRadius: 99, padding: "4px 10px",
          fontSize: 11, fontWeight: 700, color: "#34d399",
          boxShadow: "0 2px 12px rgba(16,185,129,0.25)",
        }}>
          ⚡ Encaja contigo
        </div>
      )}

      {item.gold && (
        <div style={{
          position: "absolute", top: 44, left: compatible ? 130 : 12, zIndex: 10,
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: 99,
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          boxShadow: "0 2px 16px rgba(245,158,11,0.5)",
          fontSize: 11, fontWeight: 800, color: "#fff",
        }}>✨ GOLD</div>
      )}

      <div style={{ position: "absolute", top: 44, right: 12, zIndex: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          border: "2px solid rgba(255,255,255,0.4)",
          background: "linear-gradient(135deg, #10b981, #0ea5e9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, color: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        }}>
          {(item.owner || "U")[0].toUpperCase()}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ padding: "0 20px 20px" }}>
          <h2 style={{
            fontSize: 26, fontWeight: 900, color: "#fff",
            letterSpacing: "-0.02em", lineHeight: 1.1,
            marginBottom: 4, marginTop: 0,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {item.title}
            {item.storage && (
              <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.55)", marginLeft: 8 }}>
                {item.storage}
              </span>
            )}
          </h2>

          {item.category && (
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#10b981", marginBottom: 10,
            }}>
              {item.category}
            </div>
          )}

          {item.wants && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", flexShrink: 0, marginTop: 1 }}>🔄</span>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.35, margin: 0 }}>
                <span style={{ color: "#34d399", fontWeight: 700 }}>Busca: </span>
                {item.wants.length > 50 ? item.wants.slice(0, 50) + "…" : item.wants}
              </p>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {(item.location || item.neighborhood) && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 3 }}>
                📍 {item.neighborhood || item.location}
              </span>
            )}
            {item.verified && (
              <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>✓ Verificado</span>
            )}
          </div>

          {expanded && (
            <div className="animate-fade-in" style={{ marginTop: 12 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, marginBottom: 10, marginTop: 0 }}>
                {item.description}
              </p>
              {item.tags?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {item.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: "4px 10px", borderRadius: 99, fontSize: 11,
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.8)",
                    }}>
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
                    navigator.share({ title: item.title, text: "Mira este trueque 🤝", url });
                  } else {
                    navigator.clipboard?.writeText(url);
                  }
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 99, fontSize: 12,
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.75)", cursor: "pointer",
                }}
              >
                🔗 Compartir
              </button>
            </div>
          )}

          {!expanded && (
            <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 10, letterSpacing: "0.04em" }}>
              Toca para detalles · Desliza fotos por los lados
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
