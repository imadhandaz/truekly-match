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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl">
        <div className="px-6 py-7 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center text-4xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-black mb-2">Eliminar cuenta</h2>
          <p className="text-sm text-foreground/65 leading-relaxed mb-5">
            Esto borra <b>permanentemente</b>:
          </p>
          <ul className="text-left text-sm text-foreground/75 space-y-1.5 mb-5 px-4">
            <li className="flex gap-2"><span className="text-red-500">×</span> Tu perfil y datos personales</li>
            <li className="flex gap-2"><span className="text-red-500">×</span> Todos tus productos publicados</li>
            <li className="flex gap-2"><span className="text-red-500">×</span> Tus matches y conversaciones</li>
            <li className="flex gap-2"><span className="text-red-500">×</span> Tu historial de swipes</li>
          </ul>
          <p className="text-xs text-foreground/55 mb-5">
            Acción <b>irreversible</b>. No se puede deshacer.
          </p>

          <div className="text-left mb-2">
            <label className="text-xs font-bold uppercase tracking-wide text-foreground/70">
              Para confirmar, escribe <span className="text-red-500">{expected}</span>
            </label>
          </div>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={expected}
            className="w-full px-4 py-3 rounded-xl bg-foreground/5 border-2 border-red-200 focus:border-red-500 focus:outline-none transition placeholder:text-foreground/30 text-center font-bold tracking-widest uppercase"
          />

          {error && (
            <div className="mt-3 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={busy}
              className="py-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 font-bold transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={!canDelete || busy}
              className={`py-3 rounded-2xl font-bold text-white transition ${
                canDelete && !busy
                  ? "bg-red-500 hover:bg-red-600 shadow-lg"
                  : "bg-red-200 cursor-not-allowed"
              }`}
            >
              {busy ? "Eliminando..." : "Eliminar cuenta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
