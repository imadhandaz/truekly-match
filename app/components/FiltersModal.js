"use client";

import { useState } from "react";

const ALL_CATEGORIES = ["Móvil", "Consola", "Portátil", "Tablet", "Cámara", "Movilidad", "Ropa", "Hogar"];

export default function FiltersModal({ initial, onClose, onApply }) {
  const [cats, setCats] = useState(initial.cats || []);
  const [maxKm, setMaxKm] = useState(initial.maxKm ?? 10);
  const [verifiedOnly, setVerifiedOnly] = useState(initial.verifiedOnly || false);

  const toggle = (c) =>
    setCats((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));

  const apply = () => onApply({ cats, maxKm, verifiedOnly });
  const clear = () => {
    setCats([]);
    setMaxKm(10);
    setVerifiedOnly(false);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[88vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-background/95 backdrop-blur z-10 flex items-center justify-between px-5 py-4 border-b border-foreground/10">
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground text-sm font-medium">
            Cancelar
          </button>
          <h2 className="font-bold text-lg">Filtros</h2>
          <button onClick={clear} className="text-sm font-bold text-foreground/60">
            Limpiar
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/70">
                Categorías
              </h3>
              <span className="text-[11px] text-foreground/50">
                {cats.length === 0 ? "Todas" : `${cats.length} seleccionadas`}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((c) => {
                const active = cats.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggle(c)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition ${
                      active
                        ? "bg-gradient-to-r from-brand-green to-brand-blue text-white border-transparent shadow-md"
                        : "bg-transparent border-foreground/15 text-foreground/70 hover:border-brand-blue/50"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/70">
                Distancia máxima
              </h3>
              <span className="text-sm font-bold bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
                {maxKm} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={maxKm}
              onChange={(e) => setMaxKm(Number(e.target.value))}
              className="w-full accent-brand-blue"
            />
            <div className="flex justify-between text-[10px] text-foreground/40 mt-1">
              <span>1 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>

          <div>
            <button
              onClick={() => setVerifiedOnly((v) => !v)}
              className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition ${
                verifiedOnly
                  ? "border-brand-green bg-brand-green/10"
                  : "border-foreground/15 bg-transparent"
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-green to-brand-blue text-white text-sm font-black flex items-center justify-center">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-bold">Solo verificados</p>
                  <p className="text-[11px] text-foreground/55">
                    Menos estafas, más confianza
                  </p>
                </div>
              </div>
              <div
                className={`w-11 h-6 rounded-full p-0.5 transition ${
                  verifiedOnly ? "bg-brand-blue" : "bg-foreground/20"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    verifiedOnly ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        <div className="px-5 pt-2 pb-6">
          <button
            onClick={apply}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-lg shadow-lg hover:scale-[1.01] transition"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
