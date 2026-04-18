# TSV Poggenhagen, 1. Herren

Öffentliche Vereinsseite für die erste Herrenmannschaft: Spielplan, Tabelle, Ergebnisse, Kader und Anfahrt.

Live: [https://poggenhagen-puce.vercel.app](https://poggenhagen-puce.vercel.app)

## Was das Projekt ist

Eine Next.js Anwendung, die alles Wichtige zur Mannschaft auf einer Seite bündelt, statt Nutzer über mehrere Portale zu schicken. Visuell angelehnt an den Verein: dunkles Layout, Vereinsgelb, klare Typografie.

## Responsive und mobile Nutzung

Das Layout ist für **Desktop und Mobilgeräte** ausgelegt: gleiche Inhalte, angepasste Raster und Karten, Lesbarkeit auf schmalen Viewports und ruhige Tabellen mit horizontalem Scroll nur wo nötig. In der Praxis wird die Seite **häufig auf dem Handy** genutzt, deshalb liegen Interaktionen, Typo und Abstände dort besonders im Fokus.

Im Bereich **Nächstes Spiel** (Anker im Hero und in der Navigation) sieht man das kommende Pflichtspiel mit Datum, Uhrzeit und Ort. Darüber hinaus gibt es zwei direkte Aktionen: **Route** öffnet eine passende Kartenführung (Sportplatz Poggenhagen bei Heimspielen, Kartensuche nach Gegnerort bei Auswärts), **In Kalender** erzeugt eine **ICS-Datei** zum Herunterladen, die sich in gängige Kalender-Apps importieren lässt.

## Darstellung

Spielplan und Tabelle nutzen dieselbe Kartenoptik (`card-surface`). Im Spielplan sind Datum und Uhrzeit getrennte Spalten, die Begegnung bleibt auch bei langen Vereinsnamen lesbar. Bei den Ergebnissen markieren Farben und Layout auf dem Smartphone schnell Sieg, Niederlage oder Unentschieden, inklusive rotem Torstand bei einer Niederlage.

## Wie die Daten ankommen

Beim Rendern auf dem Server wird ein gebündelter Datensatz geladen und zwischengespeichert (Next.js Cache mit Revalidate und Tags, damit Cron oder manuelles Revalidieren die fussball.de Daten auffrischen kann, ohne bei jedem Seitenaufruf die Quelle zu fluten).

Die öffentlichen Mannschaftsseiten auf fussball.de liefern Tabelle und Spielplan als HTML. Daraus werden im Code strukturierte Listen für die Tabelle und die Termine extrahiert. Zusätzlich wird das zuletzt ausgetragene Pflichtspiel aus dem Markup gelesen und mit einem lokalen Archiv zusammengeführt: fussball.de zeigt typischerweise nur das neueste Ergebnis prominent, ältere und Freundschaftsspiele bleiben deshalb als statische Ergänzung in der Codebasis, damit die Ergebnisliste vollständig wirkt.

Kaderbilder liegen im Projekt als Dateien; Namen und Positionen werden über eine kleine Zuordnung im Code zusammengeführt. Instagram Einträge können als strukturierte JSON Daten gepflegt werden, ohne dass die Seite dafür die Instagram API braucht.

## Technik und Betrieb

Stack: Next.js 15 mit App Router, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui. Hosting auf Vercel inklusive Analytics und Speed Insights. Routen und Layout liegen unter `src/app`, gemeinsame UI und Logik unter `src/components` und `src/lib`.

### Web App und Home-Bildschirm

Die Seite ist als **installierbare Web App** ausgelegt: Web App Manifest, Anzeigename und Icon aus dem Vereinswappen, daraus im Build erzeugte Favicon-Assets. Auf **schmalen Viewports** erscheint ein Hinweisbanner, die Vereinsseite auf den **Home-Bildschirm** zu legen. Dazu öffnet sich eine **Kurzanleitung** (iPhone: Menü, Teilen, Zum Home-Bildschirm, ggf. Als Web-App öffnen; Android: Installieren oder Eintrag im Browsermenü), der Hilfedialog sitzt **oben** am Bildschirm, damit man die Schritte beim Mitmachen im Blick behält. Wo Chrome den installierbaren PWA-Flow anbietet, kann direkt installiert werden.

### Aktuelle Daten in der Web-App

Wird die Seite **als Web-App vom Home-Bildschirm** gestartet (Standalone-Modus), löst der Client **in Intervallen** und **wenn die App wieder sichtbar wird** eine sanfte Aktualisierung der Server-Komponenten aus (`router.refresh()` in Next.js). Parallel dazu ist der **Server-Cache** für den Fussball-Datensatz auf etwa **15 Minuten** gestellt. So bleiben Spielplan, Tabelle und Ergebnisse mit vertretbarem Aufwand für die Quelle aktuell, **ohne** die App jedes Mal neu zu öffnen.

Sicherheitsheader und Content Security Policy sind für die Produktion in der Next Konfiguration hinterlegt.

## Nutzung

Private Vereinswebsite. Inhalte und Kennzeichen des TSV Poggenhagen bleiben beim Verein.
