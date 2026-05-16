"use client";

export default function MatchModal({ myProduct, theirProduct, onClose, onChat }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-black/60 animate-fadeIn">
      <div className="relative w-full max-w-md text-center">
        <h1 className="text-6xl font-black bg-gradient-to-r from-brand-green to-brand-blue bg-clip-text text-transparent mb-2 animate-popIn">
          ¡Es Match!
        </h1>
        <p className="text-white/90 text-lg mb-8">
          A {theirProduct.owner} también le interesa tu trueque
        </p>

        <div className="flex justify-center items-center gap-4 mb-8">
          <div
            className="w-36 h-44 rounded-2xl bg-cover bg-center border-4 border-brand-green shadow-2xl rotate-[-6deg]"
            style={{ backgroundImage: `url('${myProduct.photos[0]}')` }}
          />
          <div className="text-5xl animate-pulse">🤝</div>
          <div
            className="w-36 h-44 rounded-2xl bg-cover bg-center border-4 border-brand-blue shadow-2xl rotate-[6deg]"
            style={{ backgroundImage: `url('${theirProduct.photos[0]}')` }}
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={onChat}
            className="w-full py-4 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-lg shadow-2xl hover:scale-105 transition"
          >
            Enviar mensaje
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-white/10 text-white font-medium border border-white/20 hover:bg-white/20 transition"
          >
            Seguir descubriendo
          </button>
        </div>
      </div>
    </div>
  );
}
