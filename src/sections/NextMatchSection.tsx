"use client";

import { useState, useEffect } from "react";
import { getNextMatch, getMapsUrl } from "@/data/matches";
import { Calendar, MapPin, Clock, Download, Navigation } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

function generateICS(match: ReturnType<typeof getNextMatch>) {
  if (typeof window === "undefined") return;
  const dateStr = match.date.replace(/-/g, "");
  const [h, m] = match.time.split(":");
  const start = `${dateStr}T${h}${m}00`;
  const endH = String(Number(h) + 2).padStart(2, "0");
  const end = `${dateStr}T${endH}${m}00`;
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${match.homeTeam} vs ${match.awayTeam}
LOCATION:${match.venue}
END:VEVENT
END:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "spiel.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function useCountdown(targetDate: string, targetTime: string) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = new Date(`${targetDate}T${targetTime}:00`);
    const tick = () => {
      const now = new Date();
      const ms = target.getTime() - now.getTime();
      if (ms <= 0) { setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setDiff({
        days: Math.floor(ms / 86400000),
        hours: Math.floor((ms % 86400000) / 3600000),
        minutes: Math.floor((ms % 3600000) / 60000),
        seconds: Math.floor((ms % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate, targetTime]);
  return diff;
}

export default function NextMatchSection() {
  const match = getNextMatch();
  const countdown = useCountdown(match.date, match.time);
  const mapsUrl = getMapsUrl(match);
  const dateFormatted = new Date(match.date).toLocaleDateString("de-DE", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <section id="naechstes-spiel" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <ScrollReveal>
          <SectionHeading title="Nächstes Spiel" subtitle={`Spieltag ${match.matchday}`} />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="card-surface neon-border-glow p-6 md:p-10 max-w-3xl mx-auto">
            {/* Teams */}
            <div className="flex items-center justify-between gap-4 text-center">
              <div className="flex-1">
                <p className="font-display text-3xl md:text-5xl font-bold text-foreground">
                  {match.homeTeam.includes("Poggenhagen") ? "TSV" : match.homeTeam.split(" ").pop()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{match.homeTeam}</p>
              </div>
              <div className="font-display text-4xl md:text-6xl font-bold text-primary">VS</div>
              <div className="flex-1">
                <p className="font-display text-3xl md:text-5xl font-bold text-foreground">
                  {match.awayTeam.includes("Poggenhagen") ? "TSV" : match.awayTeam.split(" ").pop()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{match.awayTeam}</p>
              </div>
            </div>

            {/* Info */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />{dateFormatted}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />{match.time} Uhr</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{match.venue}</span>
              <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {match.isHome ? "HEIM" : "AUSWÄRTS"}
              </span>
            </div>

            {/* Countdown */}
            <div className="mt-8 grid grid-cols-4 gap-3 max-w-sm mx-auto">
              {(["days", "hours", "minutes", "seconds"] as const).map((key) => (
                <div key={key} className="text-center">
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary">
                    {String(countdown[key]).padStart(2, "0")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {{ days: "Tage", hours: "Std", minutes: "Min", seconds: "Sek" }[key]}
                  </p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => generateICS(match)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-lg neon-glow hover:scale-105 transition-transform text-sm"
              >
                <Download className="w-4 h-4" />
                In Kalender
              </button>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-body font-semibold rounded-lg hover:border-primary/50 transition-all text-sm"
              >
                <Navigation className="w-4 h-4" />
                Route
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
