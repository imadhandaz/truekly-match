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
  title: "Truekly Match — Trueque con match",
  description:
    "Intercambia productos haciendo match. Móviles, consolas, bicis y más. Lo tuyo por lo suyo, donde estés.",
  applicationName: "Truekly Match",
  keywords: ["trueque", "intercambio", "match", "wallapop", "segunda mano", "España", "global"],
  authors: [{ name: "Truekly Match" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Truekly",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Truekly Match — Lo tuyo por lo suyo",
    description:
      "Intercambia productos haciendo match estilo Tinder. España y todo el mundo.",
    type: "website",
    locale: "es_ES",
    siteName: "Truekly Match",
  },
  twitter: {
    card: "summary_large_image",
    title: "Truekly Match",
    description: "Trueque de productos con UX de match. En cualquier ciudad.",
  },
};

export const viewport = {
  themeColor: "#10b981",
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
    >
      <body className="min-h-full flex flex-col">
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
