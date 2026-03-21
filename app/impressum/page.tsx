import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum des TSV Poggenhagen von 1946 e. V.",
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container py-24 md:py-28">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Impressum</h1>
        <p className="text-muted-foreground mt-3">Angaben gemaess Paragraph 5 TMG</p>

        <div className="mt-10 grid gap-6">
          <div className="card-surface p-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Herausgeber</h2>
            <div className="mt-3 text-sm md:text-base text-muted-foreground space-y-1">
              <p>Turn- und Sportverein Poggenhagen von 1946 e. V.</p>
              <p>Mecklenburger Strasse 2</p>
              <p>31535 Neustadt am Ruebenberge</p>
              <p>E-Mail: info@tsv-poggenhagen1946.de</p>
              <p>Telefon: 05032 / 65323</p>
              <p>Steuernummer: 34/215/00497 (FA Nienburg)</p>
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Haftung fuer Inhalte</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              Die Inhalte dieser Website wurden mit grosser Sorgfalt erstellt. Fuer die Richtigkeit, Vollstaendigkeit und
              Aktualitaet der Inhalte uebernehmen wir jedoch keine Gewaehr.
            </p>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Haftung fuer Links</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              Diese Website enthaelt Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb koennen wir fuer diese fremden Inhalte keine Gewaehr uebernehmen. Fuer die Inhalte der verlinkten
              Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
            </p>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Urheberrecht</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
              Urheberrecht. Die Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der
              Grenzen des Urheberrechts beduerfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
