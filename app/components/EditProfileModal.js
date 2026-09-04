"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function EditProfileModal({ profile, user, onClose, onSaved }) {
  const [name, setName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.neighborhood || profile?.location || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = getSupabase();

  const save = async () => {
    if (!user || saving) return;
    const trimmed = name.trim();
    if (!trimmed) { setError("El nombre no puede estar vacío"); return; }
    setSaving(true);
    setError("");
    const updates = { id: user.id, display_name: trimmed };
    if (bio.trim()) updates.bio = bio.trim();
    if (location.trim()) updates.neighborhood = location.trim();
    const { error: err } = await supabase.from("profiles").upsert(updates, { onConflict: "id" });
    setSaving(false);
    if (err) { setError("No se pudo guardar. Inténtalo de nuevo."); return; }
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slideInUp overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-foreground/5">
          <h2 className="text-xl font-bold">Editar perfil</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-foreground/5 flex items-center justify-center text-xl transition">✕</button>
        </div>

        <div className="flex justify-center pt-5 pb-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {(name.trim().charAt(0) || user?.email?.charAt(0) || "?").toUpperCase()}
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-1.5 block">Nombre visible *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" maxLength={40}
              className="w-full px-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-1.5 block">Bio <span className="normal-case font-normal">(opcional)</span></label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Cuéntate en dos frases..." maxLength={160} rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition text-sm resize-none" />
            <p className="text-[11px] text-foreground/40 mt-1 text-right">{bio.length}/160</p>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-1.5 block">Ubicación <span className="normal-case font-normal">(opcional)</span></label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej: Madrid · Vallecas" maxLength={60}
              className="w-full px-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition text-sm" />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button onClick={save} disabled={saving || !name.trim()}
            className="w-full py-4 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
