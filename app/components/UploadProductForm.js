"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Móvil","Consola","Portátil","Tablet","Cámara","Movilidad","Ropa","Hogar","Otro"];
const MADRID_NEIGHBORHOODS = ["Centro","Chamberí","Salamanca","Retiro","Malasaña","Lavapiés","Moncloa","Chamartín","Tetuán","Latina","Carabanchel","Vallecas","Hortaleza"];
const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export default function UploadProductForm({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [storage, setStorage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [neighborhood, setNeighborhood] = useState(MADRID_NEIGHBORHOODS[0]);
  const [wants, setWants] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const titleRef = useRef(null);
  useEffect(() => { titleRef.current?.focus(); }, []);
  const { user } = useAuth();
  const supabase = getSupabase();

  const addFiles = useCallback((files) => {
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) return;
    const toAdd = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_PHOTO_BYTES) { setError(`"${file.name}" supera el límite de 10 MB.`); continue; }
      toAdd.push({ file, preview: URL.createObjectURL(file) });
    }
    if (toAdd.length) { setError(null); setPhotos((p) => [...p, ...toAdd]); }
  }, [photos.length]);

  const handleFiles = (e) => { addFiles(e.target.files || []); e.target.value = ""; };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };
  const removePhoto = (idx) => { setPhotos((p) => { URL.revokeObjectURL(p[idx].preview); return p.filter((_, i) => i !== idx); }); };
  const setAsPrimary = (idx) => { if (idx === 0) return; setPhotos((p) => { const next = [...p]; const [item] = next.splice(idx, 1); next.unshift(item); return next; }); };

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
        title: title.trim(), storage_detail: storage.trim() || null, category, neighborhood,
        wants: wants.trim(), description: description.trim() || null,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        photos: photoUrls, owner_id: user.id, active: true,
      }).select().single();
      if (insertError) throw insertError;
      onSave(product);
    } catch (err) {
      setError(err.message || "Error al publicar el producto. Inténtalo de nuevo.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-background/95 backdrop-blur z-10 flex items-center justify-between px-5 py-4 border-b border-foreground/5">
          <button type="button" onClick={onClose} className="text-foreground/60 hover:text-foreground text-sm font-medium">Cancelar</button>
          <h2 className="font-bold text-lg bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">Nuevo producto</h2>
          <button type="submit" form="upload-form" disabled={!isValid || loading} className={`text-sm font-bold ${isValid && !loading ? "bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent" : "text-foreground/30"}`}>
            {loading ? "Subiendo…" : "Publicar"}
          </button>
        </div>
        {error && <div className="mx-5 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        <form id="upload-form" onSubmit={submit} className="px-5 py-5 space-y-5">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wide text-foreground/70">Fotos <span className="text-brand-green normal-case font-semibold tracking-normal text-[10px]">* obligatorio</span></label>
              <span className="text-[11px] text-foreground/40">{photos.length}/{MAX_PHOTOS} fotos · toca para hacer principal</span>
            </div>
            {photos.length === 0 && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-10 cursor-pointer transition-all"
                style={{ borderColor: dragOver ? "#10b981" : "rgba(255,255,255,0.15)", background: dragOver ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)" }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: dragOver ? "linear-gradient(135deg, #10b981, #0ea5e9)" : "rgba(255,255,255,0.06)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dragOver ? "white" : "rgba(255,255,255,0.4)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="font-bold text-sm" style={{ color: dragOver ? "#10b981" : "rgba(255,255,255,0.5)" }}>{dragOver ? "Suelta las fotos aquí" : "Arrastra fotos o toca para elegir"}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Hasta {MAX_PHOTOS} fotos · 10 MB máx por foto</p>
              </div>
            )}
            {photos.length > 0 && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className="grid grid-cols-4 gap-2"
                style={{ padding: dragOver ? "6px" : "0", borderRadius: 16, border: dragOver ? "2px dashed #10b981" : "2px dashed transparent", transition: "all 0.2s", background: dragOver ? "rgba(16,185,129,0.06)" : "transparent" }}
              >
                {photos.map(({ preview }, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "1", boxShadow: idx === 0 ? "0 0 0 2.5px #10b981" : "none" }}>
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    {idx !== 0 && <button type="button" onClick={() => setAsPrimary(idx)} className="absolute inset-0 bg-black/0 hover:bg-black/30 transition" aria-label="Hacer principal" />}
                    {idx === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 py-1 flex items-center justify-center" style={{ background: "rgba(16,185,129,0.85)" }}>
                        <span className="text-[9px] font-black text-white tracking-wide">PRINCIPAL</span>
                      </div>
                    )}
                    <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-red-500 transition" aria-label="Eliminar foto">✕</button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl border-2 border-dashed border-foreground/20 hover:border-brand-green flex flex-col items-center justify-center text-foreground/40 hover:text-brand-green transition" style={{ aspectRatio: "1" }}>
                    <span className="text-xl leading-none">+</span>
                  </button>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
          </div>

          <Section label="Título"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: iPhone 13 Pro" maxLength={40} required autoFocus /></Section>
          <Section label="Detalle (opcional)"><Input value={storage} onChange={(e) => setStorage(e.target.value)} placeholder="Ej: 256GB · Negro" maxLength={40} /></Section>
          <Section label="Categoría"><Select value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</Select></Section>
          <Section label="Tu barrio"><Select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>{MADRID_NEIGHBORHOODS.map((n) => <option key={n} value={n}>{n}</option>)}</Select></Section>
          <Section label="Lo cambias por" hint="Sé concreto: más matches"><Input value={wants} onChange={(e) => setWants(e.target.value)} placeholder="Ej: PS5 + diferencia" maxLength={60} required /></Section>
          <Section label="Descripción">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Estado, motivo del trueque, lo que quieras contar..." maxLength={250} rows={4} />
            <p className="text-[11px] text-foreground/40 text-right mt-1">{description.length}/250</p>
          </Section>
          <Section label="Etiquetas" hint="Separadas por comas"><Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Sin golpes, Factura, Caja original" /></Section>
          <div className="pt-2 pb-6">
            <button type="submit" disabled={!isValid || loading} className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition ${isValid && !loading ? "bg-gradient-to-r from-brand-green to-brand-blue hover:scale-[1.02]" : "bg-foreground/20 cursor-not-allowed"}`}>
              {loading ? "Publicando…" : isValid ? "Publicar producto" : "Completa los campos obligatorios"}
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
function Input(props) { return <input {...props} className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition placeholder:text-foreground/30 text-foreground" />; }
function Textarea(props) { return <textarea {...props} className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition placeholder:text-foreground/30 text-foreground resize-none" />; }
function Select(props) {
  return (
    <select {...props} className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition text-foreground appearance-none"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23042f2e' d='M6 8L0 0h12z' opacity='0.5'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", paddingRight: "40px" }} />
  );
}
