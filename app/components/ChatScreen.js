"use client";

import { useState, useRef, useEffect } from "react";
import { fetchMessages, sendMessage, subscribeToMessages } from "@/lib/db";
import { notifyUser } from "@/lib/notifications";

const AUTO_REPLIES = [
  "¡Hola! Sí, todavía está disponible 👋",
  "¿En qué barrio estás? Por si podemos vernos.",
  "¿Tienes fotos de más ángulos?",
  "¿Cuánto pides de diferencia?",
  "Me interesa, ¿lo cambiarías ya esta semana?",
  "Yo estoy por el centro, ¿te viene bien Atocha?",
  "¿Y si añadimos algo más al trueque?",
  "Ok, lo consulto y te digo en un rato 🙏",
  "Sin problema, dime cuando quieras quedar",
];

// Modo demo (sin auth): mensajes locales pasados como props
// Modo real (con matchId + userId): Supabase + Realtime
export default function ChatScreen({ match, matchId, userId, onBack, messages: demeMsgs, onSend: demoSend }) {
  const useSupabase = !!(matchId && userId);

  const [dbMessages, setDbMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // Carga mensajes iniciales desde Supabase
  useEffect(() => {
    if (!useSupabase) return;
    fetchMessages(matchId).then(setDbMessages).catch(console.error);
  }, [matchId, useSupabase]);

  // Suscripción Realtime a mensajes nuevos
  useEffect(() => {
    if (!useSupabase) return;
    return subscribeToMessages(matchId, (newMsg) => {
      // Evita duplicar mensajes propios (añadidos optimistamente)
      setDbMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });
  }, [matchId, useSupabase]);

  // Scroll al último mensaje
  const messages = useSupabase ? dbMessages : (demeMsgs || []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setText("");

    if (useSupabase) {
      setSending(true);
      // Añade optimistamente
      const optimistic = {
        id: `opt-${Date.now()}`,
        sender_id: userId,
        text: trimmed,
        created_at: new Date().toISOString(),
      };
      setDbMessages((prev) => [...prev, optimistic]);

      try {
        const saved = await sendMessage(matchId, userId, trimmed);
        setDbMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? saved : m))
        );
        // Notificar al otro usuario
        if (match.ownerId) {
          notifyUser(
            match.ownerId,
            match.owner,
            trimmed.length > 60 ? trimmed.slice(0, 57) + "..." : trimmed,
            "/?tab=chats"
          );
        }
      } catch (err) {
        console.error(err);
        // Revierte el mensaje optimista en caso de error
        setDbMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        setText(trimmed);
      } finally {
        setSending(false);
      }
    } else {
      // Demo mode
      demoSend?.(trimmed);
    }
  };

  // Normaliza mensajes a formato display
  const displayMessages = useSupabase
    ? dbMessages.map((m) => ({
        mine: m.sender_id === userId,
        text: m.text,
        time: new Date(m.created_at).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))
    : messages;

  return (
    <div className="fixed inset-0 z-30 bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-foreground/5 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full hover:bg-foreground/5 flex items-center justify-center text-xl"
          aria-label="Volver"
        >
          ‹
        </button>
        <div
          className="w-11 h-11 rounded-full bg-cover bg-center border-2 border-brand-green shadow"
          style={{ backgroundImage: `url('${match.photos[0]}')` }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-bold leading-tight truncate">{match.owner}</p>
            {match.verified && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-green to-brand-blue text-white text-[9px] font-black shrink-0">
                ✓
              </span>
            )}
          </div>
          <p className="text-[11px] text-foreground/60 leading-tight truncate">
            {match.title} · {match.location}
          </p>
        </div>
        <button className="w-9 h-9 rounded-full hover:bg-foreground/5 flex items-center justify-center text-lg">
          ⋯
        </button>
      </header>

      <div className="px-4 py-3 bg-gradient-to-r from-brand-green/10 to-brand-blue/10 border-b border-foreground/5">
        <p className="text-[11px] uppercase tracking-widest text-brand-green-dark font-bold mb-1">
          Trueque propuesto
        </p>
        <p className="text-sm">
          <b>{match.title}</b>{" "}
          <span className="text-foreground/60">por</span>{" "}
          <b>{match.wants}</b>
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {displayMessages.length === 0 && (
          <div className="text-center py-12 text-foreground/50 text-sm">
            <p className="mb-2 text-2xl">🤝</p>
            <p>Has hecho match con <b>{match.owner}</b>.</p>
            <p className="mt-1">¡Rompe el hielo!</p>
          </div>
        )}
        {displayMessages.map((m, i) => (
          <Bubble key={i} mine={m.mine} text={m.text} time={m.time} />
        ))}
      </div>

      <form
        onSubmit={send}
        className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-foreground/5 px-3 py-3 flex items-center gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-3 rounded-full bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-white focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className={`w-12 h-12 rounded-full font-bold shadow-lg flex items-center justify-center transition ${
            text.trim() && !sending
              ? "bg-gradient-to-br from-brand-green to-brand-blue text-white hover:scale-110"
              : "bg-foreground/10 text-foreground/30"
          }`}
          aria-label="Enviar"
        >
          ➤
        </button>
      </form>
    </div>
  );
}

function Bubble({ mine, text, time }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm ${
          mine
            ? "bg-gradient-to-br from-brand-green to-brand-blue text-white rounded-br-md"
            : "bg-white border border-foreground/10 text-foreground rounded-bl-md"
        }`}
      >
        <p className="text-[15px] leading-snug whitespace-pre-wrap">{text}</p>
        <p className={`text-[10px] mt-0.5 ${mine ? "text-white/70" : "text-foreground/40"}`}>
          {time}
        </p>
      </div>
    </div>
  );
}

export function pickAutoReply() {
  return AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
}
