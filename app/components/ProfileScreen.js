"use client";

export default function ProfileScreen({
  myProducts,
  onAdd,
  onDelete,
  onBoost,
  darkMode,
  onToggleDark,
  verified,
  onVerify,
}) {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white text-3xl font-black shadow-xl">
            Y
          </div>
          {verified && (
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-brand-green to-brand-blue text-white text-sm font-black flex items-center justify-center shadow-md border-2 border-background">
              ✓
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Yo</h2>
            {verified && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white text-[10px] font-black">
                VERIFICADO
              </span>
            )}
          </div>
          <p className="text-sm text-foreground/60">Madrid · Miembro nuevo</p>
        </div>
      </div>

      {!verified && (
        <button
          onClick={onVerify}
          className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-brand-green/15 to-brand-blue/15 border border-brand-green/30 text-left hover:scale-[1.01] transition flex items-center gap-3 animate-fadeIn"
        >
          <span className="text-3xl">✓</span>
          <div className="flex-1">
            <p className="font-bold text-sm bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
              Verifica tu identidad
            </p>
            <p className="text-xs text-foreground/60 mt-0.5">
              Tick azul + 3× más matches · Tarda 1 minuto
            </p>
          </div>
          <span className="text-brand-blue-dark text-xl">›</span>
        </button>
      )}

      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
          Mis productos ({myProducts.length})
        </h3>
        <button
          onClick={onAdd}
          className="text-sm font-bold bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent"
        >
          + Nuevo
        </button>
      </div>

      {myProducts.length === 0 ? (
        <button
          onClick={onAdd}
          className="w-full py-12 rounded-3xl border-2 border-dashed border-foreground/15 hover:border-brand-green transition flex flex-col items-center gap-2 text-foreground/50 hover:text-brand-green"
        >
          <span className="text-4xl">📦</span>
          <span className="font-semibold">Sube tu primer producto</span>
          <span className="text-xs text-foreground/40">
            Sin productos no aparecerás a otros
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {myProducts.map((p) => (
            <div
              key={p.id}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${p.photos[0]}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => onBoost?.(p)}
                  className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-black shadow"
                  aria-label="Boost"
                >
                  🚀 BOOST
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center hover:bg-red-500 transition"
                  aria-label="Eliminar"
                >
                  🗑
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-bold text-sm leading-tight">{p.title}</p>
                <p className="text-[11px] text-white/80 mt-0.5">Por {p.wants}</p>
              </div>
            </div>
          ))}
          <button
            onClick={onAdd}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-foreground/15 hover:border-brand-green transition flex flex-col items-center justify-center text-foreground/40 hover:text-brand-green"
          >
            <span className="text-3xl">+</span>
            <span className="text-xs font-semibold mt-1">Añadir</span>
          </button>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <button
          onClick={onToggleDark}
          className="w-full p-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3 text-left">
            <span className="text-2xl">{darkMode ? "🌙" : "☀️"}</span>
            <div>
              <p className="font-bold text-sm">Modo {darkMode ? "oscuro" : "claro"}</p>
              <p className="text-[12px] text-foreground/55">
                Toca para cambiar
              </p>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full p-0.5 transition ${darkMode ? "bg-brand-blue" : "bg-foreground/20"}`}>
            <div className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${darkMode ? "translate-x-5" : ""}`} />
          </div>
        </button>

        <div className="p-4 rounded-2xl bg-foreground/5 text-sm text-foreground/70">
          <p className="font-bold mb-1">💡 Consejo</p>
          <p className="text-[13px] leading-relaxed">
            Cuantos más productos subas, más matches conseguirás. Fotos claras y descripción
            honesta son la clave.
          </p>
        </div>
      </div>
    </div>
  );
}
