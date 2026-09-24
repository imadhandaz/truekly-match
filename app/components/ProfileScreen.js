"use client";

import Link from "next/link";

function activityDaysAgo(myProducts = []) {
  if (!myProducts.length) return null;
  const latest = myProducts
    .map((p) => p.created_at)
    .filter(Boolean)
    .sort()
    .reverse()[0];
  if (!latest) return null;
  const diffMs = Date.now() - new Date(latest).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days === 0) return "Activo hoy";
  if (days === 1) return "Activo ayer";
  if (days < 7) return `Activo hace ${days} días`;
  if (days < 30) return `Activo hace ${Math.floor(days / 7)} semanas`;
  return `Activo hace ${Math.floor(days / 30)} meses`;
}

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
  onEditProfile,
  isGold,
  boostCredits,
  matchCount = 0,
  tradeCount = 0,
  avgRating = 0,
  ratingCount = 0,
}) {
  const displayName = profile?.display_name || (user?.email ? user.email.split("@")[0] : "Yo");
  const initial = displayName.charAt(0).toUpperCase();
  const subtitle = user?.email || "Miembro nuevo";
  const activityLabel = activityDaysAgo(myProducts);

  return (
    <div className="w-full max-w-md">
      {isGold && (
        <div
          className="w-full mb-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 font-black text-sm tracking-wide"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%)",
            color: "white",
            boxShadow: "0 4px 20px rgba(245,158,11,0.4)",
          }}
        >
          ✨ TRUEKLY GOLD — Activo
        </div>
      )}

      {/* ── Premium profile header ── */}
      <div style={{
        background: "linear-gradient(to bottom, rgba(16,185,129,0.08) 0%, transparent 100%)",
        padding: "24px 20px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 20,
        marginBottom: 16,
      }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
          <div
            className="animate-pulse-green"
            style={{
              width: 80, height: 80, borderRadius: 40,
              background: "linear-gradient(135deg, #10b981, #0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 900, color: "#fff",
              boxShadow: "0 4px 24px rgba(16,185,129,0.4)",
            }}
          >
            {initial}
          </div>
          {verified && (
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: 24, height: 24, borderRadius: 12,
              background: "#10b981", border: "2px solid #0A0A0C",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: "#fff", fontWeight: 900,
            }}>✓</div>
          )}
          {isGold && (
            <div style={{
              position: "absolute", top: -2, right: -2,
              width: 22, height: 22, borderRadius: 11,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              border: "2px solid #0A0A0C",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10,
            }}>✨</div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>
              {displayName}
            </h2>
            {verified && (
              <span style={{
                padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 800, color: "#fff",
                background: "linear-gradient(135deg, #10b981, #0ea5e9)",
              }}>
                VERIFICADO
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>
            {subtitle}
          </p>
          {activityLabel && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
              background: "rgba(16,185,129,0.1)", color: "#10b981",
              border: "1px solid rgba(16,185,129,0.2)", marginBottom: 8,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              {activityLabel}
            </span>
          )}
          {user && <br />}
          {user && (
            <button
              type="button"
              onClick={onEditProfile}
              style={{
                padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.55)", cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Editar perfil
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 1, borderRadius: 16, overflow: "hidden" }}>
          {[
            { value: tradeCount, label: "Trueques", highlight: tradeCount > 0, suffix: tradeCount > 0 ? " ✓" : "" },
            {
              value: ratingCount > 0 ? avgRating.toFixed(1) : "—",
              label: ratingCount > 0 ? `★ ${ratingCount} reseñas` : "Sin reseñas",
              highlight: false,
            },
            { value: matchCount, label: "Matches", highlight: false },
          ].map(({ value, label, highlight, suffix = "" }) => (
            <div key={label} style={{
              flex: 1, padding: "14px 8px", textAlign: "center",
              background: highlight ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
              borderTop: highlight ? "2px solid rgba(16,185,129,0.5)" : "2px solid transparent",
            }}>
              <div style={{
                fontSize: 22, fontWeight: 900,
                color: highlight ? "#10b981" : "rgba(255,255,255,0.9)",
                lineHeight: 1, marginBottom: 4,
                textShadow: highlight ? "0 0 12px rgba(16,185,129,0.5)" : "none",
              }}>
                {value}{suffix}
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {user?.created_at && (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500, margin: "12px 0 0" }}>
            Miembro desde {new Date(user.created_at).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
            {" · "}{myProducts.length} producto{myProducts.length !== 1 ? "s" : ""} publicado{myProducts.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {!user && (
        <button
          type="button"
          onClick={onSignIn}
          className="w-full mb-6 py-4 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.01] transition"
          style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}
        >
          Inicia sesión o regístrate
        </button>
      )}

      {!verified && (
        <button
          type="button"
          onClick={onVerify}
          className="w-full mb-6 p-4 rounded-2xl border border-brand-green/30 text-left hover:scale-[1.01] transition flex items-center gap-3 animate-fadeIn"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(14,165,233,0.08))" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}
          >
            ✓
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ background: "linear-gradient(135deg, #047857, #0369a1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Verifica tu identidad
            </p>
            <p className="text-xs text-foreground/55 mt-0.5">
              Tick azul + 3× más matches · Tarda 1 minuto
            </p>
          </div>
          <span className="text-brand-blue-dark text-xl">›</span>
        </button>
      )}

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-foreground/60">
          Mis productos ({myProducts.length})
        </h3>
        <div className="flex items-center gap-2">
          {isGold && (
            <button
              type="button"
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
            type="button"
            onClick={onAdd}
            className="text-sm font-black px-3 py-1 rounded-full text-white shadow transition hover:scale-105"
            style={{ background: "linear-gradient(135deg, #047857, #0369a1)" }}
          >
            + Nuevo
          </button>
        </div>
      </div>

      {myProducts.length === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="w-full py-14 rounded-3xl border-2 border-dashed border-foreground/15 hover:border-brand-green transition flex flex-col items-center gap-2 text-foreground/50 hover:text-brand-green"
        >
          <span className="text-5xl mb-1">📦</span>
          <span className="font-bold">Sube tu primer producto</span>
          <span className="text-xs text-foreground/40">
            Sin productos no aparecerás a otros
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {myProducts.map((p) => (
            <div
              key={p.id}
              className="relative rounded-2xl overflow-hidden shadow-lg group"
              style={{ aspectRatio: "3/4" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url('${p.photos?.[0]}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  type="button"
                  onClick={() => {
                    if (!isGold) { onBoost?.(p); return; }
                    if (boostCredits > 0) { onBoost?.(p); }
                    else { onBuyBoosts?.(); }
                  }}
                  className={`px-2.5 py-1 rounded-full text-white text-[10px] font-black shadow transition ${
                    isGold && boostCredits > 0
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                      : isGold
                      ? "bg-black/50"
                      : "bg-gradient-to-r from-yellow-400 to-orange-500"
                  }`}
                >
                  🚀 {isGold && boostCredits <= 0 ? "Sin boosts" : "BOOST"}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  className="w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center hover:bg-red-500 transition"
                  aria-label="Eliminar"
                >
                  🗑
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-bold text-sm leading-tight">{p.title}</p>
                <p className="text-[11px] text-white/75 mt-0.5">🔄 {p.wants}</p>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={onAdd}
            className="rounded-2xl border-2 border-dashed border-foreground/15 hover:border-brand-green transition flex flex-col items-center justify-center text-foreground/40 hover:text-brand-green"
            style={{ aspectRatio: "3/4" }}
          >
            <span className="text-4xl">+</span>
            <span className="text-xs font-bold mt-1">Añadir</span>
          </button>
        </div>
      )}

      <div className="mt-8 space-y-2.5">
        <button
          type="button"
          onClick={onToggleDark}
          className="w-full p-4 rounded-2xl bg-foreground/4 hover:bg-foreground/8 transition flex items-center justify-between border border-foreground/6"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-foreground/6 flex items-center justify-center text-xl">
              {darkMode ? "🌙" : "☀️"}
            </div>
            <div>
              <p className="font-bold text-sm">Modo {darkMode ? "oscuro" : "claro"}</p>
              <p className="text-[12px] text-foreground/50">Toca para cambiar</p>
            </div>
          </div>
          <div
            className="w-12 h-7 rounded-full p-0.5 transition"
            style={{ background: darkMode ? "#0ea5e9" : "rgba(0,0,0,0.15)" }}
          >
            <div
              className="w-6 h-6 rounded-full bg-white shadow transition-transform"
              style={{ transform: darkMode ? "translateX(20px)" : "translateX(0)" }}
            />
          </div>
        </button>

        <div className="p-4 rounded-2xl bg-foreground/4 border border-foreground/6 text-sm text-foreground/70">
          <p className="font-bold mb-1 text-sm">💡 Consejo</p>
          <p className="text-[13px] leading-relaxed text-foreground/60">
            Cuantos más productos subas, más matches conseguirás. Fotos claras y descripción honesta son la clave.
          </p>
        </div>

        {user && (
          <>
            <button
              type="button"
              onClick={onSignOut}
              className="w-full p-3.5 rounded-2xl text-sm font-bold text-foreground/60 hover:bg-foreground/5 transition border border-foreground/8"
            >
              Cerrar sesión
            </button>
            <button
              type="button"
              onClick={onDeleteAccount}
              className="w-full p-3 rounded-2xl text-xs font-bold text-red-500/70 hover:bg-red-50 dark:hover:bg-red-900/10 transition"
            >
              Eliminar mi cuenta
            </button>
          </>
        )}
        <div className="text-center pt-2 pb-2">
          <Link href="/legal" className="text-xs text-foreground/35 hover:text-foreground/60 transition underline underline-offset-2">
            Términos y Privacidad
          </Link>
        </div>
      </div>
    </div>
  );
}
