"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SwipeDeck from "./components/SwipeDeck";
import BottomNav from "./components/BottomNav";
import UploadProductForm from "./components/UploadProductForm";
import ProfileScreen from "./components/ProfileScreen";
import ChatScreen from "./components/ChatScreen";
import ChatList from "./components/ChatList";
import GoldPaywall from "./components/GoldPaywall";
import LikesYouScreen from "./components/LikesYouScreen";
import FiltersModal from "./components/FiltersModal";
import VerifyIdentityModal from "./components/VerifyIdentityModal";
import InstallPrompt from "./components/InstallPrompt";
import AuthModal from "./components/AuthModal";
import DeleteAccountModal from "./components/DeleteAccountModal";
import MatchModal from "./components/MatchModal";
import WelcomeScreen from "./components/WelcomeScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import AnnouncementBanner from "./components/AnnouncementBanner";
import NotificationPrompt from "./components/NotificationPrompt";
import { useAuth } from "./context/AuthContext";
import { getSupabase } from "@/lib/supabase";

const UI_LS_KEY = "truekly:ui:v2";
const FREE_DAILY_SWIPES = 20;

// Shape a products-table row into a card object for SwipeDeck / MatchModal
function shapeProduct(p) {
  const ownerProfile = p.profiles || {};
  return {
    id: p.id,
    owner_id: p.owner_id,
    title: p.title,
    storage: p.storage_detail || "",
    category: p.category,
    owner: ownerProfile.display_name || ownerProfile.username || "Usuario",
    verified: ownerProfile.verified || false,
    gold: ownerProfile.gold || false,
    distance: "",
    photos: p.photos || [],
    wants: p.wants || "",
    description: p.description || "",
    tags: p.tags || [],
    location: p.neighborhood || "España",
    neighborhood: p.neighborhood || "",
  };
}

// Shape a matches-table row into a card for MatchesList / ChatScreen
// Always shows the product of the OTHER user (product_b from user_a's perspective)
function shapeMatch(match, userId) {
  const isUserA = match.user_a === userId;
  const product = isUserA
    ? match.product_b_data || match.products || {}
    : match.product_a_data || match.products || {};
  const ownerProfile = product.profiles || {};
  return {
    id: match.id,
    title: product.title || "",
    photos: product.photos || [],
    wants: product.wants || "",
    owner: ownerProfile.display_name || ownerProfile.username || "Usuario",
    verified: ownerProfile.verified || false,
    location: product.neighborhood || "Espa�a",
    neighborhood: product.neighborhood || "",
  };
}

