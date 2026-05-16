"use client";

import { useState, useRef } from "react";

const STEPS = ["intro", "id", "selfie", "review", "done"];

export default function VerifyIdentityModal({ onClose, onVerified }) {
  const [step, setStep] = useState("intro");
  const [idPhoto, setIdPhoto] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const idRef = useRef(null);
  const selfieRef = useRef(null);

  const handleFile = (setter, e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setter(ev.target.result);
    r.readAsDataURL(f);
  };

  const startReview = () => {
    setStep("review");
    setTimeout(() => {
      setStep("done");
      setTimeout(() => onVerified(), 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-background/95 backdrop-blur z-10 flex items-center justify-between px-5 py-4 border-b border-foreground/10">
          {step !== "done" && step !== "review" ? (
            <button onClick={onClose} className="text-foreground/60 hover:text-foreground text-sm font-medium">
              Cancelar
            </button>
          ) : (
            <span />
          )}
          <h2 className="font-bold flex items-center gap-1.5">
            <span className="text-brand-blue">✓</span>
            Verifica tu identidad
          </h2>
          <span className="text-xs text-foreground/40 font-mono">
            {STEPS.indexOf(step) + 1}/{STEPS.length}
          </span>
        </div>

        <div className="px-6 py-6">
          {step === "intro" && (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white text-4xl shadow-xl">
                ✓
              </div>
              <h3 className="text-2xl font-black mb-2">Más matches con tick azul</h3>
              <p className="text-foreground/65 text-sm leading-relaxed mb-6">
                Los perfiles verificados reciben <b>3× más matches</b> y generan
                confianza al cerrar trueques.
              </p>

              <div className="space-y-3 text-left mb-7">
                <Step icon="📸" title="Foto de tu DNI/NIE" desc="Ambos lados, sobre fondo claro" />
                <Step icon="🤳" title="Selfie" desc="Para comprobar que es tu cara" />
                <Step icon="⚡" title="Listo en 1 minuto" desc="Revisión instantánea con IA" />
              </div>

              <p className="text-[11px] text-foreground/45 mb-4 leading-relaxed">
                🔒 Tus documentos se procesan y se borran al instante. No los almacenamos.
                Cumplimos con el RGPD.
              </p>

              <button
                onClick={() => setStep("id")}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition"
              >
                Empezar verificación
              </button>
            </div>
          )}

          {step === "id" && (
            <div>
              <h3 className="text-xl font-bold mb-2">Paso 1 · Tu DNI o NIE</h3>
              <p className="text-sm text-foreground/65 mb-5">
                Haz una foto clara del frente (lado con tu foto)
              </p>

              <button
                onClick={() => idRef.current?.click()}
                className={`w-full aspect-[1.6] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center mb-5 transition overflow-hidden relative ${
                  idPhoto ? "border-brand-green" : "border-foreground/20 hover:border-brand-green"
                }`}
              >
                {idPhoto ? (
                  <img src={idPhoto} alt="DNI" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <span className="text-5xl mb-2">🪪</span>
                    <span className="font-semibold">Subir foto del DNI</span>
                    <span className="text-xs text-foreground/50">Toca para seleccionar</span>
                  </>
                )}
              </button>
              <input
                ref={idRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(setIdPhoto, e)}
                className="hidden"
              />

              <button
                onClick={() => setStep("selfie")}
                disabled={!idPhoto}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition ${
                  idPhoto
                    ? "bg-gradient-to-r from-brand-green to-brand-blue hover:scale-[1.01]"
                    : "bg-foreground/20 cursor-not-allowed"
                }`}
              >
                Siguiente →
              </button>
            </div>
          )}

          {step === "selfie" && (
            <div>
              <h3 className="text-xl font-bold mb-2">Paso 2 · Selfie</h3>
              <p className="text-sm text-foreground/65 mb-5">
                Mira a la cámara, sin gafas de sol ni gorra
              </p>

              <button
                onClick={() => selfieRef.current?.click()}
                className={`w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center mb-5 transition overflow-hidden relative ${
                  selfie ? "border-brand-green" : "border-foreground/20 hover:border-brand-green"
                }`}
              >
                {selfie ? (
                  <img src={selfie} alt="Selfie" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <span className="text-5xl mb-2">🤳</span>
                    <span className="font-semibold">Hacerme un selfie</span>
                    <span className="text-xs text-foreground/50">O subir foto</span>
                  </>
                )}
              </button>
              <input
                ref={selfieRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => handleFile(setSelfie, e)}
                className="hidden"
              />

              <button
                onClick={startReview}
                disabled={!selfie}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition ${
                  selfie
                    ? "bg-gradient-to-r from-brand-green to-brand-blue hover:scale-[1.01]"
                    : "bg-foreground/20 cursor-not-allowed"
                }`}
              >
                Enviar para verificación
              </button>
            </div>
          )}

          {step === "review" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
              <h3 className="text-xl font-bold mb-2">Comprobando tu identidad...</h3>
              <p className="text-foreground/60 text-sm">
                Nuestra IA está comparando tu DNI con el selfie.
                <br />
                Esto tarda 1-3 segundos.
              </p>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-8 animate-popIn">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white text-5xl shadow-2xl">
                ✓
              </div>
              <h3 className="text-2xl font-black mb-2 bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
                ¡Verificado!
              </h3>
              <p className="text-foreground/65 text-sm">
                Tu perfil ya tiene el tick azul. Disfruta de más matches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-foreground/60">{desc}</p>
      </div>
    </div>
  );
}
