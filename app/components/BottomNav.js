"use client";

const tabs = [
  { id: "discover", label: "Descubrir", icon: "🔥" },
  { id: "likes", label: "Likes", icon: "✨" },
  { id: "matches", label: "Matches", icon: "💚" },
  { id: "chats", label: "Mensajes", icon: "💬" },
  { id: "profile", label: "Perfil", icon: "👤" },
];

export default function BottomNav({ active = "discover", onChange, matchCount = 0, likesCount = 0 }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-foreground/5">
      <div className="max-w-md mx-auto flex justify-around items-center pt-2 pb-3 px-2">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange?.(tab.id)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all active:scale-90"
            >
              {isActive && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-gradient-to-r from-brand-green to-brand-blue" />
              )}
              <span className={`text-2xl transition-all ${isActive ? "scale-110" : "opacity-55"}`}>
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-bold tracking-wide transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent"
                    : "text-foreground/55"
                }`}
              >
                {tab.label}
              </span>
              {tab.id === "matches" && matchCount > 0 && (
                <span className="absolute top-0 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  {matchCount}
                </span>
              )}
              {tab.id === "likes" && likesCount > 0 && (
                <span className="absolute top-0 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
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
