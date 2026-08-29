"use client";
import { useState, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  { id:"Móvil", emoji:"📱" },
  { id:"Consola", emoji:"🎮" },
  { id:"Portátil", emoji:"💻" },
  { id:"Tablet", emoji:"📲" },
  { id:"Cámara", emoji:"📸" },
  { id:"Movilidad", emoji:"🛴" },
  { id:"Ropa", emoji:"👕" },
  { id:"Hogar", emoji:"🏠" },
  { id:"Deporte", emoji:"🏋️" },
  { id:"Música", emoji:"🎵" },
  { id:"Libros", emoji:"📚" },
  { id:"Otro", emoji:"📦" },
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
    setPhotos((p) => { URL.revokeObjectURL(p[idx].preview); return p.filter((_,i) => i!==idx); });
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
        title: title.trim(), storage_detail: storage.trim()||null, category,
        neighborhood: location.trim()||null,
        wants: wants.trim(), description: description.trim()||null,
        tags: tagsInput.split(",").map(t=>t.trim()).filter(Boolean),
        photos: photoUrls, owner_id: user.id, active: true,
      }).select().single();
      if (insertError) throw insertError;
      onSave(product);
    } catch (err) {
      setError(err.message || "Error al publicar. Inténtalo de nuevo.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center sm:p-6" style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)"}}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[94vh] overflow-y-auto" style={{boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-black/5" style={{background:"rgba(255,255,255,0.97)",backdropFilter:"blur(12px)"}}>
          <button type="button" onClick={onClose} className="text-sm font-semibold" style={{color:"rgba(0,0,0,0.4)"}}>Cancelar</button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg,#10b981,#0ea5e9)"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <h2 className="font-black text-lg" style={{background:"linear-gradient(135deg,#059669,#0ea5e9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Nuevo producto</h2>
          </div>
          <button type="submit" form="upload-form" disabled={!isValid||loading}
            className="text-sm font-black px-4 py-1.5 rounded-full transition"
            style={{background:isValid&&!loading?"linear-gradient(135deg,#10b981,#059669)":"rgba(0,0,0,0.1)",color:isValid&&!loading?"white":"rgba(0,0,0,0.3)"}}>
            {loading?"...":"Publicar"}
          </button>
        </div>

        {error && <div className="mx-5 mt-4 p-3 rounded-2xl text-sm" style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#dc2626"}}>{error}</div>}

        <form id="upload-form" onSubmit={submit} className="px-5 py-5 space-y-6">

          {/* FOTOS */}
          <Field label="Fotos" tag={`${photos.length}/5`} required>
            <div className="grid grid-cols-3 gap-2 mb-1">
              {photos.map(({preview},idx)=>(
                <div key={idx} className="relative rounded-2xl overflow-hidden" style={{aspectRatio:"1",border:"2px solid rgba(16,185,129,0.3)"}}>
                  <img src={preview} alt="" className="w-full h-full object-cover"/>
                  <button type="button" onClick={()=>removePhoto(idx)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background:"rgba(0,0,0,0.65)"}}>✕</button>
                  {idx===0&&<span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-white font-black" style={{fontSize:8,background:"#10b981"}}>PRINCIPAL</span>}
                </div>
              ))}
              {photos.length<5&&(
                <button type="button" onClick={()=>fileRef.current?.click()} className="rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95" style={{aspectRatio:"1",border:"2px dashed rgba(16,185,129,0.4)",background:"rgba(16,185,129,0.04)"}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 16V8M8 12l4-4 4 4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="#10b981" strokeWidth="1.5"/></svg>
                  <span className="text-xs font-bold mt-1" style={{color:"#10b981"}}>Añadir</span>
                </button>
              )}
            </div>
            <p className="text-xs" style={{color:"rgba(0,0,0,0.35)"}}>La primera foto será la portada · Máx 10 MB cada una</p>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden"/>
          </Field>

          {/* CATEGORÍA — grid visual */}
          <Field label="Categoría" required>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(({id,emoji})=>(
                <button key={id} type="button" onClick={()=>setCategory(id)}
                  className="flex flex-col items-center justify-center rounded-2xl py-2.5 px-1 transition-all active:scale-95"
                  style={{background:category===id?"linear-gradient(135deg,rgba(16,185,129,0.15),rgba(14,165,233,0.15))":"rgba(0,0,0,0.04)",border:category===id?"2px solid #10b981":"2px solid transparent"}}>
                  <span style={{fontSize:22}}>{emoji}</span>
                  <span className="font-semibold mt-1" style={{fontSize:9,color:category===id?"#059669":"rgba(0,0,0,0.5)"}}>{id}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* TÍTULO */}
          <Field label="Título del producto" required>
            <Inp value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ej: iPhone 13 Pro" maxLength={40} required/>
            <p className="text-right text-xs mt-1" style={{color:"rgba(0,0,0,0.3)"}}>{title.length}/40</p>
          </Field>

          {/* DETALLE */}
          <Field label="Detalle" tag="Opcional">
            <Inp value={storage} onChange={e=>setStorage(e.target.value)} placeholder="Ej: 256GB · Negro · Buen estado" maxLength={40}/>
          </Field>

          {/* UBICACIÓN */}
          <Field label="Tu ubicación" tag="Ciudad o barrio">
            <Inp value={location} onChange={e=>setLocation(e.target.value)} placeholder="Ej: Barcelona, Valencia, Bilbao..."/>
          </Field>

          {/* LO CAMBIAS POR */}
          <Field label="¿Qué quieres a cambio?" required>
            <Inp value={wants} onChange={e=>setWants(e.target.value)} placeholder="Ej: PS5, MacBook, cualquier oferta..." maxLength={60} required/>
            <p className="text-xs mt-1" style={{color:"rgba(0,0,0,0.35)"}}>Sé específico para conseguir más matches</p>
          </Field>

          {/* DESCRIPCIÓN */}
          <Field label="Descripción" tag="Opcional">
            <Txta value={description} onChange={e=>setDescription(e.target.value)} placeholder="Estado, motivo del trueque, lo que quieras contar..." maxLength={250} rows={3}/>
            <p className="text-right text-xs mt-1" style={{color:"rgba(0,0,0,0.3)"}}>{description.length}/250</p>
          </Field>

          {/* ETIQUETAS */}
          <Field label="Etiquetas" tag="Separadas por comas">
            <Inp value={tagsInput} onChange={e=>setTagsInput(e.target.value)} placeholder="Sin golpes, Caja original, Factura"/>
          </Field>

          {/* BOTÓN SUBMIT */}
          <div className="pt-2 pb-8">
            <button type="submit" disabled={!isValid||loading} className="w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-[0.98]"
              style={{background:isValid&&!loading?"linear-gradient(135deg,#10b981,#059669)":"rgba(0,0,0,0.12)",boxShadow:isValid&&!loading?"0 8px 24px rgba(16,185,129,0.35)":"none",cursor:isValid&&!loading?"pointer":"not-allowed"}}>
              {loading?"🔄 Publicando...":isValid?"🚀 Publicar producto":"Completa los campos obligatorios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({label,tag,required,children}){
  return(
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="font-black text-xs uppercase tracking-wider" style={{color:"rgba(0,0,0,0.55)"}}>
          {label}{required&&<span style={{color:"#10b981",marginLeft:2}}>*</span>}
        </label>
        {tag&&<span className="text-xs font-medium" style={{color:"rgba(0,0,0,0.3)"}}>{tag}</span>}
      </div>
      {children}
    </div>
  );
}

function Inp(props){
  return <input {...props} className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none" style={{background:"rgba(0,0,0,0.04)",border:"1.5px solid rgba(0,0,0,0.08)"}} onFocus={e=>{e.target.style.border="1.5px solid #10b981";e.target.style.background="white";}} onBlur={e=>{e.target.style.border="1.5px solid rgba(0,0,0,0.08)";e.target.style.background="rgba(0,0,0,0.04)";}} />;
}

function Txta(props){
  return <textarea {...props} className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none resize-none" style={{background:"rgba(0,0,0,0.04)",border:"1.5px solid rgba(0,0,0,0.08)"}} onFocus={e=>{e.target.style.border="1.5px solid #10b981";e.target.style.background="white";}} onBlur={e=>{e.target.style.border="1.5px solid rgba(0,0,0,0.08)";e.target.style.background="rgba(0,0,0,0.04)";}} />;
}