import { fixtures } from "@/data/matches";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { Calendar, MapPin } from "lucide-react";

export default function ScheduleSection() {
  return (
    <section id="spielplan" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <ScrollReveal>
          <SectionHeading title="Spielplan" subtitle="Kommende Spiele" />
        </ScrollReveal>

        {/* Desktop Table */}
        <ScrollReveal delay={0.1}>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm">
                  <th className="pb-3 font-medium">Spieltag</th>
                  <th className="pb-3 font-medium">Datum</th>
                  <th className="pb-3 font-medium">Begegnung</th>
                  <th className="pb-3 font-medium">Ort</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {fixtures.map((m) => (
                  <tr key={m.id} className="border-b border-border/30 hover:bg-card/50 transition-colors">
                    <td className="py-4 text-muted-foreground text-sm">{m.matchday}</td>
                    <td className="py-4 text-foreground text-sm">
                      {new Date(m.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })} · {m.time}
                    </td>
                    <td className="py-4">
                      <span className={`font-medium ${m.homeTeam.includes("Poggenhagen") ? "text-primary" : "text-foreground"}`}>
                        {m.homeTeam}
                      </span>
                      <span className="text-muted-foreground mx-2">vs</span>
                      <span className={`font-medium ${m.awayTeam.includes("Poggenhagen") ? "text-primary" : "text-foreground"}`}>
                        {m.awayTeam}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{m.venue}</td>
                    <td className="py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${m.isHome ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                        {m.isHome ? "H" : "A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        {/* Mobile Cards */}
        <div className="md:hidden grid gap-4">
          {fixtures.map((m, i) => (
            <ScrollReveal key={m.id} delay={i * 0.08}>
              <div className="card-surface p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-muted-foreground">Spieltag {m.matchday}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${m.isHome ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {m.isHome ? "HEIM" : "AUSWÄRTS"}
                  </span>
                </div>
                <p className="font-display text-xl font-bold text-foreground">
                  {m.homeTeam} <span className="text-primary">vs</span> {m.awayTeam}
                </p>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(m.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })} · {m.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.venue}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
