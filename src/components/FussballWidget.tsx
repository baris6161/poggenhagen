"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FussballWidgetProps {
  src: string;
  title: string;
  minHeight?: {
    mobile: number;
    desktop: number;
  };
}

export default function FussballWidget({ 
  src, 
  title,
  minHeight = { mobile: 600, desktop: 800 }
}: FussballWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full">
      {/* Loading Skeleton */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="card-surface p-8 flex items-center justify-center"
          style={{ minHeight: `${minHeight.mobile}px` }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Lade {title}...</p>
          </div>
        </motion.div>
      )}

      {/* Widget Wrapper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={`card-surface overflow-hidden ${isLoading ? "hidden" : ""}`}
        style={{
          borderRadius: "var(--radius)",
          border: "1px solid hsl(var(--border) / 0.5)",
          boxShadow: "0 0 20px hsl(70 100% 50% / 0.05), 0 4px 20px hsl(0 0% 0% / 0.3)",
        }}
      >
        <div 
          className="relative w-full"
          style={{ 
            minHeight: `${minHeight.mobile}px`,
          }}
        >
          <iframe
            src={src}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
            style={{
              minHeight: `${minHeight.mobile}px`,
            }}
            onLoad={() => setIsLoading(false)}
            loading="lazy"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </motion.div>
    </div>
  );
}
