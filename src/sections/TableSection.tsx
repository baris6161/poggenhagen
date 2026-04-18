"use client";

import { tableData as staticTableData, type TableEntry } from "@/data/matches";
import { siteConfig } from "@/config/site";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import SectionBackground from "@/components/SectionBackground";

type Props = { tableData?: TableEntry[] };

export default function TableSection({ tableData: tableProp }: Props) {
  const tableData = tableProp ?? staticTableData;
  return (
    <section id="tabelle" className="relative py-20 md:py-28 overflow-hidden">
      <SectionBackground variant={6} />
      <div className="container relative z-10">
        <ScrollReveal>
          <SectionHeading title="Tabelle" subtitle={siteConfig.league} />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="card-surface overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="p-3 md:p-4 font-medium w-10">#</th>
                  <th className="p-3 md:p-4 font-medium">Verein</th>
                  <th className="p-3 md:p-4 font-medium text-center">Sp</th>
                  <th className="p-3 md:p-4 font-medium text-center hidden sm:table-cell">S</th>
                  <th className="p-3 md:p-4 font-medium text-center hidden sm:table-cell">U</th>
                  <th className="p-3 md:p-4 font-medium text-center hidden sm:table-cell">N</th>
                  <th className="p-3 md:p-4 font-medium text-center">Tore</th>
                  <th className="p-3 md:p-4 font-medium text-center hidden sm:table-cell">Diff</th>
                  <th className="p-3 md:p-4 font-medium text-center">Pkt</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => {
                  const isUs = row.team.includes("Poggenhagen");
                  return (
                    <tr
                      key={`${row.rank}-${row.team}`}
                      className={`border-b border-border/20 transition-colors hover:bg-card/80 ${isUs ? "bg-primary/5" : ""}`}
                    >
                      <td className="p-3 md:p-4 font-display text-lg font-bold text-muted-foreground">{row.rank}</td>
                      <td className={`p-3 md:p-4 font-medium ${isUs ? "text-primary" : "text-foreground"}`}>{row.team}</td>
                      <td className="p-3 md:p-4 text-center text-muted-foreground">{row.played}</td>
                      <td className="p-3 md:p-4 text-center text-muted-foreground hidden sm:table-cell">{row.won}</td>
                      <td className="p-3 md:p-4 text-center text-muted-foreground hidden sm:table-cell">{row.drawn}</td>
                      <td className="p-3 md:p-4 text-center text-muted-foreground hidden sm:table-cell">{row.lost}</td>
                      <td className="p-3 md:p-4 text-center text-muted-foreground">{row.goalsFor}:{row.goalsAgainst}</td>
                      <td className="p-3 md:p-4 text-center text-muted-foreground hidden sm:table-cell">
                        {row.goalDiff > 0 ? "+" : ""}{row.goalDiff}
                      </td>
                      <td className={`p-3 md:p-4 text-center font-display text-lg font-bold ${isUs ? "text-primary" : "text-foreground"}`}>
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
