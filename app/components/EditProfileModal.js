"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function EditProfileModal({ profile, user, onClose, onSaved }) {
  const [name, setName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.neighborhood || profile?.location || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const supabase = getSupabase();

  const initials = (name.trim().charAt(0) || user?.email?.charAt(0) || "?").toUpperCase();

  const save = async () => {
    if (!user || saving) return;
    const trimmed = name.trim();
    if (!trimmed) { setError("El nombre no puede estar vacio"); return; }
    setSaving(true);
    setError("");

    const updates = { id: user.id, display_name: trimmed };
    if (bio.trim()) updates.bio = bio.trim();
    if (location.trim()) updates.neighborhood = location.trim();

    const { error: err } = await supabase
      .from("profiles")
      .upsert(updates, { onConflict: "id" });

    setSaving(false);
    if (err) { setError("No se pudo guardar. Intentalo de nuevo."); return; }

    setSaved(true);
    setTimeout(() => {
      onSaved?.();
      onClose();
    }, 800);
  };

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
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(16,185,129,0.5), rgba(14,165,233,0.5), transparent)" }}
        />

        <div className="sm:hidden flex justify-center pt-3 pb-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <h2
            className="font-black text-base"
            style={{
              fontFamily: "var(--font-jakarta), system-ui",
              background: "linear-gradient(90deg, #34d399, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Editar perfil
          </h2>

          <button
            onClick={save}
            disabled={saving || !name.trim() || saved}
            className="text-sm font-black transition-all active:scale-90 disabled:opacity-40"
            style={{ color: "#34d399" }}
          >
            {saved ? "Guardado" : saving ? "..." : "Guardar"}
          </button>
        </div>

        <div className="px-6 pb-8 space-y-5">
          <div className="flex justify-center py-2">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white font-black text-3xl"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669, #0ea5e9)",
                  boxShadow: "0 8px 32px rgba(16,185,129,0.45), 0 0 0 3px rgba(16,185,129,0.2)",
                  fontFamily: "var(--font-jakarta), system-ui",
                }}
              >
                {initials}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #10b981, #0ea5e9)",
                  border: "2px solid rgba(5,14,11,0.99)",
                  boxShadow: "0 2px 12px rgba(16,185,129,0.5)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
          </div>

          <Field label="Nombre visible" required>
            <DarkInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como te llamas?"
              maxLength={40}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              }
            />
            <p className="text-[10px] text-right mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>{name.length}/40</p>
          </Field>

          <Field label="Bio" optional>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Cuentate en dos frases..."
                maxLength={160}
                rows={3}
                className="w-full py-3 rounded-xl text-white font-medium transition-all outline-none resize-none"
                style={{
                  paddingLeft: "2.5rem",
                  paddingRight: "1rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 15,
                  lineHeight: 1.5,
                }}
              />
            </div>
            <p className="text-[10px] text-right mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>{bio.length}/160</p>
          </Field>

          <Field label="Ubicacion" optional>
            <DarkInput
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Madrid - Vallecas"
              maxLength={60}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              }
            />
          </Field>

          {error && (
            <div
              className="flex items-center gap-2 px-3.5 py-3 rounded-xl text-sm"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
            >
              {error}
            </div>
          )}

          <button
            onClick={save}
            disabled={saving || !name.trim()}
            className="w-full py-4 rounded-2xl font-black text-white relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40"
            style={{
              background: saved
                ? "linear-gradient(135deg, #059669, #047857)"
                : "linear-gradient(135deg, #10b981 0%, #059669 50%, #0ea5e9 100%)",
              backgroundSize: "200% 100%",
              fontSize: 16,
              fontFamily: "var(--font-jakarta), system-ui",
              boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
              transition: "all 0.3s ease",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {saved ? "Guardado!" : saving ? "Guardando..." : "Guardar cambios"}
            </span>
            {!saved && !saving && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)", animation: "shimmer-btn 3s ease-in-out infinite" }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, optional, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-[11px] font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
          {label}
        </label>
        {required && <span className="text-[10px] font-bold" style={{ color: "#10b981" }}>*</span>}
        {optional && <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>opcional</span>}
      </div>
      {children}
    </div>
  );
}

function DarkInput({ icon, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }}>
          {icon}
        </div>
      )}
      <input
        {...props}
        className="w-full py-3.5 rounded-xl text-white font-medium transition-all outline-none"
        style={{
          paddingLeft: icon ? "2.5rem" : "1rem",
          paddingRight: "1rem",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: 15,
        }}
      />
    </div>
  );
}
