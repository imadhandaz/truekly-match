"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import SwipeDeck from "./components/SwipeDeck";
import BottomNav from "./components/BottomNav";
import UploadProductForm from "./components/UploadProductForm";
import ProfileScreen from "./components/ProfileScreen";
import ChatScreen, { pickAutoReply } from "./components/ChatScreen";
import ChatList from "./components/ChatList";
import GoldPaywall from "./components/GoldPaywall";
import LikesYouScreen from "./components/LikesYouScreen";
import FiltersModal from "./components/FiltersModal";
import VerifyIdentityModal from "./components/VerifyIdentityModal";
import InstallPrompt from "./components/InstallPrompt";
import AuthModal from "./components/AuthModal";
import DeleteAccountModal from "./components/DeleteAccountModal";
import { CardSkeleton, MatchCardSkeleton } from "./components/Skeleton";
import { useAuth } from "./context/AuthContext";
import {
  fetchDiscoverProducts,
  fetchMyProducts,
  fetchMyMatches,
  softDeleteProduct,
} from "@/lib/db";
import { setupPushNotifications } from "@/lib/notifications";
import { getUserLocation, addDistances } from "@/lib/geo";
import { products as seedProducts } from "./data/products";

const LS_PREFS = "truekly:prefs:v1";
const FREE_DAILY_SWIPES = 20;
const nowTime = () =>
  new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

