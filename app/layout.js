import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  metadataBase: new URL("https://truekly-match.vercel.app"),
  title: "Truekly Match — Trueque de objetos en Madrid",
  description:
    "Sube lo que ya no usas. Consigue lo que necesitas. Sin dinero. Intercambia objetos haciendo match con personas de tu ciudad.",
  applicationName: "Truekly Match",
  keywords: ["trueque", "intercambio", "match", "wallapop", "segunda mano", "España", "Madrid", "global"],
  authors: [{ name: "Truekly Match" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Truekly",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Truekly Match — Trueque de objetos en Madrid",
    description:
      "Sube lo que ya no usas. Consigue lo que necesitas. Sin dinero. Truekly conecta personas que tienen lo que tú buscas.",
    type: "website",
    locale: "es_ES",
    siteName: "Truekly Match",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Truekly Match" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truekly Match — Trueque sin dinero",
    description: "Sube lo que ya no usas. Consigue lo que necesitas. Sin dinero.",
  },
};

export const viewport = {
  themeColor: "#0a1612",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${jakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Apply saved theme before first paint to avoid a light-mode flash (dark is the default) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var raw=localStorage.getItem("truekly:ui:v2");var dark=raw?JSON.parse(raw).darkMode!==false:true;if(dark)document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}',
          }}
        />
        {/* Animated blob background */}
        <div className="blob-bg" aria-hidden="true">
          <div className="blob-1" />
          <div className="blob-2" />
          <div className="blob-3" />
        </div>
        {/* Content sits above blobs */}
        <div className="relative z-10 flex flex-col flex-1 min-h-screen">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
