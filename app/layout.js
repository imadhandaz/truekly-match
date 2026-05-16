import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    "Intercambia productos haciendo match. Móviles, consolas, bicis y más. Lo tuyo por lo suyo, en Madrid.",
  applicationName: "Truekly Match",
  keywords: ["trueque", "intercambio", "match", "wallapop", "segunda mano", "madrid"],
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
      "Intercambia productos haciendo match estilo Tinder. Madrid y más ciudades pronto.",
    type: "website",
    locale: "es_ES",
    siteName: "Truekly Match",
  },
  twitter: {
    card: "summary_large_image",
    title: "Truekly Match",
    description: "Trueque de productos con UX de match. Madrid.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
