"use client";

export default function ChatList({ chats, matches, onOpen }) {
  const items = matches
    .map((m) => ({
      match: m,
      messages: chats[m.id]?.messages || [],
      lastUpdated: chats[m.id]?.lastUpdated || 0,
    }))
    .sort((a, b) => b.lastUpdated - a.lastUpdated);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="text-7xl mb-4 opacity-70">💬</div>
        <h2 className="text-2xl font-bold mb-2">Sin mensajes</h2>
        <p className="text-foreground/60 max-w-xs">
          Haz match para empezar a chatear con otros usuarios
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
        Mensajes ({items.length})
      </h2>
      {items.map(({ match, messages }) => {
        const last = messages[messages.length - 1];
        const unread = false;
        return (
          <button
            key={match.id}
            onClick={() => onOpen(match)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition text-left"
          >
            <div
              className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-brand-green shrink-0 shadow"
              style={{ backgroundImage: `url('${match.photos[0]}')` }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <p className="font-bold truncate">{match.owner}</p>
                {last && (
                  <span className="text-[11px] text-foreground/50 shrink-0 ml-2">
                    {last.time}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-foreground/60 truncate">
                {last
                  ? `${last.mine ? "Tú: " : ""}${last.text}`
                  : `${match.title} · Empieza la conversación`}
              </p>
            </div>
            {unread && (
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}
