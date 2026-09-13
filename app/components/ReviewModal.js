"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

const LABELS = ["", "Muy malo", "Regular", "Bien", "Muy bien", "Genial"];
const EMOJI = ["", "😞", "😐", "🙂", "😊", "🤩"];

export default function ReviewModal({ matchId, userId, reviewedUserId, reviewedName, onClose, onDone }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
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
    setTimeout(() => {
      onDone?.();
      onClose();
    }, 1200);
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
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(16,185,129,0.5), rgba(14,165,233,0.5), transparent)" }} />

        <div className="sm:hidden flex justify-center pt-3 pb-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 8px 32px rgba(16,185,129,0.5)" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "var(--font-jakarta), system-ui" }}>
              Gracias!
            </h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>Tu valoracion ayuda a la comunidad</p>
          </div>
        ) : (
          <div className="px-6 pb-8 pt-6">
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
                Como fue el trueque?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                Valora tu experiencia con <span className="text-white font-bold">{reviewedName || "este usuario"}</span>
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-3">
              {[1, 2, 3, 4, 5].map((s) => {
                const active = s <= displayed;
                return (
                  <button
                    key={s}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(s)}
                    className="transition-all active:scale-90"
                    style={{
                      fontSize: 42,
                      transform: active ? "scale(1.15)" : "scale(1)",
                      transition: "transform 0.15s cubic-bezier(0.2,1.4,0.5,1)",
                      filter: active
                        ? "drop-shadow(0 4px 12px rgba(251,191,36,0.7))"
                        : "grayscale(0.8) opacity(0.35)",
                    }}
                  >
                    ⭐
                  </button>
                );
              })}
            </div>

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

            <div className="mb-5">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuentanos como fue (opcional)..."
                maxLength={300}
                rows={3}
                className="w-full py-3 px-4 rounded-xl text-white font-medium transition-all outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              />
            </div>

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
                {saving ? "Enviando..." : "Enviar valoracion"}
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
