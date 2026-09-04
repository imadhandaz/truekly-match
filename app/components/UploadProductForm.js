"use client";

import { useState, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  { id: "Móvil", emoji: "📱" },
  { id: "Consola", emoji: "🎮" },
  { id: "Portátil", emoji: "💻" },
  { id: "Tablet", emoji: "📟" },
  { id: "Cámara", emoji: "📷" },
  { id: "Vehículo", emoji: "🚗" },
  { id: "Vivienda", emoji: "🏠" },
  { id: "Equipo", emoji: "⚽" },
  { id: "Movilidad", emoji: "🛴" },
  { id: "Ropa", emoji: "👗" },
  { id: "Hogar", emoji: "🏡" },
  { id: "Otro", emoji: "📦" },
];

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export default function UploadProductForm({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [storage, setStorage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [location, setLocation] = useState("");
  const [wants, setWants] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const { user } = useAuth();
  const supabase = getSupabase();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    const toAdd = [];
    for (const file of files.slice(0, remaining)) {
      if (file.size > MAX_PHOTO_BYTES) { setError(`"${file.name}" supera el límite de 10 MB.`); continue; }
      toAdd.push({ file, preview: URL.createObjectURL(file) });
    }
    setPhotos((p) => [...p, ...toAdd]);
    e.target.value = "";
  };

  const removePhoto = (idx) => {
    setPhotos((p) => { URL.revokeObjectURL(p[idx].preview); return p.filter((_, i) => i !== idx); });
  };

  const isValid = title.trim() && wants.trim() && photos.length > 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!isValid || !user) return;
    setLoading(true); setError(null);
    try {
      const photoUrls = [];
      for (let i = 0; i < photos.length; i++) {
        const { file } = photos[i];
        const path = `${user.id}/${Date.now()}_${i}`;
        const { error: uploadError } = await supabase.storage.from("product-photos").upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("product-photos").getPublicUrl(path);
        photoUrls.push(urlData.publicUrl);
      }
      const { data: product, error: insertError } = await supabase.from("products").insert({
        title: title.trim(), storage_detail: storage.trim() || null, category,
        neighborhood: location.trim() || null, wants: wants.trim(),
        description: description.trim() || null,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        photos: photoUrls, owner_id: user.id, active: true,
      }).select().single();
      if (insertError) throw insertError;
      onSave(product);
    } catch (err) {
      setError(err.message || "Error al publicar. Inténtalo de nuevo.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-foreground/5">
        <div className="sticky top-0 bg-background/95 backdrop-blur z-10 flex items-center justify-between px-5 py-4 border-b border-foreground/5">
          <button type="button" onClick={onClose} className="text-foreground/60 hover:text-foreground text-sm font-medium">Cancelar</button>
          <h2 className="font-bold text-lg bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">Nuevo producto</h2>
          <button type="submit" form="upload-form" disabled={!isValid || loading} className={`text-sm font-bold ${isValid && !loading ? "bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent" : "text-foreground/30"}`}>
            {loading ? "Subiendo…" : "Publicar"}
          </button>
        </div>

        {error && <div className="mx-5 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">{error}</div>}

        <form id="upload-form" onSubmit={submit} className="px-5 py-5 space-y-5">
          <Section label="Fotos" hint={`${photos.length}/5 · La primera será la principal`}>
            <div className="grid grid-cols-3 gap-2">
              {photos.map(({ preview }, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-foreground/10">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center">✕</button>
                  {idx === 0 && <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-brand-green text-white text-[9px] font-bold">PRINCIPAL</span>}
                </div>
              ))}
              {photos.length < 5 && (
                <button type="button" onClick={() => fileRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-foreground/20 hover:border-brand-green flex flex-col items-center justify-center text-foreground/50 hover:text-brand-green transition">
                  <span className="text-2xl">📷</span><span className="text-xs mt-1 font-medium">Añadir</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
          </Section>

          <Section label="Categoría">
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((c) => (
                <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                  className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition ${category === c.id ? "border-brand-green bg-brand-green/10" : "border-foreground/10 hover:border-foreground/30"}`}>
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-[10px] font-bold text-center leading-tight">{c.id}</span>
                </button>
              ))}
            </div>
          </Section>

          {category === "Equipo" && (
            <div className="p-3 rounded-xl bg-brand-green/10 border border-brand-green/20 text-sm text-brand-green-dark animate-fadeIn">
              <p className="font-bold mb-0.5">⚽ Publica tu equipo</p>
              <p className="text-xs text-foreground/60">Describe tu equipo, cuándo queréis jugar y qué buscáis (rival, compañeros, cancha...)</p>
            </div>
          )}

          {category === "Vivienda" && (
            <div className="p-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-sm text-brand-blue-dark animate-fadeIn">
              <p className="font-bold mb-0.5">🏠 Intercambia vivienda</p>
              <p className="text-xs text-foreground/60">Puedes ofrecer tu piso, habitación o casa de vacaciones y buscar otra equivalente.</p>
            </div>
          )}

          <Section label="Título">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={category === "Equipo" ? "Ej: Equipo fútbol sala · Madrid · 5vs5" : "Ej: iPhone 13 Pro"} maxLength={40} required />
          </Section>

          <Section label="Detalle (opcional)">
            <Input value={storage} onChange={(e) => setStorage(e.target.value)} placeholder={category === "Equipo" ? "Ej: Buscamos rival para sábado tarde" : "Ej: 256GB · Negro"} maxLength={40} />
          </Section>

          <Section label="Tu ciudad o zona">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej: Madrid · Vallecas" maxLength={50} />
          </Section>

          <Section label={category === "Equipo" ? "¿Qué buscáis?" : "Lo cambias por"} hint="Sé concreto: más matches">
            <Input value={wants} onChange={(e) => setWants(e.target.value)}
              placeholder={category === "Equipo" ? "Ej: Rival para pachanga o compañeros de defensa" : "Ej: PS5 + diferencia"}
              maxLength={60} required />
          </Section>

          <Section label="Descripción">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder={category === "Equipo" ? "Nivel, horarios, dónde soléis jugar, cuántos sois..." : "Estado, motivo del trueque, lo que quieras contar..."}
              maxLength={250} rows={4} />
            <p className="text-[11px] text-foreground/40 text-right mt-1">{description.length}/250</p>
          </Section>

          <Section label="Etiquetas" hint="Separadas por comas">
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
              placeholder={category === "Equipo" ? "Fútbol sala, Sábados, Nivel medio" : "Sin golpes, Factura, Caja original"} />
          </Section>

          <div className="pt-2 pb-6">
            <button type="submit" disabled={!isValid || loading}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition ${isValid && !loading ? "bg-gradient-to-r from-brand-green to-brand-blue hover:scale-[1.02]" : "bg-foreground/20 cursor-not-allowed"}`}>
              {loading ? "Publicando…" : isValid ? "Publicar" : "Completa los campos obligatorios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-bold uppercase tracking-wide text-foreground/70">{label}</label>
        {hint && <span className="text-[11px] text-foreground/40">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input(props) {
  return <input {...props} className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition placeholder:text-foreground/30 text-foreground" />;
}

function Textarea(props) {
  return <textarea {...props} className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition placeholder:text-foreground/30 text-foreground resize-none" />;
}
