"use client";

import { useState, useRef, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "../context/AuthContext";
import ReviewModal from "./ReviewModal";
import { toast } from "@/lib/toast";

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatScreen({ match, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [traded, setTraded] = useState(false);
  const scrollRef = useRef(null);
  const { user } = useAuth();
  const supabase = getSupabase();
  const matchId = match.id;

  useEffect(() => {
    if (!matchId) return;
    supabase.from("messages").select("*").eq("match_id", matchId).order("created_at", { ascending: true }).then(({ data }) => setMessages(data || []));
    const channel = supabase.channel(`messages:${matchId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` }, (payload) => {
      const newMsg = payload.new;
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => !(m.id?.toString().startsWith("temp-") && m.sender_id === newMsg.sender_id && m.text === newMsg.text));
        if (withoutTemp.some((m) => m.id === newMsg.id)) return withoutTemp;
        return [...withoutTemp, newMsg];
      });
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [matchId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !user || sending) return;
    setText("");
    setSending(true);
    const tempMsg = { id: `temp-${Date.now()}`, match_id: matchId, sender_id: user.id, text: trimmed, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMsg]);
    await supabase.from("messages").insert({ match_id: matchId, sender_id: user.id, text: trimmed });
    if (match?.other_user_id) {
      fetch("/api/push/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: match.other_user_id, title: "Nuevo mensaje 💬", body: trimmed.slice(0, 80), url: "/" }) }).catch(() => {});
    }
    setSending(false);
  };

  const markAsTraded = async () => {
    setMenuOpen(false);
    if (!user) return;
    await supabase.from("matches").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", matchId);
    setTraded(true);
    toast("¡Trueque marcado como completado! 🎉");
    setTimeout(() => setShowReview(true), 800);
  };

  const reportUser = async () => {
    setMenuOpen(false);
    if (!user || !match?.other_user_id) return;
    await supabase.from("reports").insert({ reporter_id: user.id, reported_id: match.other_user_id, reason: "Reporte desde chat" }).then(() => toast("Usuario reportado. Lo revisaremos pronto.")).catch(() => toast("Ya habías reportado a este usuario.", "warning"));
  };

  const blockUser = async () => {
    setMenuOpen(false);
    if (!user || !match?.other_user_id) return;
    await supabase.from("blocks").insert({ blocker_id: user.id, blocked_id: match.other_user_id }).then(() => { toast("Usuario bloqueado."); setTimeout(() => onBack?.(), 1200); }).catch(() => toast("Ya tienes bloqueado a este usuario.", "warning"));
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="fixed inset-0 z-30 bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-2xl border-b border-foreground/8 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full hover:bg-foreground/6 flex items-center justify-center transition shrink-0" aria-label="Volver">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="w-11 h-11 rounded-full bg-cover bg-center border-2 shadow-md shrink-0" style={{ backgroundImage: `url('${match.photos?.[0]}')`, borderColor: "#10b981" }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-black text-base leading-tight truncate">{match.owner}</p>
            {match.verified && <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px] font-black shrink-0" style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}>✓</span>}
          </div>
          <p className="text-[11px] text-foreground/50 leading-tight truncate">{match.title}{match.location ? ` · ${match.location}` : ""}</p>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="w-9 h-9 rounded-full hover:bg-foreground/6 flex items-center justify-center transition text-foreground/60">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-56 bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
              {!traded && <button onClick={markAsTraded} className="w-full px-4 py-3.5 text-left text-sm font-semibold hover:bg-foreground/5 transition flex items-center gap-2.5"><span className="text-base">✅</span> Marcar como intercambiado</button>}
              {traded && <button onClick={() => { setMenuOpen(false); setShowReview(true); }} className="w-full px-4 py-3.5 text-left text-sm font-semibold hover:bg-foreground/5 transition flex items-center gap-2.5"><span className="text-base">⭐</span> Valorar trueque</button>}
              <div className="border-t border-foreground/6" />
              <button onClick={reportUser} className="w-full px-4 py-3.5 text-left text-sm text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition flex items-center gap-2.5"><span className="text-base">🚩</span> Reportar usuario</button>
              <button onClick={blockUser} className="w-full px-4 py-3.5 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition flex items-center gap-2.5"><span className="text-base">🚫</span> Bloquear usuario</button>
              <div className="border-t border-foreground/6" />
              <button onClick={() => setMenuOpen(false)} className="w-full px-4 py-3.5 text-left text-sm text-foreground/40 hover:bg-foreground/5 transition">Cancelar</button>
            </div>
          )}
        </div>
      </header>

      {traded && (
        <div className="px-4 py-2.5 border-b border-brand-green/20 text-center" style={{ background: "rgba(16,185,129,0.1)" }}>
          <p className="text-xs font-bold text-brand-green-dark">✅ Trueque completado</p>
        </div>
      )}

      <div className="px-4 py-3 border-b border-foreground/6" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.07), rgba(14,165,233,0.07))" }}>
        <p className="text-[10px] uppercase tracking-widest text-brand-green-dark font-black mb-1">Trueque propuesto</p>
        <p className="text-sm"><b>{match.title}</b> <span className="text-foreground/55">por</span> <b>{match.wants}</b></p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-2" onClick={() => menuOpen && setMenuOpen(false)}>
        {messages.length === 0 && (
          <div className="text-center py-14 text-foreground/50 text-sm">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-md" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(14,165,233,0.15))" }}>🤝</div>
            <p className="font-semibold text-base mb-1">Match con <span className="font-black">{match.owner}</span></p>
            <p className="text-foreground/40 text-sm">¡Rompe el hielo y propón el trueque!</p>
          </div>
        )}
        {messages.map((m) => (
          <Bubble key={m.id} mine={m.sender_id === user?.id} text={m.text} time={formatTime(m.created_at)} />
        ))}
      </div>

      <form onSubmit={send} className="sticky bottom-0 bg-background/97 backdrop-blur-2xl border-t border-foreground/8 px-3 py-3 flex items-center gap-2.5">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe un mensaje…" className="flex-1 px-4 py-3 rounded-full bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-background focus:outline-none transition text-sm" />
        <button type="submit" disabled={!hasText || sending} aria-label="Enviar" className="w-12 h-12 rounded-full font-bold shadow-lg flex items-center justify-center transition shrink-0" style={{ background: hasText && !sending ? "linear-gradient(135deg, #10b981, #0ea5e9)" : undefined, opacity: hasText && !sending ? 1 : 0.35 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={hasText && !sending ? "white" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>

      {showReview && user && match?.other_user_id && (
        <ReviewModal matchId={matchId} userId={user.id} reviewedUserId={match.other_user_id} reviewedName={match.owner} onClose={() => setShowReview(false)} onDone={() => toast("¡Gracias por tu valoración! ⭐")} />
      )}
    </div>
  );
}

function Bubble({ mine, text, time }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div className={`max-w-[76%] px-4 py-2.5 shadow-sm ${mine ? "text-white rounded-3xl rounded-br-lg" : "border border-foreground/8 text-foreground rounded-3xl rounded-bl-lg bg-foreground/5"}`} style={mine ? { background: "linear-gradient(135deg, #10b981, #0ea5e9)" } : undefined}>
        <p className="text-[15px] leading-snug whitespace-pre-wrap">{text}</p>
        <p className={`text-[10px] mt-1 ${mine ? "text-white/65 text-right" : "text-foreground/35"}`}>{time}</p>
      </div>
    </div>
  );
  }
