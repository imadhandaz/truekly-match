import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white text-3xl shadow-lg">
        T
      </div>
      <div>
        <h2 className="text-xl font-black text-foreground mb-2">Página no encontrada</h2>
        <p className="text-sm text-foreground/60 max-w-xs">
          Esta página no existe o fue eliminada.
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold shadow-md hover:scale-105 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
