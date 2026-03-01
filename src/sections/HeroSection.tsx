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
      
      {/* Additional animated glow orbs for flickering effect */}
      <motion.div
        className="glow-orb w-[350px] h-[350px] top-[20%] right-[10%]"
        animate={{
          opacity: [0.08, 0.15, 0.08],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="glow-orb w-[300px] h-[300px] bottom-[30%] left-[15%]"
        animate={{
          opacity: [0.1, 0.18, 0.1],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="glow-orb w-[280px] h-[280px] top-[60%] left-[5%]"
        animate={{
          opacity: [0.06, 0.14, 0.06],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Kariertes Muster - hinter den anderen Animationen */}
      <div className="absolute inset-0 z-0 opacity-[0.02]">
        <div 
          className="absolute inset-0 animate-grid-move" 
          style={{
            backgroundImage: `
              linear-gradient(hsl(70 100% 50% / 0.12) 1px, transparent 1px),
              linear-gradient(90deg, hsl(70 100% 50% / 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} 
        />
        <div 
          className="absolute inset-0 animate-grid-move-reverse" 
          style={{
            backgroundImage: `
              linear-gradient(hsl(70 100% 50% / 0.08) 1px, transparent 1px),
              linear-gradient(90deg, hsl(70 100% 50% / 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px',
          }} 
        />
      </div>

      {/* Animated Grid Pattern Background - sehr subtil */}
      <div className="absolute inset-0 z-0 opacity-[0.025]">
        {/* Haupt-Grid */}
        <div 
          className="absolute inset-0 animate-grid-move" 
          style={{
            backgroundImage: `
              linear-gradient(hsl(70 100% 50% / 0.15) 1px, transparent 1px),
              linear-gradient(90deg, hsl(70 100% 50% / 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }} 
        />
        {/* Sekundäres Grid (größer, langsamer) */}
        <div 
          className="absolute inset-0 animate-grid-move-reverse" 
          style={{
            backgroundImage: `
              linear-gradient(hsl(70 100% 50% / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(70 100% 50% / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '160px 160px',
          }} 
        />
      </div>

      {/* Subtle animated diagonal lines */}
      <div className="absolute inset-0 z-0 opacity-[0.015]">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 120px, hsl(70 100% 50% / 0.2) 120px, hsl(70 100% 50% / 0.2) 121px)',
          }}
          animate={{
            x: [0, 240, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'repeating-linear-gradient(-45deg, transparent, transparent 180px, hsl(70 100% 50% / 0.15) 180px, hsl(70 100% 50% / 0.15) 181px)',
          }}
          animate={{
            x: [0, -240, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative z-10 pt-20 pb-24">
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

        {/* Animated Scroll Arrow - 1.5cm weiter unten */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.button
            onClick={scrollToNext}
            className="flex flex-col items-center gap-2 text-primary hover:text-primary/80 transition-colors group cursor-pointer"
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
