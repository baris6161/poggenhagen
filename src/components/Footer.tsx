"use client";

import { MapPin } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-border bg-card/50 py-8 md:py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-bold text-foreground mb-2">TSV Poggenhagen</p>
            <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4" />
              Ilschenheide 4, 31535 Neustadt am Rübenberge
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground mb-2">
              © {new Date().getFullYear()} TSV Poggenhagen. Alle Rechte vorbehalten.
            </p>
            <button
              onClick={scrollToTop}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Nach oben ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
