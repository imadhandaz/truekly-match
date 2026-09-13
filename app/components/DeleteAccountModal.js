"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function DeleteAccountModal({ onClose, onDeleted }) {
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const expected = "ELIMINAR";
  const canDelete = confirmText.trim().toUpperCase() === expected;

  const handleDelete = async () => {
    setBusy(true);
    setError(null);
    const supabase = getSupabase();
    try {
      const { error } = await supabase.rpc("delete_my_account");
      if (error) throw error;
      await supabase.auth.signOut();
      onDeleted();
    } catch (err) {
      setError(err.message || "Error al eliminar la cuenta");
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(20px)" }}
    >
      <div
        className="w-full sm:max-w-md relative overflow-hidden sm:rounded-3xl rounded-t-3xl animate-slideInUp"
        style={{
          background: "linear-gradient(160deg, rgba(18,8,8,0.98) 0%, rgba(10,5,5,0.99) 100%)",
          border: "1px solid rgba(239,68,68,0.15)",
          boxShadow: "0 -4px 80px rgba(239,68,68,0.08), 0 40px 100px rgba(0,0,0,0.7)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(239,68,68,0.5), rgba(239,68,68,0.5), transparent)" }} />

        <div className="sm:hidden flex justify-center pt-3 pb-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
        </div>

        <div className="px-6 pb-8 pt-6">
          <div className="flex justify-center mb-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(239,68,68,0.2), rgba(239,68,68,0.05))",
                border: "1px solid rgba(239,68,68,0.3)",
                boxShadow: "0 4px 32px rgba(239,68,68,0.2)",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2
              className="text-2xl font-black text-white mb-2"
              style={{ fontFamily: "var(--font-jakarta), system-ui", letterSpacing: "-0.02em" }}
            >
              Eliminar cuenta
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6 }}>
              Esta accion es <span style={{ color: "#fca5a5", fontWeight: 700 }}>permanente e irreversible</span>
            </p>
          </div>

          <div
            className="rounded-2xl p-4 mb-6 space-y-2.5"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            {[
              "Tu perfil y datos personales",
              "Todos tus productos publicados",
              "Tus matches y conversaciones",
              "Tu historial de swipes y valoraciones",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{item}</span>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              Escribe <span style={{ color: "#ef4444" }}>{expected}</span> para confirmar
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expected}
              autoCapitalize="characters"
              className="w-full py-3.5 px-4 rounded-xl text-white font-black text-center tracking-[0.2em] transition-all outline-none uppercase"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: canDelete
                  ? "1px solid rgba(239,68,68,0.6)"
                  : "1px solid rgba(255,255,255,0.1)",
                fontSize: 16,
                boxShadow: canDelete ? "0 0 0 3px rgba(239,68,68,0.12)" : "none",
                transition: "all 0.2s ease",
              }}
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-3.5 py-3 rounded-xl text-sm mb-4"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
            >
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={busy}
              className="flex-1 py-3.5 rounded-2xl font-bold transition-all hover:bg-white/10 active:scale-95 disabled:opacity-40"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 15,
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={!canDelete || busy}
              className="flex-1 py-3.5 rounded-2xl font-black text-white transition-all active:scale-95 disabled:opacity-40"
              style={{
                background: canDelete
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "rgba(239,68,68,0.3)",
                fontSize: 15,
                boxShadow: canDelete ? "0 6px 24px rgba(239,68,68,0.4)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {busy ? "Eliminando..." : "Eliminar cuenta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
      }
