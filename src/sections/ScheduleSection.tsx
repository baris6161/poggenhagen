"use client";

import { getNextFixtures, type Match } from "@/data/matches";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import SectionBackground from "@/components/SectionBackground";
import { Calendar, Clock, MapPin } from "lucide-react";

type Props = {
  /** Wenn gesetzt (z. B. von FUSSBALL.DE), werden diese Zeilen statt lokaler Daten genutzt. */
  upcomingFixtures?: Match[];
};

/** `YYYY-MM-DD` → Anzeige wie 19.04.2026 (lokal, mittags um TZ-Sprünge zu vermeiden). */
function formatFixtureDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatFixtureTime(time: string | undefined): string {
  if (!time || time.trim() === "") return "–";
  return time.replace(/\s*Uhr\s*$/i, "").trim();
}

function Matchup({ homeTeam, awayTeam }: { homeTeam: string; awayTeam: string }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0">
      <span className={`font-medium ${homeTeam.includes("Poggenhagen") ? "text-primary" : "text-foreground"}`}>
        {homeTeam}
      </span>
      <span className="text-muted-foreground shrink-0">vs</span>
      <span className={`font-medium ${awayTeam.includes("Poggenhagen") ? "text-primary" : "text-foreground"}`}>
        {awayTeam}
      </span>
    </span>
  );
}

export default function ScheduleSection({ upcomingFixtures: upcomingProp }: Props) {
  const upcomingFixtures = upcomingProp ?? getNextFixtures(5);

  return (
    <section id="spielplan" className="relative py-20 md:py-28 overflow-hidden">
      <SectionBackground variant={4} />
      <div className="container relative z-10">
        <ScrollReveal>
          <SectionHeading title="Spielplan" subtitle="Kommende Spiele" />
        </ScrollReveal>

        {/* Desktop Table */}
        <ScrollReveal delay={0.1}>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm">
                  <th className="pb-3 font-medium pr-3 whitespace-nowrap">Datum</th>
                  <th className="pb-3 font-medium pr-3 whitespace-nowrap">Uhrzeit</th>
                  <th className="pb-3 font-medium pr-3 min-w-[12rem]">Begegnung</th>
                  <th className="pb-3 font-medium pr-3">Ort</th>
                  <th className="pb-3 font-medium text-right whitespace-nowrap w-12">H/A</th>
                </tr>
              </thead>
              <tbody>
                {upcomingFixtures.map((m) => (
                  <tr key={m.id} className="border-b border-border/30 hover:bg-card/50 transition-colors">
                    <td className="py-4 text-foreground text-sm whitespace-nowrap pr-3 align-top">
                      {m.isFree ? (
                        <span className="text-muted-foreground">–</span>
                      ) : (
                        formatFixtureDate(m.date)
                      )}
                    </td>
                    <td className="py-4 text-foreground text-sm whitespace-nowrap pr-3 align-top tabular-nums">
                      {m.isFree ? <span className="text-muted-foreground">–</span> : formatFixtureTime(m.time)}
                    </td>
                    <td className="py-4 pr-3 align-top min-w-0">
                      {m.isFree ? (
                        <span className="text-muted-foreground italic">Spielfrei</span>
                      ) : (
                        <Matchup homeTeam={m.homeTeam} awayTeam={m.awayTeam} />
                      )}
                    </td>
                    <td className="py-4 text-sm text-muted-foreground align-top pr-3">{m.venue}</td>
                    <td className="py-4 text-right align-top whitespace-nowrap">
                      {m.isFree ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">FREI</span>
                      ) : (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${m.isHome ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}
                        >
                          {m.isHome ? "H" : "A"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        {/* Mobile Cards */}
        <div className="md:hidden grid gap-4">
          {upcomingFixtures.map((m, i) => {
            const timeLabel = formatFixtureTime(m.time);
            const timeWithUnit = timeLabel === "–" ? timeLabel : `${timeLabel} Uhr`;
            return (
              <ScrollReveal key={m.id} delay={i * 0.08}>
                <div className="card-surface p-4">
                  <div className="flex justify-end items-start mb-2">
                    {m.isFree ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        SPIELFREI
                      </span>
                    ) : (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${m.isHome ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}
                      >
                        {m.isHome ? "HEIM" : "AUSWÄRTS"}
                      </span>
                    )}
                  </div>
                  {m.isFree ? (
                    <p className="font-display text-xl font-bold text-muted-foreground italic">Spielfrei</p>
                  ) : (
                    <p className="font-display text-lg sm:text-xl font-bold text-foreground leading-snug">
                      <Matchup homeTeam={m.homeTeam} awayTeam={m.awayTeam} />
                    </p>
                  )}
                  {!m.isFree && (
                    <div className="flex flex-col gap-2 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden />
                        <span>{formatFixtureDate(m.date)}</span>
                      </span>
                      <span className="flex items-center gap-2 tabular-nums">
                        <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden />
                        <span>{timeWithUnit}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
                        <span>{m.venue}</span>
                      </span>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
