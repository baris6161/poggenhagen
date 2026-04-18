import type { Metadata, Viewport } from "next";
import { Inter, Teko, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoJsonLd from "@/components/SeoJsonLd";
import {
  getCanonicalSiteUrl,
  defaultOgImagePath,
  seoDefaults,
  seoKeywords,
} from "@/config/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import PwaDataRefresh from "@/components/PwaDataRefresh";

const siteUrl = getCanonicalSiteUrl();
const absoluteOgImage = new URL(defaultOgImagePath, `${siteUrl}/`).toString();

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const teko = Teko({ subsets: ["latin"], variable: "--font-teko", weight: ["400", "500", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

const isVercelPreview = process.env.VERCEL_ENV === "preview";

export const viewport: Viewport = {
  themeColor: "#0c0f0a",
};

export async function generateMetadata(): Promise<Metadata> {
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

  return {
    title: {
      default: seoDefaults.title,
      template: "%s | TSV Poggenhagen 1. Herren",
    },
    description: seoDefaults.description,
    keywords: [...seoKeywords],
    authors: [{ name: "TSV Poggenhagen" }],
    creator: "TSV Poggenhagen",
    publisher: "TSV Poggenhagen",
    applicationName: seoDefaults.siteName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
    },
    category: "sports",
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: siteUrl,
      siteName: seoDefaults.siteName,
      title: seoDefaults.title,
      description: seoDefaults.description,
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: "TSV Poggenhagen 1. Herren, Fußball Kreisliga Neustadt am Rübenberge",
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
    robots: isVercelPreview
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
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
    icons: {
      icon: [{ url: "/wappen.png", type: "image/png", sizes: "32x32" }],
      apple: [{ url: "/wappen.png", sizes: "180x180" }],
    },
    appleWebApp: {
      capable: true,
      title: "TSV Poggenhagen",
      statusBarStyle: "black-translucent",
    },
    ...(googleVerification
      ? {
          verification: {
            google: googleVerification,
          },
        }
      : {}),
  };
}

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
        {!isVercelPreview ? <SeoJsonLd /> : null}
        <TooltipProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
          <Sonner />
          <Analytics />
          <SpeedInsights />
          <AddToHomeScreen />
          <PwaDataRefresh />
        </TooltipProvider>
      </body>
    </html>
  );
}
