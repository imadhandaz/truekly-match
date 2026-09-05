import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          defer
          data-domain="truekly-match.vercel.app"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