function HomeInner() {
  const [activeTab, setActiveTab] = useState("discover");
  const [products, setProducts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [myProductId, setMyProductId] = useState(null);
  const [likes, setLikes] = useState([]);
  const [openChat, setOpenChat] = useState(null);
  const [matchModalCard, setMatchModalCard] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showGold, setShowGold] = useState(false);
  const [goldReason, setGoldReason] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ cats: [], maxKm: 50, verifiedOnly: false });
  const [darkMode, setDarkMode] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showVerify, setShowVerify] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { user, profile, signOut } = useAuth();
  const supabase = getSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Restore UI prefs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(UI_LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setDarkMode(!!data.darkMode);
        setFilters(data.filters || { cats: [], maxKm: 50, verifiedOnly: false });
        setSwipeCount(data.swipeCount || 0);
      }
      if (!localStorage.getItem("truekly_onboarded")) setShowOnboarding(true);
    } catch {}
    setLoaded(true);
  }, []);

  // Persist UI prefs
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(UI_LS_KEY, JSON.stringify({ darkMode, filters, swipeCount }));
    } catch {}
  }, [darkMode, filters, swipeCount, loaded]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Handle ?gold=success after Stripe redirect
  useEffect(() => {
    if (searchParams.get("gold") === "success") {
      alert("¡Ya eres Gold! ✨ Disfruta de todos los beneficios.");
      router.replace("/");
    }
  }, [searchParams, router]);

  // Fetch all data when user changes
  useEffect(() => {
    if (!user) {
      fetchPublicProducts(null);
      setMatches([]);
      setMyProducts([]);
      setMyProductId(null);
      setLikes([]);
      return;
    }
    fetchAll(user.id);
  }, [user?.id]);

  const fetchPublicProducts = async (userId) => {
    let query = supabase
      .from("products")
      .select("*, profiles!owner_id(username, display_name, neighborhood, verified, gold)")
      .eq("active", true);
    if (userId) query = query.neq("owner_id", userId);
    const { data } = await query;
    setProducts((data || []).map(shapeProduct));
  };

  const fetchAll = async (userId) => {
    // Get user's first active product (used for match detection)
    const { data: myProd } = await supabase
      .from("products")
      .select("id")
      .eq("owner_id", userId)
      .eq("active", true)
      .limit(1)
      .maybeSingle();
    const myProdId = myProd?.id || null;
    setMyProductId(myProdId);

    // Fetch IDs the user already swiped
    const { data: swipedRows } = await supabase
      .from("swipes")
      .select("product_id")
      .eq("swiper_id", userId);
    const swipedIds = new Set((swipedRows || []).map((s) => s.product_id));

    // Fetch discover products (exclude own + already swiped)
    const { data: productsData } = await supabase
      .from("products")
      .select("*, profiles!owner_id(username, display_name, neighborhood, verified, gold)")
      .eq("active", true)
      .neq("owner_id", userId);
    setProducts(
      (productsData || [])
        .filter((p) => !swipedIds.has(p.id))
        .map(shapeProduct)
    );

    // Fetch matches with both products joined for perspective-aware display
    const { data: matchesData } = await supabase
      .from("matches")
      .select(
        `id, user_a, user_b, product_a, product_b, created_at,
         product_b_data:products!product_b(id, title, photos, wants, neighborhood, profiles!owner_id(display_name, username, verified)),
         product_a_data:products!product_a(id, title, photos, wants, neighborhood, profiles!owner_id(display_name, username, verified))`
      )
      .or(`user_a.eq.${userId},user_b.eq.${userId}`);
    setMatches((matchesData || []).map((m) => shapeMatch(m, userId)));

    // Fetch user's own products
    const { data: myProdsData } = await supabase
      .from("products")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });
    setMyProducts(myProdsData || []);

    // Fetch likes (who swiped yes/super on user's product)
    // NOTE: requires an RLS policy allowing users to read swipes on their own products
    if (myProdId) {
      const { data: likesData } = await supabase
        .from("swipes")
        .select("id, swiper_id, products!product_id(id, title, photos, profiles!owner_id(display_name))")
        .eq("product_id", myProdId)
        .in("choice", ["yes", "super"]);
      setLikes(
        (likesData || []).map((row) => ({
          id: row.swiper_id,
          title: row.products?.title || "",
          photos: row.products?.photos || [],
          owner: row.products?.profiles?.display_name || "Usuario",
        }))
      );
    }
  };

  const handleSwipe = async (product, choice) => {
    setSwipeCount((c) => c + 1);
    if (!user) return;

    await supabase.from("swipes").insert({
      swiper_id: user.id,
      product_id: product.id,
      choice,
    });

    // Remove from deck immediately
    setProducts((ps) => ps.filter((p) => p.id !== product.id));

    // Real match detection for positive swipes
    if ((choice === "yes" || choice === "super") && myProductId) {
      const { data: mutual } = await supabase
        .from("swipes")
        .select("id")
        .eq("swiper_id", product.owner_id)
        .eq("product_id", myProductId)
        .in("choice", ["yes", "super"])
        .maybeSingle();

      if (mutual) {
        const { data: newMatch } = await supabase
          .from("matches")
          .insert({
            user_a: user.id,
            user_b: product.owner_id,
            product_a: myProductId,
            product_b: product.id,
          })
          .select("id")
          .maybeSingle();

        // Refresh matches list
        fetchAll(user.id);

        // Show match modal
        setMatchModalCard({ ...product, matchId: newMatch?.id });
      }
    }
  };

  const handleSaveProduct = (product) => {
    // Re-fetch after upload so myProductId and myProducts are up to date
    if (user) fetchAll(user.id);
    setShowUpload(false);
    setActiveTab("profile");
  };

  const handleDeleteProduct = async (id) => {
    if (user) {
      await supabase.from("products").delete().eq("id", id).eq("owner_id", user.id);
    }
    setMyProducts((p) => p.filter((x) => x.id !== id));
  };

  const openChatFor = (match) => setOpenChat(match);

  const openGold = (reason) => {
    setGoldReason(reason || null);
    setShowGold(true);
  };

  const parseKm = (s) => parseFloat((s || "").replace(/[^\d.]/g, "")) || 0;

  const filteredProducts = products.filter((p) => {
    if (filters.cats.length > 0 && !filters.cats.includes(p.category)) return false;
    if (p.distance && parseKm(p.distance) > filters.maxKm) return false;
    if (filters.verifiedOnly && !p.verified) return false;
    return true;
  });

  const remainingSwipes = Math.max(0, FREE_DAILY_SWIPES - swipeCount);
  const filterActive = filters.cats.length > 0 || filters.maxKm < 50 || filters.verifiedOnly;
  const isGold = !!profile?.gold;

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onDone={() => {
          try { localStorage.setItem("truekly_onboarded", "1"); } catch {}
          setShowOnboarding(false);
        }}
      />
    );
  }

  if (!user && !welcomeDismissed) {
    return (
      <WelcomeScreen
        onSignUp={() => {
          setWelcomeDismissed(true);
          setAuthMode("signup");
          setShowAuth(true);
        }}
        onSignIn={() => {
          setWelcomeDismissed(true);
          setAuthMode("signin");
          setShowAuth(true);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen pb-24">
      <header className="sticky top-0 z-20 w-full px-5 py-4 flex items-center justify-between backdrop-blur-xl bg-white/80 border-b border-black/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{background:"linear-gradient(135deg,#10b981,#0ea5e9)",boxShadow:"0 4px 16px rgba(14,165,233,0.35)"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

      <main className="flex-1 flex flex-col items-center justify-center px-5 pt-6 pb-12" style={{background:"linear-gradient(180deg,rgba(16,185,129,0.035) 0%,rgba(14,165,233,0.05) 100%)"}}>
        {activeTab === "discover" && (
          <>
            <AnnouncementBanner onSlideClick={() => {}} />
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
              onMatch={() => {}}
              onOpenChat={openChatFor}
              onSwipe={handleSwipe}
              outOfSwipes={!isGold && remainingSwipes <= 0}
              onUpgrade={() => openGold("Se te acabaron los swipes gratis hoy")}
            />
          </>
        )}
        {activeTab === "likes" && (
          <LikesYouScreen
            products={likes}
            isGold={isGold}
            onUpgrade={() => openGold("Hazte Gold para ver quién te ha dado like")}
          />
        )}
        {activeTab === "matches" && (
          <MatchesList matches={matches} onOpen={openChatFor} />
        )}
        {activeTab === "chats" && (
          <ChatList chats={{}} matches={matches} onOpen={openChatFor} />
        )}
        {activeTab === "profile" && (
          <ProfileScreen
            myProducts={myProducts}
            onAdd={() => (user ? setShowUpload(true) : setShowAuth(true))}
            onDelete={handleDeleteProduct}
            onBoost={() => openGold("El Boost es exclusivo de Truekly Gold")}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode((d) => !d)}
            verified={profile?.verified || false}
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
        likesCount={likes.length}
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
          onBack={() => setOpenChat(null)}
        />
      )}

      {matchModalCard && (
        <MatchModal
          myProduct={
            myProducts[0]
              ? {
                  title: myProducts[0].title,
                  photos: myProducts[0].photos,
                  owner: profile?.display_name || "Tú",
                }
              : { title: "Tu producto", photos: [], owner: "Tú" }
          }
          theirProduct={matchModalCard}
          onClose={() => setMatchModalCard(null)}
          onChat={() => {
            setMatchModalCard(null);
            const m = matches.find((x) => x.id === matchModalCard.matchId);
            if (m) openChatFor(m);
            else setActiveTab("matches");
          }}
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
          onVerified={() => setShowVerify(false)}
        />
      )}

      <InstallPrompt />
        <NotificationPrompt userId={user?.id} />

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} mode={authMode} />
      )}

      {showDeleteAccount && (
        <DeleteAccountModal
          onClose={() => setShowDeleteAccount(false)}
          onDeleted={() => {
            setShowDeleteAccount(false);
            setActiveTab("discover");
            setMatches([]);
            setMyProducts([]);
            setLikes([]);
          }}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
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
