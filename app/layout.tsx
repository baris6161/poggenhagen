import type { Metadata } from "next";
import { Inter, Teko, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const teko = Teko({ subsets: ["latin"], variable: "--font-teko", weight: ["400", "500", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "TSV Poggenhagen - 1. Herren",
  description: "Offizielle Website der 1. Herren des TSV Poggenhagen. Aktuelle Spielergebnisse, Spielplan, Tabelle und Kader-Informationen.",
  keywords: ["TSV Poggenhagen", "Fußball", "Kreisliga", "Neustadt", "1. Herren", "Verein"],
  authors: [{ name: "TSV Poggenhagen" }],
  creator: "TSV Poggenhagen",
  publisher: "TSV Poggenhagen",
  metadataBase: new URL("https://poggenhagen.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://poggenhagen.vercel.app",
    siteName: "TSV Poggenhagen - 1. Herren",
    title: "TSV Poggenhagen - 1. Herren",
    description: "Offizielle Website der 1. Herren des TSV Poggenhagen. Aktuelle Spielergebnisse, Spielplan, Tabelle und Kader-Informationen.",
    images: [
      {
        url: "/TSV-Poggenhagen.webp",
        width: 1200,
        height: 630,
        alt: "TSV Poggenhagen Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TSV Poggenhagen - 1. Herren",
    description: "Offizielle Website der 1. Herren des TSV Poggenhagen. Aktuelle Spielergebnisse, Spielplan, Tabelle und Kader-Informationen.",
    images: ["/TSV-Poggenhagen.webp"],
    creator: "@tsv.poggenhagen",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Next.js erkennt automatisch icon.png, icon.ico, apple-icon.png im app/ Ordner
  // und generiert alle notwendigen Favicon-Größen automatisch
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <head>
        <link rel="canonical" href="https://poggenhagen.vercel.app" />
      </head>
      <body className={`${inter.variable} ${teko.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <TooltipProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </body>
    </html>
  );
}
