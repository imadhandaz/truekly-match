"use client";
import { useState, useEffect } from "react";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(b64) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export default function NotificationPrompt({ userId }) {
  const [state, setState] = useState("idle"); // idle | asking | granted | denied | unsupported
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof Notification === "undefined") { setState("unsupported"); return; }
    if (Notification.permission === "granted") { setState("granted"); return; }
    if (Notification.permission === "denied") { setState("denied"); return; }
    // Show prompt after 8 seconds and only once per session
    if (sessionStorage.getItem("truekly_notif_prompted")) return;
    const t = setTimeout(() => setState("asking"), 8000);
    return () => clearTimeout(t);
  }, []);

  const request = async () => {
    sessionStorage.setItem("truekly_notif_prompted", "1");
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setState("granted");
      await subscribe();
    } else {
      setState("denied");
    }
  };

  const subscribe = async () => {
    if (!("serviceWorker" in navigator) || !VAPID_PUBLIC) return;
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      });
      // Save subscription to Supabase (fire & forget)
      if (userId) {
        const { getSupabase } = await import("@/lib/supabase");
        const sb = getSupabase();
        await sb.from("push_subscriptions").upsert({
          user_id: userId,
          subscription: JSON.parse(JSON.stringify(sub)),
        }, { onConflict: "user_id" });
      }
    } catch (err) {
      console.warn("Push subscribe failed:", err);
    }
  };

  const dismiss = () => {
    sessionStorage.setItem("truekly_notif_prompted", "1");
    setDismissed(true);
  };

  if (dismissed || state === "idle" || state === "granted" || state === "denied" || state === "unsupported") return null;

  return (
    <div
      className="fixed bottom-28 left-4 right-4 z-40 animate-slideInUp"
      style={{ maxWidth: 380, margin: "0 auto" }}
    >
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{
          background: "rgba(7,19,16,0.97)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(52,211,153,0.15)",
          border: "1px solid rgba(52,211,153,0.12)",
        }}
      >
        <div className="text-2xl flex-shrink-0 mt-0.5">🔔</div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm text-white leading-tight">Activa las notificaciones</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Entérate al instante cuando alguien haga match con tus productos.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={request}
              className="flex-1 py-2 rounded-xl font-black text-sm transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "white" }}
            >
              Activar
            </button>
            <button
              onClick={dismiss}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
