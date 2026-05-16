"use client";

export default function LikesYouScreen({ products, onUpgrade }) {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
          {products.length} personas te han dado like
        </h2>
      </div>

      <button
        onClick={onUpgrade}
        className="w-full mb-5 p-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 text-white font-bold shadow-lg flex items-center justify-between hover:scale-[1.01] transition"
      >
        <div className="text-left">
          <p className="text-sm font-black">✨ Hazte Gold para ver quién</p>
          <p className="text-xs font-medium opacity-90 mt-0.5">
            Y matchea hasta 3× más rápido
          </p>
        </div>
        <span className="text-xl">›</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={onUpgrade}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group hover:scale-[1.02] transition"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${p.photos[0]}')`, filter: "blur(18px)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="text-3xl mb-1">🔒</div>
              <p className="text-xs font-bold uppercase tracking-wider">Bloqueado</p>
            </div>
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] font-black shadow">
              GOLD
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-foreground/5 text-center">
        <p className="text-sm text-foreground/70 leading-relaxed">
          💡 Con <b>Gold</b> ves todas las caras y matcheas de un toque sin esperar.
        </p>
      </div>
    </div>
  );
}
