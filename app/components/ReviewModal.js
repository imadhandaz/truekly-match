"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

const LABELS = ["", "Muy malo", "Regular", "Bien", "Muy bien", "Genial"];
const EMOJI = ["", "😞", "😐", "🙂", "😊", "🤩"];

export default function ReviewModal({ matchId, userId, reviewedUserId, reviewedName, onClose, onDone, onAddProduct }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [lastClickedStar, setLastClickedStar] = useState(null);
  const supabase = getSupabase();

  const submit = async () => {
    if (!rating || saving) return;
    setSaving(true);
    await supabase.from("reviews").insert({
      reviewer_id: userId,
      reviewed_id: reviewedUserId,
      match_id: matchId || null,
      rating,
      comment: comment.trim() || null,
    });
    setSaving(false);
    setDone(true);
  };

  const displayed = hover || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(20px)" }}
    >
      <div
        className="w-full sm:max-w-md relative overflow-hidden sm:rounded-3xl rounded-t-3xl animate-slideInUp"
        style={{
          background: "linear-gradient(160deg, rgba(10,22,18,0.98) 0%, rgba(5,14,11,0.99) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 80px rgba(16,185,129,0.1), 0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(16,185,129,0.5), rgba(14,165,233,0.5), transparent)" }} />

        {/* Drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {done ? (
          /* ── Celebration state ─────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            {/* Confetti-like emoji burst */}
            <div className="relative mb-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #10b981, #0ea5e9)",
                  boxShadow: "0 12px 48px rgba(16,185,129,0.55)",
                  fontSize: 48,
                }}
              >
                🎉
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-float">⭐</div>
              <div className="absolute -bottom-1 -left-3 text-xl animate-float" style={{ animationDelay: "0.5s" }}>✨</div>
            </div>
            <h3
              className="text-2xl font-black text-white mb-2"
              style={{ fontFamily: "var(--font-jakarta), system-ui", letterSpacing: "-0.02em" }}
            >
              ¡Trueque completado!
            </h3>
            <p className="mb-6" style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.6 }}>
              Tu valoración ayuda a la comunidad 💚
            </p>
            <button
              onClick={() => { onAddProduct?.(); onDone?.(); onClose(); }}
              className="w-full py-4 rounded-2xl font-black text-white relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.98] mb-3"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #0ea5e9 100%)",
                fontSize: 15,
                fontFamily: "var(--font-jakarta), system-ui",
                boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
              }}
            >
              <span className="relative z-10">📦 Sube más productos</span>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)", animation: "shimmer-btn 3s ease-in-out infinite" }} />
            </button>
            <button
              onClick={() => { onDone?.(); onClose(); }}
              className="w-full py-3 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <div className="px-6 pb-8 pt-6">
            {/* Header */}
            <div className="text-center mb-7">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
                style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(14,165,233,0.2))", border: "1px solid rgba(16,185,129,0.3)" }}
              >
                🤝
              </div>
              <h2
                className="text-2xl font-black text-white mb-1"
                style={{ fontFamily: "var(--font-jakarta), system-ui", letterSpacing: "-0.02em" }}
              >
                ¿Cómo fue el trueque?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                Valora tu experiencia con <span className="text-white font-bold">{reviewedName || "este usuario"}</span>
              </p>
            </div>

            {/* Stars — 52px touch target each */}
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((s) => {
                const active = s <= displayed;
                const justClicked = lastClickedStar === s;
                return (
                  <button
                    key={s}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onTouchStart={() => setHover(s)}
                    onTouchEnd={() => setHover(0)}
                    onClick={() => { setRating(s); setLastClickedStar(s); setTimeout(() => setLastClickedStar(null), 400); }}
                    className="transition-all"
                    style={{
                      fontSize: 46,
                      width: 52,
                      height: 52,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: active ? "scale(1.18)" : "scale(1)",
                      transition: "transform 0.15s cubic-bezier(0.2,1.4,0.5,1)",
                      filter: active
                        ? "drop-shadow(0 4px 14px rgba(251,191,36,0.75))"
                        : "grayscale(0.8) opacity(0.35)",
                      animation: justClicked ? "starBounce 350ms cubic-bezier(0.2,1.4,0.5,1) both" : undefined,
                    }}
                  >
                    ⭐
                  </button>
                );
              })}
            </div>

            {/* Rating label */}
            <div className="h-7 flex items-center justify-center mb-5">
              {displayed > 0 && (
                <div
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full animate-popIn"
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.3)",
                  }}
                >
                  <span className="text-base">{EMOJI[displayed]}</span>
                  <span className="text-sm font-black" style={{ color: "#34d399" }}>{LABELS[displayed]}</span>
                </div>
              )}
            </div>

            {/* Comment */}
            <div className="mb-5">
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuéntanos cómo fue (opcional)..."
                  maxLength={300}
                  rows={3}
                  className="w-full py-3 px-4 rounded-xl text-white font-medium transition-all outline-none resize-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.9)",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(16,185,129,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {comment.length > 0 && (
                  <p className="absolute bottom-2.5 right-3 text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {comment.length}/300
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={!rating || saving}
              className="w-full py-4 rounded-2xl font-black text-white relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 mb-3"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #0ea5e9 100%)",
                fontSize: 16,
                fontFamily: "var(--font-jakarta), system-ui",
                boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
              }}
            >
              <span className="relative z-10">
                {saving ? "Enviando…" : "Enviar valoración"}
              </span>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)", animation: "shimmer-btn 3s ease-in-out infinite" }} />
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Saltar por ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
