"use client";

import { siteConfig } from "@/config/site";
import { Instagram, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer id="kontakt" className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-display text-2xl font-bold text-foreground">
              TSV <span className="text-primary">POGGENHAGEN</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {siteConfig.venue.address}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/impressum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Impressum
            </Link>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.clubName}. Alle Rechte vorbehalten.
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
            aria-label="Nach oben scrollen"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
