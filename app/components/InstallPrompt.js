"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "truekly:installPromptDismissed";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setIsIOS(ios);
    setIsStandalone(standalone);

    if (standalone) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    if (ios) {
      const t = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(t);
    }

    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem(DISMISS_KEY, "installed");
    }
    setShow(false);
    setDeferred(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "dismissed");
    setShow(false);
  };

  if (!show || isStandalone) return null;

  return (
    <div className="fixed bottom-24 left-3 right-3 z-40 max-w-md mx-auto animate-fadeIn">
      <div className="bg-gradient-to-r from-brand-green to-brand-blue text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-black backdrop-blur shrink-0">
          T
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight">Instala Truekly Match</p>
          {isIOS ? (
            <p className="text-[11px] text-white/90 leading-tight mt-1">
              Toca <b>Compartir ⬆</b> y luego <b>"Añadir a Inicio"</b>
            </p>
          ) : (
            <p className="text-[11px] text-white/90 leading-tight mt-1">
              Tendrás un icono en tu pantalla, sin App Store
            </p>
          )}
        </div>
        {!isIOS && (
          <button
            onClick={install}
            className="px-3 py-2 rounded-xl bg-white text-brand-green-dark font-bold text-sm hover:scale-105 transition shrink-0"
          >
            Instalar
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
