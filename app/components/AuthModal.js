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
  const [showPass, setShowPass] = useState(false);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(20px)" }}
    >
      <div
        className="w-full sm:max-w-md relative overflow-hidden sm:rounded-3xl rounded-t-3xl animate-slideInUp"
        style={{
          background: "linear-gradient(160deg, rgba(10,22,18,0.97) 0%, rgba(5,14,11,0.99) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 80px rgba(16,185,129,0.12), 0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(16,185,129,0.6), rgba(14,165,233,0.6), transparent)" }}
        />
        <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)" }} />
        <div className="absolute -top-10 -right-16 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.12), transparent 70%)" }} />

        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        <div className="flex items-center justify-between px-5 py-4 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/10 active:scale-90"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)", boxShadow: "0 2px 12px rgba(16,185,129,0.5)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18"/>
              </svg>
            </div>
            <span
              className="font-black text-white text-base"
              style={{ fontFamily: "var(--font-jakarta), system-ui", letterSpacing: "-0.02em" }}
            >
              Truekly
            </span>
          </div>

          <span className="w-8" />
        </div>

        <div className="px-6 pb-8 pt-2 relative z-10">
          {isReset ? (
            <ResetForm
              email={email}
              setEmail={setEmail}
              busy={busy}
              error={error}
              info={info}
              onSubmit={submit}
              onBack={() => switchMode("signin")}
            />
          ) : (
            <>
              <div className="text-center mb-6">
                <h2
                  className="font-black text-white leading-tight mb-1"
                  style={{ fontSize: 26, fontFamily: "var(--font-jakarta), system-ui", letterSpacing: "-0.025em" }}
                >
                  {isSignup ? "Crea tu cuenta gratis" : "Bienvenido de vuelta"}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                  {isSignup ? "Sin tarjeta de crédito. Sin complicaciones." : "Sigue truekeando donde lo dejaste"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleBusy || busy}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mb-4"
                style={{
                  background: "rgba(255,255,255,0.97)",
                  color: "#1a1a1a",
                  fontSize: 15,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                }}
              >
                <GoogleIcon />
                {googleBusy ? "Redirigiendo..." : "Continuar con Google"}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>o con email</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              </div>

              <form onSubmit={submit} className="space-y-3">
                {isSignup && (
                  <InputField
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tu nombre"
                    autoComplete="name"
                    maxLength={30}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    }
                  />
                )}
                <InputField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  required
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  }
                />
                <div className="relative">
                  <InputField
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "Contrasena (min. 6 caracteres)" : "Contrasena"}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    minLength={6}
                    required
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    }
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {showPass ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    }
                  />
                </div>

                {!isSignup && (
                  <div className="text-right -mt-1">
                    <button
                      type="button"
                      onClick={() => switchMode("reset")}
                      className="text-xs font-semibold transition-opacity hover:opacity-80"
                      style={{ color: "rgba(52,211,153,0.85)" }}
                    >
                      Olvidaste tu contrasena?
                    </button>
                  </div>
                )}

                {error && (
                  <div
                    className="flex items-start gap-2 px-3.5 py-3 rounded-xl text-sm"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
                  >
                    {error}
                  </div>
                )}
                {info && (
                  <div
                    className="flex items-start gap-2 px-3.5 py-3 rounded-xl text-sm"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7" }}
                  >
                    {info}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-4 rounded-2xl font-black text-white relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #0ea5e9 100%)",
                    backgroundSize: "200% 100%",
                    fontSize: 16,
                    fontFamily: "var(--font-jakarta), system-ui",
                    boxShadow: "0 8px 32px rgba(16,185,129,0.45), 0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <span className="relative z-10">
                    {busy ? "Procesando..." : isSignup ? "Crear cuenta gratis" : "Entrar"}
                  </span>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)", animation: "shimmer-btn 3s ease-in-out 1.5s infinite" }}
                  />
                </button>
              </form>

              <p className="text-center mt-5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                {isSignup ? "Ya tienes cuenta? " : "No tienes cuenta? "}
                <button
                  onClick={() => switchMode(isSignup ? "signin" : "signup")}
                  className="font-bold transition-opacity hover:opacity-80"
                  style={{ background: "linear-gradient(90deg, #34d399, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {isSignup ? "Inicia sesion" : "Registrate gratis"}
                </button>
              </p>

              <p className="text-center text-[11px] mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                Tus datos estan seguros. Sin spam garantizado.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResetForm({ email, setEmail, busy, error, info, onSubmit, onBack }) {
  return (
    <>
      <div className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h2 className="font-black text-white text-xl" style={{ fontFamily: "var(--font-jakarta), system-ui" }}>
          Recupera tu acceso
        </h2>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Te enviamos un enlace al email
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          required
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          }
        />
        {error && (
          <div className="px-3.5 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
            {error}
          </div>
        )}
        {info && (
          <div className="px-3.5 py-3 rounded-xl text-sm" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7" }}>
            {info}
          </div>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-4 rounded-2xl font-black text-white relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #0ea5e9 100%)",
            boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
            fontFamily: "var(--font-jakarta), system-ui",
          }}
        >
          {busy ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      <div className="text-center mt-5">
        <button
          onClick={onBack}
          className="text-sm font-semibold flex items-center gap-1.5 mx-auto"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Volver al inicio de sesion
        </button>
      </div>
    </>
  );
}

function InputField({ icon, rightElement, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <div
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {icon}
        </div>
      )}
      <input
        {...props}
        className="w-full py-3.5 rounded-xl text-white font-medium transition-all outline-none"
        style={{
          paddingLeft: icon ? "2.5rem" : "1rem",
          paddingRight: rightElement ? "2.5rem" : "1rem",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: 15,
        }}
      />
      {rightElement}
    </div>
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
