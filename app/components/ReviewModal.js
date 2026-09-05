"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

const LABELS = ["", "Muy malo 😞", "Regular 😐", "Bien 🙂", "Muy bien 😊", "¡Genial! 🤩"];

export default function ReviewModal({ matchId, userId, reviewedUserId, reviewedName, onClose, onDone }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
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
    onDone?.();
    onClose();
  };

  const displayed = hover || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slideInUp overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-foreground/5 text-center">
          <div className="text-4xl mb-2">🤝</div>
          <h2 className="text-xl font-bold">¿Cómo fue el trueque?</h2>
          <p className="text-sm text-foreground/60 mt-1">
            Valora tu experiencia con <b>{reviewedName || "este usuario"}</b>
          </p>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                className="text-4xl transition-transform hover:scale-125 active:scale-110"
              >
                {s <= displayed ? "⭐" : "☆"}
              </button>
            ))}
          </div>

          {displayed > 0 && (
            <p className="text-center text-sm font-bold text-brand-green-dark animate-fadeIn">
              {LABELS[displayed]}
            </p>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos cómo fue (opcional)..."
            maxLength={300}
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition text-sm resize-none"
          />

          <button
            onClick={submit}
            disabled={!rating || saving}
            className="w-full py-4 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100"
          >
            {saving ? "Enviando..." : "Enviar valoración"}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-foreground/40 hover:text-foreground/60 transition"
          >
            Saltar por ahora
          </button>
        </div>
      </div>
    </div>
  );
}
