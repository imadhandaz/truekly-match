"use client";

import Link from "next/link";

export default function ProfileScreen({
  myProducts = [],
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
  isGold,
  boostCredits,
}) {
  const displayName = profile?.display_name || (user?.email ? user.email.split("@")[0] : "Yo");
  const initial = displayName.charAt(0).toUpperCase();
  const subtitle = user?.email || "Miembro nuevo";

  return (
    <div className="w-full max-w-md">
      {isGold && (
        <div className="w-full mb-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 font-black text-sm tracking-wide" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%)", color: "white", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}>
          ✨ TRUEKLY GOLD — Activo
        </div>
      )}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl" style={{ background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)" }}>{initial}</div>
          {verified && <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full text-white text-sm font-black flex items-center justify-center shadow-lg border-2 border-background" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}>✓</span>}
          {isGold && <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-lg border-2 border-background" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>✨</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h2 className="text-2xl font-black truncate">{displayName}</h2>
            {verified && <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-black shrink-0" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}>VERIFICADO</span>}
          </div>
          <p className="text-sm text-foreground/55 truncate mb-2">{subtitle}</p>
          <button className="px-3 py-1 rounded-full text-xs font-bold border border-foreground/15 text-foreground/60 hover:border-brand-green hover:text-brand-green transition">Editar perfil</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[{ label: "Productos", value: myProducts.length }, { label: "Matches", value: "—" }, { label: "Truekes", value: 0 }].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-3 rounded-2xl border border-foreground/8 bg-foreground/3">
            <span className="text-xl font-black">{value}</span>
            <span className="text-[11px] text-foreground/50 font-semibold mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {!user && (
        <button onClick={onSignIn} className="w-full mb-6 py-4 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.01] transition" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}>
          Inicia sesión o regístrate
        </button>
      )}

      {!verified && (
        <button onClick={onVerify} className="w-full mb-6 p-4 rounded-2xl border border-brand-green/30 text-left hover:scale-[1.01] transition flex items-center gap-3 animate-fadeIn" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(14,165,233,0.08))" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}>✓</div>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ background: "linear-gradient(135deg, #047857, #0369a1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Verifica tu identidad</p>
            <p className="text-xs text-foreground/55 mt-0.5">Tick azul + 3× más matches · Tarda 1 minuto</p>
          </div>
          <span className="text-brand-blue-dark text-xl">›</span>
        </button>
      )}

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-foreground/60">Mis productos ({myProducts.length})</h3>
        <div className="flex items-center gap-2">
          {isGold && (
            <button onClick={boostCredits > 0 ? null : onBuyBoosts} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition ${boostCredits > 0 ? "bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-orange-600 border border-orange-300/40" : "bg-foreground/5 text-foreground/40 border border-foreground/10 hover:bg-foreground/10"}`}>
              🚀 {boostCredits > 0 ? `${boostCredits} boost${boostCredits !== 1 ? "s" : ""}` : "Sin boosts"}
            </button>
          )}
          <button onClick={onAdd} className="text-sm font-black px-3 py-1 rounded-full text-white shadow transition hover:scale-105" style={{ background: "linear-gradient(135deg, #047857, #0369a1)" }}>+ Nuevo</button>
        </div>
      </div>

      {myProducts.length === 0 ? (
        <button onClick={onAdd} className="w-full py-14 rounded-3xl border-2 border-dashed border-foreground/15 hover:border-brand-green transition flex flex-col items-center gap-2 text-foreground/50 hover:text-brand-green">
          <span className="text-5xl mb-1">📦</span>
          <span className="font-bold">Sube tu primer producto</span>
          <span className="text-xs text-foreground/40">Sin productos no aparecerás a otros</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {myProducts.map((p) => (
            <div key={p.id} className="relative rounded-2xl overflow-hidden shadow-lg group" style={{ aspectRatio: "3/4" }}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url('${p.photos?.[0]}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={() => { if (!isGold) { onBoost?.(p); return; } if (boostCredits > 0) { onBoost?.(p); } else { onBuyBoosts?.(); } }} className={`px-2.5 py-1 rounded-full text-white text-[10px] font-black shadow transition ${isGold && boostCredits > 0 ? "bg-gradient-to-r from-yellow-400 to-orange-500" : isGold ? "bg-black/50" : "bg-gradient-to-r from-yellow-400 to-orange-500"}`}>
                  🚀 {isGold && boostCredits <= 0 ? "Sin boosts" : "BOOST"}
                </button>
                <button onClick={() => onDelete(p.id)} className="w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center hover:bg-red-500 transition" aria-label="Eliminar">🗑</button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-bold text-sm leading-tight">{p.title}</p>
                <p className="text-[11px] text-white/75 mt-0.5">🔄 {p.wants}</p>
              </div>
            </div>
          ))}
          <button onClick={onAdd} className="rounded-2xl border-2 border-dashed border-foreground/15 hover:border-brand-green transition flex flex-col items-center justify-center text-foreground/40 hover:text-brand-green" style={{ aspectRatio: "3/4" }}>
            <span className="text-4xl">+</span>
            <span className="text-xs font-bold mt-1">Añadir</span>
          </button>
        </div>
      )}

      <div className="mt-8 space-y-2.5">
        <button onClick={onToggleDark} className="w-full p-4 rounded-2xl bg-foreground/4 hover:bg-foreground/8 transition flex items-center justify-between border border-foreground/6">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-foreground/6 flex items-center justify-center text-xl">{darkMode ? "🌙" : "☀️"}</div>
            <div>
              <p className="font-bold text-sm">Modo {darkMode ? "oscuro" : "claro"}</p>
              <p className="text-[12px] text-foreground/50">Toca para cambiar</p>
            </div>
          </div>
          <div className="w-12 h-7 rounded-full p-0.5 transition" style={{ background: darkMode ? "#0ea5e9" : "rgba(0,0,0,0.15)" }}>
            <div className="w-6 h-6 rounded-full bg-white shadow transition-transform" style={{ transform: darkMode ? "translateX(20px)" : "translateX(0)" }} />
          </div>
        </button>
        <div className="p-4 rounded-2xl bg-foreground/4 border border-foreground/6 text-sm text-foreground/70">
          <p className="font-bold mb-1 text-sm">💡 Consejo</p>
          <p className="text-[13px] leading-relaxed text-foreground/60">Cuantos más productos subas, más matches conseguirás. Fotos claras y descripción honesta son la clave.</p>
        </div>
        {user && (
          <>
            <button onClick={onSignOut} className="w-full p-3.5 rounded-2xl text-sm font-bold text-foreground/60 hover:bg-foreground/5 transition border border-foreground/8">Cerrar sesión</button>
            <button onClick={onDeleteAccount} className="w-full p-3 rounded-2xl text-xs font-bold text-red-500/70 hover:bg-red-50 dark:hover:bg-red-900/10 transition">Eliminar mi cuenta</button>
          </>
        )}
        <div className="text-center pt-2 pb-2">
          <Link href="/legal" className="text-xs text-foreground/35 hover:text-foreground/60 transition underline underline-offset-2">Términos y Privacidad</Link>
        </div>
      </div>
    </div>
  );
            }
