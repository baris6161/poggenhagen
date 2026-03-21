import type { Metadata } from "next";
import { Inter, Teko, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCanonicalSiteUrl, defaultOgImagePath, seoDefaults } from "@/config/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const siteUrl = getCanonicalSiteUrl();
const absoluteOgImage = new URL(defaultOgImagePath, `${siteUrl}/`).toString();

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const teko = Teko({ subsets: ["latin"], variable: "--font-teko", weight: ["400", "500", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: {
    default: seoDefaults.title,
    template: "%s · TSV Poggenhagen 1. Herren",
  },
  description: seoDefaults.description,
  keywords: [
    "TSV Poggenhagen",
    "1. Herren",
    "Fußball",
    "Kreisliga",
    "Neustadt am Rübenberge",
    "Spielplan",
    "Tabelle",
    "Kader",
  ],
  authors: [{ name: "TSV Poggenhagen" }],
  creator: "TSV Poggenhagen",
  publisher: "TSV Poggenhagen",
  applicationName: "TSV Poggenhagen 1. Herren",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "TSV Poggenhagen – 1. Herren",
    title: seoDefaults.title,
    description: seoDefaults.description,
    images: [
      {
        url: absoluteOgImage,
        width: 1200,
        height: 630,
        alt: "TSV Poggenhagen – 1. Herren Fußball",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoDefaults.title,
    description: seoDefaults.description,
    images: [absoluteOgImage],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <head>
        <meta property="og:image:secure_url" content={absoluteOgImage} />
      </head>
      <body className={`${inter.variable} ${teko.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <TooltipProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
          <Sonner />
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </body>
    </html>
  );
}
