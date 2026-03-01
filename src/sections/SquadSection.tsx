"use client";

import { useState } from "react";
import Image from "next/image";
import type { Player, Position } from "@/data/players";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const positions: (Position | "Alle")[] = ["Alle", "Tor", "Abwehr", "Mittelfeld", "Sturm"];

interface SquadSectionProps {
  players: Player[];
}

export default function SquadSection({ players }: SquadSectionProps) {
  const [filter, setFilter] = useState<Position | "Alle">("Alle");
  const [search, setSearch] = useState("");

  const filtered = players.filter((p) => {
    if (filter !== "Alle" && p.position !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section id="kader" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <ScrollReveal>
          <SectionHeading title="Kader" subtitle={`${players.length} Spieler`} />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-6">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setFilter(pos)}
                className={`filter-chip ${filter === pos ? "active" : ""}`}
              >
                {pos}
              </button>
            ))}
          </div>
          <div className="relative mb-8 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Spieler suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((player, i) => (
            <ScrollReveal key={player.id} delay={i * 0.05}>
              <div className="card-surface p-5 group">
                {/* Player Image */}
                {player.image ? (
                  <div className="w-32 h-32 rounded-lg overflow-hidden mx-auto mb-4 group-hover:neon-glow transition-shadow relative">
                    <Image
                      src={player.image}
                      alt={player.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 128px, 128px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                ) : null}
                <h3 className="text-center font-display text-xl font-bold text-foreground">
                  {player.name}
                </h3>
                <p className="text-center text-sm text-muted-foreground mt-1">{player.position}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
