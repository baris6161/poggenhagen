"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Menu, X, Instagram } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
      // find active section
      const sections = siteConfig.navItems.map((n) => n.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection("#" + sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    if (typeof window === "undefined") return;
    const el = document.getElementById(href.replace("#", ""));
    el?.scrollIntoView({ behavior: "smooth" });
  }, [pathname, router]);

  const handleLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;
      e.preventDefault();
      if (typeof window === "undefined") return;
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("#hero");
    },
    [pathname],
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-header border-b border-border/30" : ""
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2"
          >
            <span className="font-display text-2xl md:text-3xl font-bold text-foreground">
              TSV <span className="text-primary">POGGENHAGEN</span>
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-body mt-1">
              1. Herren
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {siteConfig.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className={`nav-link text-sm font-medium pb-1 ${
                  activeSection === item.href ? "active" : ""
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href={siteConfig.mainClubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Hauptverein
            </a>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü öffnen"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl overflow-y-auto"
          >
            <nav className="min-h-full w-full flex flex-col items-center justify-center gap-4 py-24 px-6">
              {siteConfig.navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="font-display text-3xl sm:text-4xl font-semibold text-foreground hover:text-primary transition-colors text-center leading-tight"
                >
                  {item.label}
                </motion.a>
              ))}
              <a
                href={siteConfig.mainClubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-3xl sm:text-4xl font-semibold text-primary hover:text-primary/80 transition-colors text-center leading-tight pt-2"
              >
                Hauptverein
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-primary"
              >
                <Instagram className="w-8 h-8" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
