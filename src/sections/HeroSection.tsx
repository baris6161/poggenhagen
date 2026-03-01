"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Calendar, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToNext = () => {
    const nextSection = document.getElementById("naechstes-spiel");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Animated glow orbs */}
      <div className="glow-orb w-[500px] h-[500px] top-[-100px] left-[-100px] animate-glow-move" />
      <div className="glow-orb w-[400px] h-[400px] bottom-[-80px] right-[-80px] animate-glow-move-delayed" />

      <div className="container relative z-10 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-primary font-body font-semibold text-sm md:text-base tracking-widest uppercase mb-4">
            {siteConfig.league} | {siteConfig.region}
          </p>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none text-foreground neon-text-glow">
            TSV POGGENHAGEN
          </h1>
          <p className="font-display text-3xl md:text-4xl text-muted-foreground mt-2">
            1. HERREN
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a
              href="#naechstes-spiel"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-semibold rounded-lg neon-glow hover:scale-105 transition-transform"
            >
              <Calendar className="w-5 h-5" />
              Nächstes Spiel
            </a>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-body font-semibold rounded-lg hover:border-primary/50 hover:text-primary transition-all"
            >
              Instagram
            </a>
          </div>
        </motion.div>

        {/* Animated Scroll Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.button
            onClick={scrollToNext}
            className="flex flex-col items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-xs font-body font-semibold uppercase tracking-wider">Scroll</span>
            <ChevronDown className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
