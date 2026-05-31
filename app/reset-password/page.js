"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setBusy(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/?passwordUpdated=1");
    } catch (err) {
      setError(err.message || "Error desconocido");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white text-2xl font-black shadow-xl">
            T
          </div>
          <h1 className="text-2xl font-black">Nueva contraseña</h1>
          <p className="text-sm text-foreground/60 mt-1">Elige una contraseña segura</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña (min 6 caracteres)"
            autoComplete="new-password"
            minLength={6}
            required
            className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-white focus:outline-none transition placeholder:text-foreground/30 text-foreground"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmar contraseña"
            autoComplete="new-password"
            minLength={6}
            required
            className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-white focus:outline-none transition placeholder:text-foreground/30 text-foreground"
          />

          {error && (
            <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold shadow-lg hover:scale-[1.01] transition disabled:opacity-50"
          >
            {busy ? "..." : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
