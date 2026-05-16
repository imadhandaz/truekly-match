"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function AuthModal({ onClose, mode: initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const supabase = getSupabase();

  const isSignup = mode === "signup";

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split("@")[0],
              username: email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        if (data.user && !data.session) {
          setInfo("Te hemos enviado un email. Confirma tu cuenta para entrar.");
        } else {
          onClose();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) {
      setError(err.message || "Error desconocido");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-fadeIn flex items-end sm:items-center justify-center sm:p-6">
      <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl">
        <div className="sticky top-0 bg-background/95 backdrop-blur z-10 flex items-center justify-between px-5 py-4 border-b border-foreground/10">
          <button
            type="button"
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground text-sm font-medium"
          >
            Cerrar
          </button>
          <h2 className="font-bold bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
            {isSignup ? "Crear cuenta" : "Iniciar sesión"}
          </h2>
          <span className="w-12" />
        </div>

        <div className="px-6 py-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white text-2xl font-black shadow-xl">
              T
            </div>
            <h3 className="text-xl font-black">
              {isSignup ? "Únete a Truekly Match" : "Bienvenido de vuelta"}
            </h3>
            <p className="text-sm text-foreground/60 mt-1">
              {isSignup ? "Sin tarjeta, sin spam" : "Sigue truekeando"}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {isSignup && (
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre (lo verán otros)"
                autoComplete="name"
                maxLength={30}
              />
            )}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? "Contraseña (min 6 caracteres)" : "Contraseña"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={6}
              required
            />

            {error && (
              <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            {info && (
              <div className="px-3 py-2 rounded-xl bg-brand-green/10 border border-brand-green/30 text-brand-green-dark text-sm">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold shadow-lg hover:scale-[1.01] transition disabled:opacity-50"
            >
              {busy ? "..." : isSignup ? "Crear cuenta" : "Entrar"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm">
            {isSignup ? (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setInfo(null);
                  }}
                  className="font-bold bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent"
                >
                  Inicia sesión
                </button>
              </>
            ) : (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setInfo(null);
                  }}
                  className="font-bold bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent"
                >
                  Regístrate
                </button>
              </>
            )}
          </div>

          <p className="text-[11px] text-foreground/45 text-center mt-5">
            Al registrarte aceptas nuestros Términos y Política de privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-brand-blue focus:bg-white focus:outline-none transition placeholder:text-foreground/30 text-foreground"
    />
  );
}
