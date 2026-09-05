export const metadata = {
  title: "Términos y Privacidad | Truekly Match",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen px-5 py-12 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white font-black text-lg shadow">
          T
        </div>
        <span className="font-black text-lg bg-gradient-to-r from-brand-green-dark to-brand-blue-dark bg-clip-text text-transparent">
          Truekly Match
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Términos y Privacidad</h1>
      <p className="text-foreground/50 text-sm mb-10">Última actualización: septiembre 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Términos de uso</h2>
        <div className="space-y-3 text-foreground/75 leading-relaxed text-sm">
          <p>Truekly Match es una plataforma de trueque entre particulares. Al usar la app aceptas estos términos.</p>
          <p><b>Responsabilidad de los trueques.</b> Los intercambios se realizan entre usuarios. Truekly Match no garantiza la calidad, estado ni entrega de los artículos. Eres responsable de verificar los productos antes de cualquier intercambio.</p>
          <p><b>Contenido prohibido.</b> No está permitido publicar artículos ilegales, falsificados, peligrosos ni contenido que infrinja derechos de terceros.</p>
          <p><b>Cuentas.</b> Debes tener al menos 18 años para usar Truekly Match. Solo se permite una cuenta por persona.</p>
          <p><b>Cambios.</b> Podemos modificar o interrumpir el servicio en cualquier momento sin previo aviso.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Política de privacidad</h2>
        <div className="space-y-3 text-foreground/75 leading-relaxed text-sm">
          <p><b>Datos que recogemos.</b> Email, nombre y fotos de perfil (vía Google OAuth). Productos publicados, chats, valoraciones y preferencias de uso.</p>
          <p><b>Cómo usamos tus datos.</b> Para mostrarte productos relevantes, permitir el chat con otros usuarios, enviar notificaciones y mejorar la experiencia de la app.</p>
          <p><b>Compartición de datos.</b> No vendemos tus datos. Compartimos información técnica con Supabase (base de datos) y Vercel (hosting) para operar el servicio.</p>
          <p><b>Push notifications.</b> Solo enviamos notificaciones si las activas explícitamente. Puedes desactivarlas en cualquier momento desde los ajustes de tu navegador.</p>
          <p><b>Tus derechos.</b> Puedes solicitar la eliminación de tu cuenta y datos escribiendo a privacy@truekly.app.</p>
          <p><b>Cookies.</b> Usamos cookies de sesión necesarias para el inicio de sesión. No usamos cookies de seguimiento de terceros.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Contacto</h2>
        <p className="text-foreground/75 text-sm">Para cualquier consulta: <a href="mailto:privacy@truekly.app" className="text-brand-blue-dark underline">privacy@truekly.app</a></p>
      </section>

      <div className="border-t border-foreground/10 pt-6 text-center text-xs text-foreground/40">
        © 2026 Truekly Match · Hecho con 🤝
      </div>
    </div>
  );
}
