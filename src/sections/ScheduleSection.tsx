import { siteConfig } from "@/config/site";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import FussballWidget from "@/components/FussballWidget";

export default function ScheduleSection() {
  // Wenn fussball.de Widget URL vorhanden, zeige Widget
  if (siteConfig.fussballWidgets.fixtures) {
    return (
      <section id="spielplan" className="py-20 md:py-28 section-gradient">
        <div className="container">
          <ScrollReveal>
            <SectionHeading title="Spielplan" subtitle="Kommende Spiele" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <FussballWidget 
              src={siteConfig.fussballWidgets.fixtures}
              title="Spielplan"
              minHeight={{ mobile: 600, desktop: 800 }}
            />
          </ScrollReveal>
        </div>
      </section>
    );
  }

  // Fallback: Placeholder mit Hinweis
  return (
    <section id="spielplan" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <ScrollReveal>
          <SectionHeading title="Spielplan" subtitle="Kommende Spiele" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="card-surface p-8 text-center">
            <p className="text-muted-foreground">
              Spielplan Widget wird geladen...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Bitte füge die fussball.de Widget URL in <code className="text-primary">src/config/site.ts</code> ein.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
