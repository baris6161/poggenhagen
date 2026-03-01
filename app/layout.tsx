import type { Metadata } from "next";
import { Inter, Teko, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const teko = Teko({ subsets: ["latin"], variable: "--font-teko", weight: ["400", "500", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "TSV Poggenhagen - 1. Herren",
  description: "Offizielle Website der 1. Herren des TSV Poggenhagen",
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
