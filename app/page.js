"use client";

import { useState, useEffect } from "react";
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
import { useAuth } from "./context/AuthContext";
import { products as seedProducts } from "./data/products";

const LS_KEY = "truekly:v1";
const FREE_DAILY_SWIPES = 20;

const nowTime = () =>
  new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

export default function Home() {
  const [activeTab, setActiveTab] = useState("discover");
  const [matches, setMatches] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [chats, setChats] = useState({});
  const [openChat, setOpenChat] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showGold, setShowGold] = useState(false);
  const [goldReason, setGoldReason] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ cats: [], maxKm: 50, verifiedOnly: false });
  const [darkMode, setDarkMode] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [verified, setVerified] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setMatches(data.matches || []);
        setMyProducts(data.myProducts || []);
        setChats(data.chats || {});
        setSwipeCount(data.swipeCount || 0);
        setFilters(data.filters || { cats: [], maxKm: 50, verifiedOnly: false });
        setDarkMode(!!data.darkMode);
        setVerified(!!data.verified);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ matches, myProducts, chats, swipeCount, filters, darkMode, verified })
      );
    } catch {}
  }, [matches, myProducts, chats, swipeCount, filters, darkMode, verified, loaded]);

  const handleMatch = (product) => {
    setMatches((m) => (m.some((x) => x.id === product.id) ? m : [...m, product]));
  };

  const handleSwipe = () => setSwipeCount((c) => c + 1);

  const remainingSwipes = Math.max(0, FREE_DAILY_SWIPES - swipeCount);

  const handleSaveProduct = (product) => {
    setMyProducts((p) => [product, ...p]);
    setShowUpload(false);
    setActiveTab("profile");
  };

  const handleDeleteProduct = (id) => {
    setMyProducts((p) => p.filter((x) => x.id !== id));
  };

  const handleSendMessage = (matchId, text) => {
    const myMsg = { mine: true, text, time: nowTime() };
    setChats((c) => {
      const cur = c[matchId] || { messages: [], lastUpdated: 0 };
      return {
        ...c,
        [matchId]: { messages: [...cur.messages, myMsg], lastUpdated: Date.now() },
      };
    });

    setTimeout(() => {
      const reply = { mine: false, text: pickAutoReply(), time: nowTime() };
      setChats((c) => {
        const cur = c[matchId] || { messages: [], lastUpdated: 0 };
        return {
          ...c,
          [matchId]: { messages: [...cur.messages, reply], lastUpdated: Date.now() },
        };
      });
    }, 1200 + Math.random() * 1800);
  };

  const openChatFor = (match) => setOpenChat(match);

  const openGold = (reason) => {
    setGoldReason(reason || null);
    setShowGold(true);
  };

  const parseKm = (s) => parseFloat((s || "").replace(/[^\d.]/g, "")) || 0;

  const filteredProducts = seedProducts.filter((p) => {
    if (filters.cats.length > 0 && !filters.cats.includes(p.category)) return false;
    if (parseKm(p.distance) > filters.maxKm) return false;
    if (filters.verifiedOnly && !p.verified) return false;
    return true;
  });

  const fakeLikesYou = seedProducts.slice(0, 4);

  const filterActive = filters.cats.length > 0 || filters.maxKm < 50 || filters.verifiedOnly;

  return (
    <div className="flex flex-col flex-1 min-h-screen pb-24">
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
              <span>✨</span>
              <span>Gold</span>
            </button>
          )}
          <IconButton label="Filtros" onClick={() => setShowFilters(true)} active={filterActive}>
            ⚙
          </IconButton>
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
            {loaded && myProducts.length === 0 && (
              <button
                onClick={() => setShowUpload(true)}
                className="w-full max-w-sm mb-5 p-4 rounded-2xl bg-gradient-to-r from-brand-green/15 to-brand-blue/15 border border-brand-green/30 text-left hover:scale-[1.01] transition flex items-center gap-3 animate-fadeIn"
              >
                <span className="text-3xl">📦</span>
                <div className="flex-1">
                  <p className="font-bold text-sm bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
                    Sube tu primer producto
                  </p>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Es lo que vas a ofrecer en los trueques
                  </p>
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
                </span>
                <button
                  onClick={() => setFilters({ cats: [], maxKm: 50 })}
                  className="text-foreground/60 hover:text-foreground font-bold"
                >
                  Limpiar ✕
                </button>
              </div>
            )}
            {loaded && remainingSwipes <= 5 && remainingSwipes > 0 && (
              <button
                onClick={() => openGold("Te quedan pocos swipes hoy")}
                className="w-full max-w-sm mb-4 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 flex items-center gap-3 hover:scale-[1.01] transition animate-fadeIn"
              >
                <span className="text-xl">⚡</span>
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold text-foreground">
                    Te quedan <b>{remainingSwipes}</b> swipes hoy
                  </p>
                  <p className="text-[11px] text-foreground/60">
                    Hazte Gold para ilimitados
                  </p>
                </div>
                <span className="text-orange-500 font-bold">→</span>
              </button>
            )}
            <SwipeDeck
              items={filteredProducts}
              onMatch={handleMatch}
              onOpenChat={openChatFor}
              onSwipe={handleSwipe}
              outOfSwipes={remainingSwipes <= 0}
              onUpgrade={() => openGold("Se te acabaron los swipes gratis hoy")}
            />
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
          <ChatList chats={chats} matches={matches} onOpen={openChatFor} />
        )}
        {activeTab === "profile" && (
          <ProfileScreen
            myProducts={myProducts}
            onAdd={() => (user ? setShowUpload(true) : setShowAuth(true))}
            onDelete={handleDeleteProduct}
            onBoost={() => openGold("El Boost es exclusivo de Truekly Gold")}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode((d) => !d)}
            verified={verified}
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
        />
      )}

      {openChat && (
        <ChatScreen
          match={openChat}
          messages={chats[openChat.id]?.messages || []}
          onBack={() => setOpenChat(null)}
          onSend={(text) => handleSendMessage(openChat.id, text)}
        />
      )}

      {showGold && (
        <GoldPaywall onClose={() => setShowGold(false)} reason={goldReason} />
      )}

      {showFilters && (
        <FiltersModal
          initial={filters}
          onClose={() => setShowFilters(false)}
          onApply={(f) => {
            setFilters(f);
            setShowFilters(false);
          }}
        />
      )}

      {showVerify && (
        <VerifyIdentityModal
          onClose={() => setShowVerify(false)}
          onVerified={() => {
            setVerified(true);
            setShowVerify(false);
          }}
        />
      )}

      <InstallPrompt />

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}

      {showDeleteAccount && (
        <DeleteAccountModal
          onClose={() => setShowDeleteAccount(false)}
          onDeleted={() => {
            setShowDeleteAccount(false);
            setActiveTab("discover");
            setMatches([]);
            setMyProducts([]);
            setChats({});
            setVerified(false);
            try {
              localStorage.removeItem(LS_KEY);
            } catch {}
          }}
        />
      )}
    </div>
  );
}

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

function MatchesList({ matches, onOpen }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="text-7xl mb-4 opacity-70">💚</div>
        <h2 className="text-2xl font-bold mb-2">Sin matches todavía</h2>
        <p className="text-foreground/60 max-w-xs">
          Sigue descubriendo productos para encontrar trueques
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-5 bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
        Tus matches ({matches.length})
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {matches.map((m) => (
          <button
            key={m.id}
            onClick={() => onOpen(m)}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition text-left"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${m.photos[0]}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-2 right-2 bg-white/95 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow">
              💬
            </div>
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
