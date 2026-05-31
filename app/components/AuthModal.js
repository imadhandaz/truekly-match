"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function AuthModal({ onClose, mode: initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const isSignup = mode === "signup";
  const isReset = mode === "reset";

  const handleGoogle = async () => {
    setError(null);
    setGoogleBusy(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: process.env.NEXT_PUBLIC_APP_URL },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || "Error al conectar con Google");
      setGoogleBusy(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const supabase = getSupabase();

    try {
      if (isReset) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: process.env.NEXT_PUBLIC_APP_URL + "/reset-password",
        });
        if (error) throw error;
        setInfo("Te hemos enviado un email con el enlace para restablecer tu contraseña.");
      } else if (isSignup) {
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

  const headerTitle = isReset
    ? "Restablecer contraseña"
    : isSignup
    ? "Crear cuenta"
    : "Iniciar sesión";

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
            {headerTitle}
          </h2>
          <span className="w-12" />
        </div>

        <div className="px-6 py-6">
          {isReset ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white text-2xl font-black shadow-xl">
                  T
                </div>
                <h3 className="text-xl font-black">¿Olvidaste tu contraseña?</h3>
                <p className="text-sm text-foreground/60 mt-1">
                  Te enviamos un enlace para recuperarla
                </p>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
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
                  {busy ? "..." : "Enviar enlace"}
                </button>
              </form>

              <div className="mt-5 text-center text-sm">
                <button
                  onClick={() => switchMode("signin")}
                  className="font-bold bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent"
                >
                  ← Volver
                </button>
              </div>
            </>
          ) : (
            <>
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

              {/* Google sign-in */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleBusy || busy}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border border-foreground/15 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 text-sm font-semibold text-gray-700"
              >
                <GoogleIcon />
                {googleBusy ? "Redirigiendo…" : "Continuar con Google"}
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-foreground/10" />
                <span className="text-xs text-foreground/40 whitespace-nowrap">— o continúa con —</span>
                <div className="flex-1 h-px bg-foreground/10" />
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

                {!isSignup && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => switchMode("reset")}
                      className="text-sm text-foreground/60 hover:text-foreground transition"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

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
                      onClick={() => switchMode("signin")}
                      className="font-bold bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent"
                    >
                      Inicia sesión
                    </button>
                  </>
                ) : (
                  <>
                    ¿No tienes cuenta?{" "}
                    <button
                      onClick={() => switchMode("signup")}
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
            </>
          )}
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

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
