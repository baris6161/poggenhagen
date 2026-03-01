import { useState } from "react";
import { players, type Position } from "@/data/players";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const positions: (Position | "Alle")[] = ["Alle", "Tor", "Abwehr", "Mittelfeld", "Sturm"];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

export default function SquadSection() {
  const [filter, setFilter] = useState<Position | "Alle">("Alle");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((player, i) => (
            <ScrollReveal key={player.id} delay={i * 0.05}>
              <div className="card-surface p-5 group">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:neon-glow transition-shadow">
                  <span className="font-display text-2xl font-bold text-muted-foreground">
                    {getInitials(player.name)}
                  </span>
                </div>
                {player.number && (
                  <p className="text-center font-display text-sm text-primary mb-1">#{player.number}</p>
                )}
                <h3 className="text-center font-display text-xl font-bold text-foreground">
                  {player.name}
                </h3>
                <p className="text-center text-sm text-muted-foreground mt-1">{player.position}</p>
                <p className="text-center text-xs text-muted-foreground mt-1">Jg. {player.birthYear}</p>

                {player.previousClubs && player.previousClubs.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpandedId(expandedId === player.id ? null : player.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
                    >
                      Vorherige Vereine
                      {expandedId === player.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {expandedId === player.id && (
                      <div className="mt-2 text-center text-xs text-muted-foreground space-y-1 animate-fade-in">
                        {player.previousClubs.map((c) => (
                          <p key={c}>{c}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
