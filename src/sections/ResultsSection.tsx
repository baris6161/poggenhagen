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

/** Farbe der Toranzeige: Verlust wie Badge, Sieg/Unentschieden unverändert Primary. */
function resultScoreTextClass(label: string): string {
  if (label === "N") return "text-red-400";
  return "text-primary";
}

type Props = {
  recentResults?: Match[];
  dataSource?: "fussball.de" | "static";
};

export default function ResultsSection({
  recentResults: recentProp,
  dataSource,
}: Props) {
  const recentResults = recentProp ?? getLastResults().slice(0, 5);
  
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
                {dataSource === "fussball.de"
                  ? "Aktuell können keine Ergebnisse von FUSSBALL.DE geladen werden — bitte später erneut versuchen."
                  : "Ergebnisse werden nach jedem Spieltag in src/data/matches.ts gepflegt oder über FUSSBALL.DE synchronisiert."}
              </p>
            </div>
          </ScrollReveal>
        ) : (
            <div className="grid gap-4">
              {recentResults.map((match, i) => {
                const label = getResultLabel(match);
                return (
                  <ScrollReveal key={match.id} delay={i * 0.08}>
                    <div className="card-surface p-4 md:p-6 flex items-center gap-3 md:gap-4">
                      <span
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-bold ${resultColor(label)}`}
                      >
                        {label}
                      </span>
                      {/* Mobile: Heim / Gast links (eng), Ergebnis rechts vertikal zwischen beiden Zeilen */}
                      <div className="grid flex-1 min-w-0 md:hidden grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] gap-x-3 gap-y-1 items-center">
                        <p
                          className={`col-start-1 row-start-1 font-body text-sm font-medium leading-snug break-words min-w-0 ${match.homeTeam.includes("Poggenhagen") ? "text-primary" : "text-foreground"}`}
                        >
                          {match.homeTeam}
                        </p>
                        <p
                          className={`col-start-1 row-start-2 font-body text-sm font-medium leading-snug break-words min-w-0 ${match.awayTeam.includes("Poggenhagen") ? "text-primary" : "text-foreground"}`}
                        >
                          {match.awayTeam}
                        </p>
                        <div className="col-start-2 row-start-1 row-span-2 flex items-center justify-center self-stretch border-l border-border/40 pl-3 min-h-[2.75rem]">
                          <span
                            className={`font-display text-xl font-bold tabular-nums text-center leading-none ${match.cancelled ? "text-muted-foreground" : resultScoreTextClass(label)}`}
                          >
                            {match.cancelled ? (
                              <span className="font-body text-xs font-semibold leading-tight block max-w-[4.5rem]">
                                Ausfall
                              </span>
                            ) : (
                              <>
                                {match.result!.home} : {match.result!.away}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      {/* Desktop: eine Zeile wie bisher */}
                      <div className="hidden md:block flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-body font-medium text-base ${match.homeTeam.includes("Poggenhagen") ? "text-primary" : "text-foreground"}`}
                          >
                            {match.homeTeam}
                          </span>
                          <span
                            className={`font-display text-2xl font-bold tabular-nums ${match.cancelled ? "text-muted-foreground" : resultScoreTextClass(label)}`}
                          >
                            {match.cancelled ? (
                              <span className="font-body text-lg">Ausfall</span>
                            ) : (
                              <>
                                {match.result!.home} : {match.result!.away}
                              </>
                            )}
                          </span>
                          <span
                            className={`font-body font-medium text-base ${match.awayTeam.includes("Poggenhagen") ? "text-primary" : "text-foreground"}`}
                          >
                            {match.awayTeam}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:block text-right whitespace-nowrap shrink-0">
                        {new Date(match.date).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        · {match.venue}
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
