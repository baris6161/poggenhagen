"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Instagram, ImageIcon } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import instagramData from "@/data/instagram.json";

interface InstagramPost {
  id: string;
  imageUrl: string;
  permalink: string;
  caption: string;
  timestampISO: string;
}

const placeholderPosts = Array.from({ length: 6 }, (_, i) => ({
  id: `placeholder-${i}`,
  imageUrl: "", // Leer für Placeholder
  permalink: siteConfig.instagramUrl,
  caption: `Matchday vibes 🔥 #TSVPoggenhagen #Kreisliga${i === 0 ? " #Sieg" : ""}`,
  timestampISO: new Date().toISOString(),
}));

export default function InstagramSection() {
  const posts: InstagramPost[] = instagramData.length > 0 ? instagramData : placeholderPosts;

  return (
    <section id="instagram" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Instagram className="w-7 h-7 text-primary" />
              <span className="font-body text-lg text-muted-foreground">@{siteConfig.instagramHandle}</span>
            </div>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground font-body font-semibold rounded-lg hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all text-sm"
            >
              <Instagram className="w-4 h-4" />
              Auf Instagram öffnen
            </a>
          </div>
          <SectionHeading title="Instagram" />
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-8">
          {posts.map((post, i) => {
            const isPlaceholder = !post.imageUrl || post.imageUrl === "";
            
            return (
              <motion.a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="card-surface aspect-square overflow-hidden relative group cursor-pointer"
              >
                {isPlaceholder ? (
                  // Placeholder mit Icon
                  <div className="relative w-full h-full bg-muted/30 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground/70 font-body">Bild folgt</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Image */}
                    <div className="relative w-full h-full">
                      <Image
                        src={post.imageUrl}
                        alt={post.caption || "Instagram Post"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-xs text-foreground line-clamp-3 font-body">{post.caption}</p>
                    </div>

                    {/* Subtle Glow on Hover */}
                    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-colors duration-300 pointer-events-none" />
                  </>
                )}
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
