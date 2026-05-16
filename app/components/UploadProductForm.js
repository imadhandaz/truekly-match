"use client";

import { useState, useRef } from "react";

const CATEGORIES = [
  "Móvil",
  "Consola",
  "Portátil",
  "Tablet",
  "Cámara",
  "Movilidad",
  "Ropa",
  "Hogar",
  "Otro",
];

const MADRID_NEIGHBORHOODS = [
  "Centro",
  "Chamberí",
  "Salamanca",
  "Retiro",
  "Malasaña",
  "Lavapiés",
  "Moncloa",
  "Chamartín",
  "Tetuán",
  "Latina",
  "Carabanchel",
  "Vallecas",
  "Hortaleza",
];

export default function UploadProductForm({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [storage, setStorage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [neighborhood, setNeighborhood] = useState(MADRID_NEIGHBORHOODS[0]);
  const [wants, setWants] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [photos, setPhotos] = useState([]);
  const fileRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    files.slice(0, remaining).forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((p) => [...p, ev.target.result]);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  };

  const removePhoto = (idx) => setPhotos((p) => p.filter((_, i) => i !== idx));

  const isValid = title.trim() && wants.trim() && photos.length > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    const product = {
      id: Date.now(),
      title: title.trim(),
      storage: storage.trim(),
      category,
      owner: "Tú",
      age: "",
      location: `Madrid · ${neighborhood}`,
      distance: "0 km",
      photos,
      wants: wants.trim(),
      description: description.trim(),
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isMine: true,
      createdAt: Date.now(),
    };
    onSave(product);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 flex items-center justify-between px-5 py-4 border-b border-foreground/5">
          <button
            type="button"
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground text-sm font-medium"
          >
            Cancelar
          </button>
          <h2 className="font-bold text-lg bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
            Nuevo producto
          </h2>
          <button
            type="submit"
            form="upload-form"
            disabled={!isValid}
            className={`text-sm font-bold ${
              isValid
                ? "bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent"
                : "text-foreground/30"
            }`}
          >
            Publicar
          </button>
        </div>

        <form id="upload-form" onSubmit={submit} className="px-5 py-5 space-y-5">
          <Section label="Fotos" hint={`${photos.length}/5 · La primera será la principal`}>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-foreground/10">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-brand-green text-white text-[9px] font-bold">
                      PRINCIPAL
                    </span>
                  )}
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-foreground/20 hover:border-brand-green flex flex-col items-center justify-center text-foreground/50 hover:text-brand-green transition"
                >
                  <span className="text-2xl">📷</span>
                  <span className="text-xs mt-1 font-medium">Añadir</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
          </Section>

          <Section label="Título">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: iPhone 13 Pro"
              maxLength={40}
              required
            />
          </Section>

          <Section label="Detalle (opcional)">
            <Input
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              placeholder="Ej: 256GB · Negro"
              maxLength={40}
            />
          </Section>

          <Section label="Categoría">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Section>

          <Section label="Tu barrio">
            <Select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
              {MADRID_NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
          </Section>

          <Section label="Lo cambias por" hint="Sé concreto: más matches">
            <Input
              value={wants}
              onChange={(e) => setWants(e.target.value)}
              placeholder="Ej: PS5 + diferencia"
              maxLength={60}
              required
            />
          </Section>

          <Section label="Descripción">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Estado, motivo del trueque, lo que quieras contar..."
              maxLength={250}
              rows={4}
            />
            <p className="text-[11px] text-foreground/40 text-right mt-1">
              {description.length}/250
            </p>
          </Section>

          <Section label="Etiquetas" hint="Separadas por comas">
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Sin golpes, Factura, Caja original"
            />
          </Section>

          <div className="pt-2 pb-6">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition ${
                isValid
                  ? "bg-gradient-to-r from-brand-green to-brand-blue hover:scale-[1.02]"
                  : "bg-foreground/20 cursor-not-allowed"
              }`}
            >
              {isValid ? "Publicar producto" : "Completa los campos obligatorios"}
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
        <label className="text-xs font-bold uppercase tracking-wide text-foreground/70">
          {label}
        </label>
        {hint && <span className="text-[11px] text-foreground/40">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-white focus:outline-none transition placeholder:text-foreground/30 text-foreground"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-white focus:outline-none transition placeholder:text-foreground/30 text-foreground resize-none"
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-white focus:outline-none transition text-foreground appearance-none"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23042f2e' d='M6 8L0 0h12z' opacity='0.5'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 16px center",
        paddingRight: "40px",
      }}
    />
  );
}
