"use client";

import { motion } from "framer-motion";

interface SectionBackgroundProps {
  variant: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

/**
 * Wiederverwendbare Komponente für Section-Hintergründe
 * Variiert die Effekte leicht für jede Section
 */
export default function SectionBackground({ variant }: SectionBackgroundProps) {
  const bgClass = `section-bg-${variant}`;
  
  // Unterschiedliche Glow-Orb-Positionen und -Größen je nach Variante
  const orbConfigs = {
    1: [
      { size: "w-[300px] h-[300px]", pos: "top-[10%] right-[15%]", anim: "animate-glow-move-2" },
      { size: "w-[250px] h-[250px]", pos: "bottom-[20%] left-[10%]", anim: "animate-glow-move-3" },
    ],
    2: [
      { size: "w-[280px] h-[280px]", pos: "top-[30%] left-[20%]", anim: "animate-glow-move" },
      { size: "w-[320px] h-[320px]", pos: "bottom-[15%] right-[25%]", anim: "animate-glow-move-2" },
    ],
    3: [
      { size: "w-[260px] h-[260px]", pos: "top-[50%] right-[10%]", anim: "animate-glow-move-3" },
      { size: "w-[290px] h-[290px]", pos: "bottom-[30%] left-[15%]", anim: "animate-glow-move" },
    ],
    4: [
      { size: "w-[310px] h-[310px]", pos: "top-[20%] left-[30%]", anim: "animate-glow-move-2" },
      { size: "w-[270px] h-[270px]", pos: "bottom-[25%] right-[20%]", anim: "animate-glow-move-3" },
    ],
    5: [
      { size: "w-[295px] h-[295px]", pos: "top-[40%] right-[30%]", anim: "animate-glow-move" },
      { size: "w-[255px] h-[255px]", pos: "bottom-[10%] left-[25%]", anim: "animate-glow-move-2" },
    ],
    6: [
      { size: "w-[285px] h-[285px]", pos: "top-[15%] left-[40%]", anim: "animate-glow-move-3" },
      { size: "w-[275px] h-[275px]", pos: "bottom-[35%] right-[15%]", anim: "animate-glow-move" },
    ],
    7: [
      { size: "w-[305px] h-[305px]", pos: "top-[25%] right-[40%]", anim: "animate-glow-move-2" },
      { size: "w-[265px] h-[265px]", pos: "bottom-[20%] left-[35%]", anim: "animate-glow-move-3" },
    ],
  };

  const orbs = orbConfigs[variant] || orbConfigs[1];
  
  // Unterschiedliche Grid-Patterns je nach Variante
  const gridConfigs = {
    1: { size1: "90px", size2: "140px", anim1: "animate-grid-move", anim2: "animate-grid-move-reverse" },
    2: { size1: "85px", size2: "150px", anim1: "animate-grid-move-2", anim2: "animate-grid-move-reverse" },
    3: { size1: "95px", size2: "130px", anim1: "animate-grid-move", anim2: "animate-grid-move-3" },
    4: { size1: "88px", size2: "145px", anim1: "animate-grid-move-2", anim2: "animate-grid-move" },
    5: { size1: "92px", size2: "135px", anim1: "animate-grid-move-3", anim2: "animate-grid-move-2" },
    6: { size1: "87px", size2: "142px", anim1: "animate-grid-move", anim2: "animate-grid-move-3" },
    7: { size1: "93px", size2: "138px", anim1: "animate-grid-move-2", anim2: "animate-grid-move" },
  };

  const grid = gridConfigs[variant] || gridConfigs[1];

  return (
    <div className={`absolute inset-0 overflow-hidden ${bgClass}`}>
      {/* Glow Orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`glow-orb-sm ${orb.size} ${orb.pos} ${orb.anim}`}
        />
      ))}

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02]">
        <div
          className={`absolute inset-0 ${grid.anim1}`}
          style={{
            backgroundImage: `
              linear-gradient(hsl(70 100% 50% / 0.12) 1px, transparent 1px),
              linear-gradient(90deg, hsl(70 100% 50% / 0.12) 1px, transparent 1px)
            `,
            backgroundSize: `${grid.size1} ${grid.size1}`,
          }}
        />
        <div
          className={`absolute inset-0 ${grid.anim2}`}
          style={{
            backgroundImage: `
              linear-gradient(hsl(70 100% 50% / 0.08) 1px, transparent 1px),
              linear-gradient(90deg, hsl(70 100% 50% / 0.08) 1px, transparent 1px)
            `,
            backgroundSize: `${grid.size2} ${grid.size2}`,
          }}
        />
      </div>

      {/* Subtle animated diagonal lines */}
      <div className="absolute inset-0 z-0 opacity-[0.01]">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: `repeating-linear-gradient(${variant % 2 === 0 ? '45deg' : '135deg'}, transparent, transparent ${100 + variant * 20}px, hsl(70 100% 50% / 0.15) ${100 + variant * 20}px, hsl(70 100% 50% / 0.15) ${101 + variant * 20}px)`,
          }}
          animate={{
            x: [0, 200 + variant * 20, 0],
          }}
          transition={{
            duration: 16 + variant * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: `repeating-linear-gradient(${variant % 2 === 0 ? '-135deg' : '-45deg'}, transparent, transparent ${150 + variant * 15}px, hsl(70 100% 50% / 0.12) ${150 + variant * 15}px, hsl(70 100% 50% / 0.12) ${151 + variant * 15}px)`,
          }}
          animate={{
            x: [0, -(200 + variant * 20), 0],
          }}
          transition={{
            duration: 20 + variant * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
