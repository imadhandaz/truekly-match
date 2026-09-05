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

const WAVES = [
  { color: "rgba(16,185,129,0.22)",  anim: "nw1 7s ease-in-out infinite",        top: "-30%", left: "-10%",  w: "120%", h: "160%", br: "42% 58% 55% 45% / 48% 52% 48% 52%" },
  { color: "rgba(56,189,248,0.18)",  anim: "nw2 10s ease-in-out infinite 1.5s",  top: "-20%", left: "-5%",   w: "115%", h: "150%", br: "58% 42% 48% 52% / 52% 48% 58% 42%" },
  { color: "rgba(167,139,250,0.15)", anim: "nw3 13s ease-in-out infinite 3s",    top: "-25%", left: "-15%",  w: "130%", h: "170%", br: "45% 55% 60% 40% / 55% 45% 55% 45%" },
];

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
        {/* PS-style liquid wave layers */}
        {WAVES.map((w, i) => (
          <div key={i} aria-hidden="true" style={{
            position: "absolute",
            top: w.top, left: w.left,
            width: w.w, height: w.h,
            borderRadius: w.br,
            background: w.color,
            animation: w.anim,
            pointerEvents: "none",
          }} />
        ))}

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