export default function Home() {
  const { user, profile, signOut } = useAuth();

  // ── Preferencias (localStorage) ─────────────────────────────────────────
  const [filters, setFilters] = useState({ cats: [], maxKm: 50, verifiedOnly: false });
  const [darkMode, setDarkMode] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [verified, setVerified] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // ── Datos Supabase ───────────────────────────────────────────────────────
  const [discoverProducts, setDiscoverProducts] = useState([]);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [myProducts, setMyProducts] = useState([]);
  const [matches, setMatches] = useState([]);

  // ── Geolocalización ──────────────────────────────────────────────────────
  const [userLocation, setUserLocation] = useState(null);

  // ── Demo chats (sin auth) ────────────────────────────────────────────────
  const [demoChats, setDemoChats] = useState({});

  // ── UI ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("discover");
  const [openChat, setOpenChat] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showGold, setShowGold] = useState(false);
  const [goldReason, setGoldReason] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Carga preferencias ───────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_PREFS);
      if (raw) {
        const d = JSON.parse(raw);
        setFilters(d.filters || { cats: [], maxKm: 50, verifiedOnly: false });
        setDarkMode(!!d.darkMode);
        setSwipeCount(d.swipeCount || 0);
        setVerified(!!d.verified);
      }
    } catch {}
    setPrefsLoaded(true);
  }, []);

  useEffect(() => {
    if (!prefsLoaded) return;
    try {
      localStorage.setItem(LS_PREFS, JSON.stringify({ filters, darkMode, swipeCount, verified }));
    } catch {}
  }, [filters, darkMode, swipeCount, verified, prefsLoaded]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // ── Gold success desde Stripe redirect ───────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("gold") === "success") {
      showToast("¡Bienvenido a Gold! ✨ Ya tienes acceso a todas las ventajas.");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  // ── Geolocalización silenciosa ────────────────────────────────────────────
  useEffect(() => {
    getUserLocation().then(setUserLocation).catch(() => {});
  }, []);

  // ── Setup push notifications al loguearse ────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setupPushNotifications(user.id);
  }, [user?.id]);

  // ── Carga productos discover ─────────────────────────────────────────────
  const loadDiscover = useCallback(() => {
    setDiscoverLoading(true);
    fetchDiscoverProducts(user?.id || null, filters)
      .then(setDiscoverProducts)
      .catch(() => setDiscoverProducts(seedProducts))
      .finally(() => setDiscoverLoading(false));
  }, [user?.id, filters]);

  useEffect(() => { loadDiscover(); }, [loadDiscover]);

  // ── Carga productos propios ──────────────────────────────────────────────
  useEffect(() => {
    if (!user) { setMyProducts([]); return; }
    fetchMyProducts(user.id).then(setMyProducts).catch(console.error);
  }, [user?.id]);

  // ── Carga matches ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { setMatches([]); return; }
    fetchMyMatches(user.id).then(setMatches).catch(console.error);
  }, [user?.id]);

  // ── Distancias reales con geolocalización ────────────────────────────────
  const productsWithDistance = useMemo(() => {
    const base = addDistances(discoverProducts, userLocation);
    if (!userLocation) return base;
    return base.filter((p) => (p._km ?? 999) <= filters.maxKm);
  }, [discoverProducts, userLocation, filters.maxKm]);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleMatch = (product) => {
    setMatches((m) =>
      m.some((x) => x.matchId === product.matchId || x.id === product.id)
        ? m : [...m, product]
    );
  };

  const handleSwipe = () => setSwipeCount((c) => c + 1);

  const handleSaveProduct = (product) => {
    setMyProducts((p) => [product, ...p]);
    setShowUpload(false);
    setActiveTab("profile");
    showToast("¡Producto publicado! 🎉");
  };

  const handleDeleteProduct = async (id) => {
    setMyProducts((p) => p.filter((x) => x.id !== id));
    if (user) {
      try { await softDeleteProduct(id); } catch (err) { console.error(err); }
    }
  };

  const handleDemoSend = (matchId, text) => {
    const myMsg = { mine: true, text, time: nowTime() };
    setDemoChats((c) => {
      const cur = c[matchId] || { messages: [], lastUpdated: 0 };
      return { ...c, [matchId]: { messages: [...cur.messages, myMsg], lastUpdated: Date.now() } };
    });
    setTimeout(() => {
      const reply = { mine: false, text: pickAutoReply(), time: nowTime() };
      setDemoChats((c) => {
        const cur = c[matchId] || { messages: [], lastUpdated: 0 };
        return { ...c, [matchId]: { messages: [...cur.messages, reply], lastUpdated: Date.now() } };
      });
    }, 1200 + Math.random() * 1800);
  };

  const openChatFor = (match) => setOpenChat(match);
  const openGold = (reason) => { setGoldReason(reason || null); setShowGold(true); };

  const handleAccountDeleted = () => {
    setShowDeleteAccount(false);
    setActiveTab("discover");
    setMatches([]);
    setMyProducts([]);
    setDemoChats({});
    setVerified(false);
    try { localStorage.removeItem(LS_PREFS); } catch {}
  };

  const remainingSwipes = Math.max(0, FREE_DAILY_SWIPES - swipeCount);
  const filterActive = filters.cats.length > 0 || filters.maxKm < 50 || filters.verifiedOnly;
  const fakeLikesYou = seedProducts.slice(0, 4);

  return (
    <div className="flex flex-col flex-1 min-h-screen pb-24">

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-foreground text-background text-sm font-bold shadow-2xl toast max-w-[90vw] text-center">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-20 w-full px-5 py-4 flex items-center justify-between backdrop-blur-xl bg-background/70 border-b border-foreground/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-blue/30">
            T
          </div>
          <div>
            <h1 className="font-black text-lg leading-none bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
              Truekly Match
            </h1>
            <p className="text-[10px] text-foreground/50 leading-none mt-1 uppercase tracking-wider">
              Lo tuyo por lo suyo
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {!user && (
            <button
              onClick={() => setShowAuth(true)}
              className="px-3 py-1.5 rounded-full text-sm font-bold bg-foreground text-background shadow-md hover:scale-105 transition"
            >
              Entrar
            </button>
          )}
          {user && (
            <button
              onClick={() => openGold("Hazte Gold")}
              className="px-3 py-1.5 rounded-full text-sm font-black bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:scale-105 transition flex items-center gap-1"
            >
              <span>✨</span><span>Gold</span>
            </button>
          )}
          <IconButton label="Filtros" onClick={() => setShowFilters(true)} active={filterActive}>⚙</IconButton>
          <IconButton
            label="Subir producto"
            onClick={() => (user ? setShowUpload(true) : setShowAuth(true))}
            highlight
          >
            +
          </IconButton>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 pt-6 pb-12">

        {activeTab === "discover" && (
          <>
            {prefsLoaded && !discoverLoading && myProducts.length === 0 && (
              <button
                onClick={() => (user ? setShowUpload(true) : setShowAuth(true))}
                className="w-full max-w-sm mb-5 p-4 rounded-2xl bg-gradient-to-r from-brand-green/15 to-brand-blue/15 border border-brand-green/30 text-left hover:scale-[1.01] transition flex items-center gap-3 animate-fadeIn"
              >
                <span className="text-3xl">📦</span>
                <div className="flex-1">
                  <p className="font-bold text-sm bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
                    Sube tu primer producto
                  </p>
                  <p className="text-xs text-foreground/60 mt-0.5">Es lo que vas a ofrecer en los trueques</p>
                </div>
                <span className="text-brand-blue-dark text-xl">›</span>
              </button>
            )}

            {filterActive && (
              <div className="w-full max-w-sm mb-4 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-between text-xs animate-fadeIn">
                <span className="font-semibold text-brand-blue-dark">
                  {filters.cats.length > 0
                    ? `${filters.cats.length} categoría${filters.cats.length > 1 ? "s" : ""}`
                    : "Todas categorías"}{" "}
                  · &lt;{filters.maxKm} km
                  {userLocation && <span className="text-brand-green-dark"> · 📍 Real</span>}
                </span>
                <button
                  onClick={() => setFilters({ cats: [], maxKm: 50, verifiedOnly: false })}
                  className="text-foreground/60 hover:text-foreground font-bold"
                >
                  Limpiar ✕
                </button>
              </div>
            )}

            {prefsLoaded && remainingSwipes <= 5 && remainingSwipes > 0 && (
              <button
                onClick={() => openGold("Te quedan pocos swipes hoy")}
                className="w-full max-w-sm mb-4 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 flex items-center gap-3 hover:scale-[1.01] transition animate-fadeIn"
              >
                <span className="text-xl">⚡</span>
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold text-foreground">
                    Te quedan <b>{remainingSwipes}</b> swipes hoy
                  </p>
                  <p className="text-[11px] text-foreground/60">Hazte Gold para ilimitados</p>
                </div>
                <span className="text-orange-500 font-bold">→</span>
              </button>
            )}

            {discoverLoading ? (
              <div className="w-full max-w-sm mx-auto animate-fadeIn">
                <CardSkeleton />
              </div>
            ) : productsWithDistance.length === 0 ? (
              <EmptyDiscover onRefresh={loadDiscover} hasFilters={filterActive} onClearFilters={() => setFilters({ cats: [], maxKm: 50, verifiedOnly: false })} />
            ) : (
              <SwipeDeck
                items={productsWithDistance}
                onMatch={handleMatch}
                onOpenChat={openChatFor}
                onSwipe={handleSwipe}
                outOfSwipes={remainingSwipes <= 0}
                onUpgrade={() => openGold("Se te acabaron los swipes gratis hoy")}
                userId={user?.id || null}
              />
            )}
          </>
        )}

        {activeTab === "likes" && (
          <LikesYouScreen
            products={fakeLikesYou}
            onUpgrade={() => openGold("Hazte Gold para ver quién te ha dado like")}
          />
        )}

        {activeTab === "matches" && (
          <MatchesList matches={matches} onOpen={openChatFor} />
        )}

        {activeTab === "chats" && (
          <ChatList chats={demoChats} matches={matches} onOpen={openChatFor} />
        )}

        {activeTab === "profile" && (
          <ProfileScreen
            myProducts={myProducts}
            onAdd={() => (user ? setShowUpload(true) : setShowAuth(true))}
            onDelete={handleDeleteProduct}
            onBoost={() => openGold("El Boost es exclusivo de Truekly Gold")}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode((d) => !d)}
            verified={verified || !!profile?.verified}
            onVerify={() => setShowVerify(true)}
            user={user}
            profile={profile}
            onSignOut={signOut}
            onSignIn={() => setShowAuth(true)}
            onDeleteAccount={() => setShowDeleteAccount(true)}
          />
        )}
      </main>

      <BottomNav
        active={activeTab}
        onChange={setActiveTab}
        matchCount={matches.length}
        likesCount={fakeLikesYou.length}
      />

      {showUpload && (
        <UploadProductForm
          onClose={() => setShowUpload(false)}
          onSave={handleSaveProduct}
          userId={user?.id || null}
        />
      )}

      {openChat && (
        <ChatScreen
          match={openChat}
          matchId={openChat.matchId || null}
          userId={user?.id || null}
          onBack={() => setOpenChat(null)}
          messages={!openChat.matchId ? (demoChats[openChat.id]?.messages || []) : undefined}
          onSend={!openChat.matchId ? (text) => handleDemoSend(openChat.id, text) : undefined}
        />
      )}

      {showGold && (
        <GoldPaywall
          onClose={() => setShowGold(false)}
          reason={goldReason}
          userId={user?.id || null}
          userEmail={user?.email || null}
        />
      )}

      {showFilters && (
        <FiltersModal
          initial={filters}
          onClose={() => setShowFilters(false)}
          onApply={(f) => { setFilters(f); setShowFilters(false); }}
        />
      )}

      {showVerify && (
        <VerifyIdentityModal
          onClose={() => setShowVerify(false)}
          onVerified={() => { setVerified(true); setShowVerify(false); showToast("¡Identidad verificada! ✓"); }}
        />
      )}

      <InstallPrompt />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {showDeleteAccount && (
        <DeleteAccountModal
          onClose={() => setShowDeleteAccount(false)}
          onDeleted={handleAccountDeleted}
        />
      )}
    </div>
  );
}

