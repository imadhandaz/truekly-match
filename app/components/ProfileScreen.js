"use client";

import Link from "next/link";

export default function ProfileScreen({
  myProducts,
  onAdd,
  onDelete,
  onBoost,
  onBuyBoosts,
  darkMode,
  onToggleDark,
  verified,
  onVerify,
  user,
  profile,
  onSignOut,
  onSignIn,
  onDeleteAccount,
  onEdit,
}) {
  const displayName = profile?.display_name || (user?.email ? user.email.split("@")[0] : "Yo");
  const initial = displayName.charAt(0).toUpperCase();
  const subtitle = user?.email || "Miembro nuevo";

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {initial}
          </div>
          {verified && (
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-brand-green to-brand-blue text-white text-sm font-black flex items-center justify-center shadow-md border-2 border-background">
              Ã¢ÂÂ
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold truncate">{displayName}</h2>
            {verified && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white text-[10px] font-black shrink-0">
                VERIFICADO
              </span>
            )}
          </div>
          <p className="text-sm text-foreground/60 truncate">{subtitle}</p>
        </div>
        {user && onEdit && (
          <button
            onClick={onEdit}
            className="flex-none px-3 py-1.5 rounded-full text-xs font-bold bg-foreground/8 hover:bg-foreground/15 border border-foreground/10 transition"
          >
            Editar
          </button>
        )}
      </div>

      {!user && (
        <button
          onClick={onSignIn}
          className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold shadow-lg hover:scale-[1.01] transition"
        >
          Inicia sesiÃÂ³n o regÃÂ­strate
        </button>
      )}

      {!verified && (
        <button
          onClick={onVerify}
          className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-brand-green/15 to-brand-blue/15 border border-brand-green/30 text-left hover:scale-[1.01] transition flex items-center gap-3 animate-fadeIn"
        >
          <span className="text-3xl">Ã¢ÂÂ</span>
          <div className="flex-1">
            <p className="font-bold text-sm bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
              Verifica tu identidad
            </p>
            <p className="text-xs text-foreground/60 mt-0.5">
              Tick azul + 3ÃÂ mÃÂ¡s matches ÃÂ· Tarda 1 minuto
            </p>
          </div>
          <span className="text-brand-blue-dark text-xl">Ã¢ÂÂº</span>
        </button>
      )}

      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
          Mis productos ({myProducts.length})
        </h3>
        <div className="flex items-center gap-2">
          {isGold && (
            <button
              onClick={boostCredits > 0 ? null : onBuyBoosts}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition ${
                boostCredits > 0
                  ? "bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-orange-600 border border-orange-300/40"
                  : "bg-foreground/5 text-foreground/40 border border-foreground/10 hover:bg-foreground/10"
              }`}
            >
              🚀 {boostCredits > 0 ? `${boostCredits} boost${boostCredits !== 1 ? "s" : ""}` : "Sin boosts"}
            </button>
          )}
          <button
            onClick={onAdd}
            className="text-sm font-bold bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent"
          >
            + Nuevo
          </button>
        </div>
      </div>

      {myProducts.length === 0 ? (
        <button
          onClick={onAdd}
          className="w-full py-12 rounded-3xl border-2 border-dashed border-foreground/15 hover:border-brand-green transition flex flex-col items-center gap-2 text-foreground/50 hover:text-brand-green"
        >
          <span className="text-4xl">Ã°ÂÂÂ¦</span>
          <span className="font-semibold">Sube tu primer producto</span>
          <span className="text-xs text-foreground/40">
            Sin productos no aparecerÃÂ¡s a otros
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
                  Ã°ÂÂÂ BOOST
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center hover:bg-red-500 transition"
                  aria-label="Eliminar"
                >
                  Ã°ÂÂÂ
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
            <span className="text-xs font-semibold mt-1">AÃÂ±adir</span>
          </button>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <button
          onClick={onToggleDark}
          className="w-full p-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3 text-left">
            <span className="text-2xl">{darkMode ? "Ã°ÂÂÂ" : "Ã¢ÂÂÃ¯Â¸Â"}</span>
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
          <p className="font-bold mb-1">Ã°ÂÂÂ¡ Consejo</p>
          <p className="text-[13px] leading-relaxed">
            Cuantos mÃÂ¡s productos subas, mÃÂ¡s matches conseguirÃÂ¡s. Fotos claras y descripciÃÂ³n
            honesta son la clave.
          </p>
        </div>

        {user && (
          <>
            <button
              onClick={onSignOut}
              className="w-full p-3 rounded-2xl text-sm font-bold text-foreground/70 hover:bg-foreground/5 transition"
            >
              Cerrar sesiÃÂ³n
            </button>
            <button
              onClick={onDeleteAccount}
              className="w-full p-3 rounded-2xl text-xs font-bold text-red-500/80 hover:bg-red-50 transition"
            >
              Eliminar mi cuenta
            </button>
          </>
        )}
      </div>
        <div className="text-center pt-2 pb-1">
          <Link href="/legal" className="text-xs text-foreground/40 hover:text-foreground/60 transition underline underline-offset-2">
            TÃ©rminos y Privacidad
          </Link>
        </div>
      </div>
    </div>
  );
}
