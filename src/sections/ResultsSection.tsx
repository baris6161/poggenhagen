"use client";

import { getLastResults, type Match } from "@/data/matches";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import SectionBackground from "@/components/SectionBackground";

function getResultLabel(match: Match) {
  if (match.cancelled) return "A";
  const isHome = match.isHome;
  const ourGoals = isHome ? match.result!.home : match.result!.away;
  const theirGoals = isHome ? match.result!.away : match.result!.home;
  if (ourGoals > theirGoals) return "S";
  if (ourGoals < theirGoals) return "N";
  return "U";
}

function resultColor(label: string) {
  if (label === "A") return "bg-muted text-muted-foreground";
  if (label === "S") return "bg-green-500/20 text-green-400";
  if (label === "N") return "bg-red-500/20 text-red-400";
  return "bg-yellow-500/20 text-yellow-400";
}

export default function ResultsSection() {
  // Hole die letzten Ergebnisse (inklusive automatisch verschobener Spiele)
  const allResults = getLastResults();
  
  // Nur die letzten 5 Ergebnisse anzeigen
  const recentResults = allResults.slice(0, 5);
  
  return (
    <section id="ergebnisse" className="relative py-20 md:py-28 overflow-hidden">
      <SectionBackground variant={5} />
      <div className="container relative z-10">
        <ScrollReveal>
          <SectionHeading title="Ergebnisse" subtitle="Letzte Spiele" />
        </ScrollReveal>

        {recentResults.length === 0 ? (
          <ScrollReveal delay={0.1}>
            <div className="card-surface p-8 text-center">
              <p className="text-muted-foreground">Noch keine Ergebnisse verfügbar.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Ergebnisse werden nach jedem Spieltag in <code className="text-primary">src/data/matches.ts</code> eingetragen.
              </p>
            </div>
          </ScrollReveal>
        ) : (
            <div className="grid gap-4">
              {recentResults.map((match, i) => {
                const label = getResultLabel(match);
                return (
                  <ScrollReveal key={match.id} delay={i * 0.08}>
                    <div className="card-surface p-4 md:p-6 flex items-center gap-4">
                      <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-bold ${resultColor(label)}`}>
                        {label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-body font-medium text-foreground text-sm md:text-base">{match.homeTeam}</span>
                          <span className="font-display text-xl md:text-2xl font-bold text-primary">
                            {match.cancelled ? (
                              <span className="text-muted-foreground font-body text-base md:text-lg">Ausfall</span>
                            ) : (
                              <>
                                {match.result!.home} : {match.result!.away}
                              </>
                            )}
                          </span>
                          <span className="font-body font-medium text-foreground text-sm md:text-base">{match.awayTeam}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:block text-right whitespace-nowrap">
                        {new Date(match.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })} · {match.venue}
                      </span>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
        )}
      </div>
    </section>
  );
}