// ── Sub-componentes ──────────────────────────────────────────────────────────

function IconButton({ children, label, onClick, highlight, active }) {
  let cls = "bg-white/70 hover:bg-white backdrop-blur border-foreground/5";
  if (highlight) cls = "bg-gradient-to-br from-brand-green to-brand-blue text-white border-transparent hover:scale-110 shadow-brand-blue/30 shadow-lg";
  else if (active) cls = "bg-brand-blue text-white border-brand-blue shadow-md";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`w-10 h-10 rounded-full shadow-sm border flex items-center justify-center text-lg font-bold transition ${cls}`}
    >
      {children}
    </button>
  );
}

function EmptyDiscover({ onRefresh, hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16 animate-fadeInUp">
      <div className="text-7xl mb-5">🌿</div>
      <h2 className="text-2xl font-bold mb-2">
        {hasFilters ? "Sin resultados con estos filtros" : "¡Has visto todo!"}
      </h2>
      <p className="text-foreground/60 text-sm mb-6 max-w-xs">
        {hasFilters
          ? "Prueba ampliando el radio de distancia o cambiando las categorías."
          : "Vuelve más tarde, hay nuevos productos cada día."}
      </p>
      {hasFilters ? (
        <button
          onClick={onClearFilters}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold shadow-lg hover:scale-105 transition"
        >
          Limpiar filtros
        </button>
      ) : (
        <button
          onClick={onRefresh}
          className="px-6 py-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 font-bold transition"
        >
          Actualizar
        </button>
      )}
    </div>
  );
}

function MatchesList({ matches, onOpen }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 animate-fadeInUp">
        <div className="text-7xl mb-4 opacity-70">💚</div>
        <h2 className="text-2xl font-bold mb-2">Sin matches todavía</h2>
        <p className="text-foreground/60 max-w-xs text-sm">
          Da like a los productos que te interesan y espera a que la otra persona haga lo mismo.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fadeIn">
      <h2 className="text-2xl font-bold mb-5 bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
        Tus matches ({matches.length})
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {matches.map((m, i) => (
          <button
            key={m.matchId || m.id}
            onClick={() => onOpen(m)}
            className={`relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition text-left animate-fadeIn stagger-${Math.min(i + 1, 4)}`}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${m.photos[0]}')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-2 right-2 bg-white/95 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow">💬</div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <p className="font-bold text-sm leading-tight">{m.title}</p>
              <p className="text-[11px] text-white/80">{m.owner}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
