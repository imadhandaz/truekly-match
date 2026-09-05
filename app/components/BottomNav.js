"use client";

const tabs = [
  {
    id: "discover",
    label: "Descubrir",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? "#10b981" : "currentColor"} strokeWidth="1.8"/>
        <path d="M16 8l-2.5 5.5L8 16l2.5-5.5L16 8z" fill={active ? "#10b981" : "currentColor"}/>
        <circle cx="12" cy="12" r="1.5" fill={active ? "#fff" : "currentColor"}/>
      </svg>
    ),
  },
  {
    id: "likes",
    label: "Likes",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill={active ? "#10b981" : "none"}
          stroke={active ? "#10b981" : "currentColor"}
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "matches",
    label: "Truekes",
    center: true,
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "chats",
    label: "Chats",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          fill={active ? "#10b981" : "none"}
          stroke={active ? "#10b981" : "currentColor"}
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Perfil",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? "#10b981" : "currentColor"} strokeWidth="1.8"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
          stroke={active ? "#10b981" : "currentColor"}
          strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// SVG wave paths with period=160px, range x=-170 to x=490
// Each wave: translateX 0→-160 = exactly one seamless period
const W1 = "M-160,22 C-138,12 -102,32 -80,22 C-58,12 -22,32 0,22 C22,12 58,32 80,22 C102,12 138,32 160,22 C182,12 218,32 240,22 C262,12 298,32 320,22 C342,12 378,32 400,22 C422,12 458,32 480,22";
const W2 = "M-160,40 C-128,28 -96,52 -64,40 C-32,28 0,52 32,40 C64,28 96,52 128,40 C160,28 192,52 224,40 C256,28 288,52 320,40 C352,28 384,52 416,40 C448,28 480,52 512,40";
const W3 = "M-160,57 C-120,47 -80,65 -40,57 C0,47 40,65 80,57 C120,47 160,65 200,57 C240,47 280,65 320,57 C360,47 400,65 440,57 C480,47 520,65 560,57";

export default function BottomNav({ active = "discover", onChange, matchCount = 0, likesCount = 0 }) {
  return (
    <nav
      className="fixed left-0 right-0 z-30 flex justify-center"
      style={{ bottom: 20 }}
    >
      <div
        className="flex items-center px-3"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "rgba(12,16,14,0.93)",
          backdropFilter: "blur(24px)",
          borderRadius: 36,
          boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07), 0 0 24px rgba(16,185,129,0.08)",
          padding: "6px 6px",
          gap: 2,
        }}
      >
        {/* PS-style flowing waves — pure SVG + CSS, no JS needed */}
        <svg
          aria-hidden="true"
          viewBox="0 0 320 70"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            pointerEvents: "none", borderRadius: 36, overflow: "hidden",
          }}
        >
          <defs>
            <style>{
              `@keyframes ws1{from{transform:translateX(0)}to{transform:translateX(-160px)}}
               @keyframes ws2{from{transform:translateX(-40px)}to{transform:translateX(-200px)}}
               @keyframes ws3{from{transform:translateX(-80px)}to{transform:translateX(-240px)}}`
            }</style>
            <filter id="glow1" x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow2" x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Wave 1 — green */}
          <path d={W1} fill="none" stroke="rgba(16,185,129,0.65)" strokeWidth="1.5" strokeLinecap="round"
            filter="url(#glow1)"
            style={{ animation: "ws1 5s linear infinite" }}
          />

          {/* Wave 2 — sky blue */}
          <path d={W2} fill="none" stroke="rgba(56,189,248,0.60)" strokeWidth="1.3" strokeLinecap="round"
            filter="url(#glow2)"
            style={{ animation: "ws2 8s linear infinite" }}
          />

          {/* Wave 3 — violet */}
          <path d={W3} fill="none" stroke="rgba(167,139,250,0.55)" strokeWidth="1.1" strokeLinecap="round"
            filter="url(#glow1)"
            style={{ animation: "ws3 11s linear infinite" }}
          />
        </svg>

        {tabs.map((tab) => {
          const isActive = active === tab.id;

          if (tab.center) {
            return (
              <button
                key={tab.id}
                onClick={() => onChange?.(tab.id)}
                className="relative flex flex-col items-center justify-center transition-all active:scale-90"
                style={{
                  zIndex: 1, width: 58, height: 58, borderRadius: "50%",
                  background: isActive
                    ? "linear-gradient(135deg,#10b981,#059669)"
                    : "linear-gradient(135deg,#1a2e26,#162620)",
                  boxShadow: isActive
                    ? "0 0 0 3px rgba(16,185,129,0.3), 0 8px 20px rgba(16,185,129,0.4)"
                    : "0 4px 12px rgba(0,0,0,0.3)",
                  margin: "0 4px", flexShrink: 0,
                }}
              >
                {tab.icon(isActive)}
                {matchCount > 0 && (
                  <span className="absolute flex items-center justify-center text-white font-black"
                    style={{ top:2, right:2, minWidth:18, height:18, borderRadius:9, fontSize:10,
                      background:"#ef4444", paddingInline:4, boxShadow:"0 2px 6px rgba(239,68,68,0.5)" }}>
                    {matchCount}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChange?.(tab.id)}
              className="relative flex flex-col items-center gap-0.5 transition-all active:scale-90"
              style={{
                zIndex: 1, minWidth: 56, padding: "8px 6px", borderRadius: 26,
                background: isActive ? "rgba(16,185,129,0.14)" : "transparent",
                color: isActive ? "#10b981" : "rgba(255,255,255,0.4)",
              }}
            >
              {tab.icon(isActive)}
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.04em",
                color: isActive ? "#10b981" : "rgba(255,255,255,0.35)" }}>
                {tab.label}
              </span>
              {tab.id === "likes" && likesCount > 0 && (
                <span className="absolute flex items-center justify-center text-white font-black"
                  style={{ top:4, right:8, minWidth:16, height:16, borderRadius:8, fontSize:9,
                    background:"linear-gradient(135deg,#f59e0b,#f97316)", paddingInline:3 }}>
                  {likesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
