"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Instagram } from "lucide-react";
import { useEffect } from "react";

interface InstagramSectionProps {
  images: string[];
}

export default function InstagramSection({ images }: InstagramSectionProps) {
  useEffect(() => {
    console.log("InstagramSection rendered with images:", images);
    console.log("Images length:", images?.length);
  }, [images]);

  // Wenn keine Bilder vorhanden, nichts anzeigen
  if (!images || images.length === 0) {
    console.warn("InstagramSection: No images provided, returning null");
    return null;
  }

  console.log("InstagramSection: Rendering", images.length, "images");

  return (
    <section id="instagram" className="py-20 md:py-28 section-gradient">
      <div className="container">
        {/* Instagram Icon + Handle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Instagram className="w-7 h-7 text-primary" />
          <span className="font-body text-lg text-muted-foreground">@{siteConfig.instagramHandle}</span>
        </div>

        {/* Bilder mittig */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
            {images.map((imageUrl, i) => {
              console.log(`Rendering Instagram image ${i}:`, imageUrl);
              return (
                <motion.a
                  key={`instagram-${i}-${imageUrl}`}
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="card-surface aspect-square overflow-hidden relative group cursor-pointer"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt={`Instagram Post ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      onError={(e) => {
                        console.error("Image load error for", imageUrl, e);
                      }}
                      onLoad={() => {
                        console.log("Image loaded successfully:", imageUrl);
                      }}
                    />
                  </div>
                  {/* Subtle Glow on Hover */}
                  <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-colors duration-300 pointer-events-none" />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Button darunter */}
        <div className="flex justify-center">
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-body font-semibold rounded-lg hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all w-full sm:w-auto"
          >
            <Instagram className="w-4 h-4" />
            Auf Instagram öffnen
          </a>
        </div>
      </div>
    </section>
  );
}
