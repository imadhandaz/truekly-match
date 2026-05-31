"use client";

export default function WelcomeScreen({ onSignUp, onSignIn }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-brand-green to-brand-blue overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-white/10" />
      <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full bg-white/10" />

      {/* Top section: logo + title */}
      <div className="relative z-10 flex flex-col items-center pt-16 px-6">
        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-2xl mb-4">
          <span className="text-3xl font-black bg-gradient-to-br from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
            T
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Truekly Match</h1>
        <p className="text-white/80 text-base mt-1 font-medium tracking-wide">
          Lo tuyo por lo suyo
        </p>
      </div>

      {/* Illustration */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-4">
        <BarterIllustration />
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 w-full px-6 pb-12 flex flex-col gap-3 max-w-sm mx-auto">
        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-2xl bg-white text-brand-green-dark font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition"
        >
          Crear cuenta
        </button>
        <button
          onClick={onSignIn}
          className="w-full py-4 rounded-2xl bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 active:bg-white/20 transition"
        >
          Iniciar sesión
        </button>
        <p className="text-center text-white/50 text-xs mt-1">
          Al registrarte aceptas nuestros Términos y Política de privacidad.
        </p>
      </div>
    </div>
  );
}

function BarterIllustration() {
  return (
    <svg
      viewBox="0 0 320 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs drop-shadow-2xl"
      aria-hidden="true"
    >
      {/* Ground / platform */}
      <ellipse cx="160" cy="245" rx="130" ry="12" fill="rgba(0,0,0,0.15)" />

      {/* ---- Person A (left, handing phone) ---- */}
      {/* Body */}
      <rect x="28" y="130" width="64" height="80" rx="20" fill="#A7F3D0" />
      {/* Head */}
      <circle cx="60" cy="110" r="26" fill="#FCD34D" />
      {/* Hair */}
      <ellipse cx="60" cy="87" rx="22" ry="10" fill="#92400E" />
      {/* Eye left */}
      <circle cx="52" cy="108" r="3" fill="#1E3A5F" />
      {/* Eye right */}
      <circle cx="68" cy="108" r="3" fill="#1E3A5F" />
      {/* Smile */}
      <path d="M52 118 Q60 126 68 118" stroke="#1E3A5F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Left arm (down) */}
      <rect x="14" y="140" width="18" height="52" rx="9" fill="#A7F3D0" />
      {/* Right arm (extended, offering phone) */}
      <rect x="90" y="128" width="52" height="18" rx="9" fill="#A7F3D0" />
      {/* Phone (item A hands over) */}
      <rect x="138" y="116" width="28" height="48" rx="7" fill="#1E3A5F" />
      <rect x="142" y="122" width="20" height="32" rx="4" fill="#60A5FA" />
      <circle cx="152" cy="158" r="2.5" fill="#94A3B8" />
      {/* Legs */}
      <rect x="34" y="202" width="22" height="38" rx="10" fill="#34D399" />
      <rect x="62" y="202" width="22" height="38" rx="10" fill="#34D399" />
      {/* Shoes */}
      <ellipse cx="45" cy="238" rx="14" ry="7" fill="#1E3A5F" />
      <ellipse cx="73" cy="238" rx="14" ry="7" fill="#1E3A5F" />

      {/* ---- Exchange arrows in the middle ---- */}
      {/* Arrow right */}
      <path d="M148 148 L172 148" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <polyline points="167,141 175,148 167,155" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Arrow left */}
      <path d="M172 164 L148 164" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <polyline points="153,157 145,164 153,171" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* ---- Person B (right, handing book) ---- */}
      {/* Body */}
      <rect x="228" y="130" width="64" height="80" rx="20" fill="#BFDBFE" />
      {/* Head */}
      <circle cx="260" cy="110" r="26" fill="#FCA5A5" />
      {/* Hair */}
      <ellipse cx="260" cy="87" rx="22" ry="10" fill="#1E3A5F" />
      {/* Eye left */}
      <circle cx="252" cy="108" r="3" fill="#1E3A5F" />
      {/* Eye right */}
      <circle cx="268" cy="108" r="3" fill="#1E3A5F" />
      {/* Smile */}
      <path d="M252 118 Q260 126 268 118" stroke="#1E3A5F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Right arm (down) */}
      <rect x="288" y="140" width="18" height="52" rx="9" fill="#BFDBFE" />
      {/* Left arm (extended, offering book) */}
      <rect x="178" y="128" width="52" height="18" rx="9" fill="#BFDBFE" />
      {/* Book (item B hands over) */}
      <rect x="154" y="158" width="34" height="42" rx="5" fill="#F97316" />
      <rect x="157" y="162" width="28" height="34" rx="3" fill="#FED7AA" />
      <line x1="171" y1="164" x2="171" y2="194" stroke="#F97316" strokeWidth="2" />
      <rect x="159" y="168" width="9" height="2" rx="1" fill="#F97316" />
      <rect x="159" y="174" width="9" height="2" rx="1" fill="#F97316" />
      <rect x="159" y="180" width="9" height="2" rx="1" fill="#F97316" />
      {/* Legs */}
      <rect x="234" y="202" width="22" height="38" rx="10" fill="#93C5FD" />
      <rect x="262" y="202" width="22" height="38" rx="10" fill="#93C5FD" />
      {/* Shoes */}
      <ellipse cx="245" cy="238" rx="14" ry="7" fill="#1E3A5F" />
      <ellipse cx="273" cy="238" rx="14" ry="7" fill="#1E3A5F" />

      {/* Sparkles */}
      <text x="150" y="72" fontSize="20" fill="white" opacity="0.85">✦</text>
      <text x="270" y="58" fontSize="14" fill="white" opacity="0.7">✦</text>
      <text x="82" y="66" fontSize="12" fill="white" opacity="0.6">✦</text>
    </svg>
  );
}
