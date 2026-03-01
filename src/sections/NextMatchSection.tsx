"use client";

import { siteConfig } from "@/config/site";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import FussballWidget from "@/components/FussballWidget";

export default function NextMatchSection() {
  // Wenn fussball.de Widget URL vorhanden, zeige Widget
  if (siteConfig.fussballWidgets.nextMatch) {
    return (
      <section id="naechstes-spiel" className="py-20 md:py-28 section-gradient">
        <div className="container">
          <ScrollReveal>
            <SectionHeading title="Nächstes Spiel" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <FussballWidget 
              src={siteConfig.fussballWidgets.nextMatch}
              title="Nächstes Spiel"
              minHeight={{ mobile: 400, desktop: 500 }}
            />
          </ScrollReveal>
        </div>
      </section>
    );
  }

  // Fallback: Placeholder
  return (
    <section id="naechstes-spiel" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <ScrollReveal>
          <SectionHeading title="Nächstes Spiel" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="card-surface p-8 text-center">
            <p className="text-muted-foreground">
              Nächstes Spiel Widget wird geladen...
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
