# TSV Poggenhagen, 1. Herren

Öffentliche Vereinsseite für die erste Herrenmannschaft: Spielplan, Tabelle, Ergebnisse, Kader und Anfahrt.

Live: [https://poggenhagen.vercel.app](https://poggenhagen.vercel.app)

## Was das Projekt ist

Eine Next.js Anwendung, die alles Wichtige zur Mannschaft auf einer Seite bündelt, statt Nutzer über mehrere Portale zu schicken. Visuell angelehnt an den Verein: dunkles Layout, Vereinsgelb, klare Typografie.

## Darstellung

Spielplan und Tabelle nutzen dieselbe Kartenoptik (`card-surface`). Im Spielplan sind Datum und Uhrzeit getrennte Spalten, die Begegnung bleibt auch bei langen Vereinsnamen lesbar. Bei den Ergebnissen markieren Farben und Layout auf dem Smartphone schnell Sieg, Niederlage oder Unentschieden, inklusive rotem Torstand bei einer Niederlage.

## Wie die Daten ankommen

Beim Rendern auf dem Server wird ein gebündelter Datensatz geladen und zwischengespeichert (Next.js Cache mit Revalidate und Tags, damit Cron oder manuelles Revalidieren die fussball.de Daten auffrischen kann, ohne bei jedem Seitenaufruf die Quelle zu fluten).

Die öffentlichen Mannschaftsseiten auf fussball.de liefern Tabelle und Spielplan als HTML. Daraus werden im Code strukturierte Listen für die Tabelle und die Termine extrahiert. Zusätzlich wird das zuletzt ausgetragene Pflichtspiel aus dem Markup gelesen und mit einem lokalen Archiv zusammengeführt: fussball.de zeigt typischerweise nur das neueste Ergebnis prominent, ältere und Freundschaftsspiele bleiben deshalb als statische Ergänzung in der Codebasis, damit die Ergebnisliste vollständig wirkt.

Kaderbilder liegen im Projekt als Dateien; Namen und Positionen werden über eine kleine Zuordnung im Code zusammengeführt. Instagram Einträge können als strukturierte JSON Daten gepflegt werden, ohne dass die Seite dafür die Instagram API braucht.

## Technik und Betrieb

Stack: Next.js 15 mit App Router, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui. Hosting auf Vercel inklusive Analytics und Speed Insights. Routen und Layout liegen unter `src/app`, gemeinsame UI und Logik unter `src/components` und `src/lib`.

Die Seite ist als installierbare Web App ausgelegt: Web App Manifest, Anzeigename und Icon aus dem Vereinswappen, daraus im Build erzeugte Favicon-Assets. Auf schmalen Viewports erscheint ein Hinweisbanner zum Ablegen auf den Home-Bildschirm; die Schritt-für-Schritt-Anleitung öffnet sich in einem Dialog, der oben am Viewport andockt, damit Nutzer die Schritte parallel zum Mitmachen im Blick behalten. Wo Chrome den installierbaren PWA-Flow anbietet, kann direkt installiert werden. Wird die Seite als Web-App vom Home-Bildschirm gestartet, löst der Client in Intervallen und beim Zurückkehren in die App eine sanfte Aktualisierung der Server-Komponenten aus (Next.js `router.refresh()`). Der Server-Cache für den Fussball-Datensatz ist auf etwa 15 Minuten gestellt, damit Spielplan und Tabelle nachziehen, ohne die App zu schließen und ohne die Quelle zu häufig anzusprechen.

Sicherheitsheader und Content Security Policy sind für die Produktion in der Next Konfiguration hinterlegt.

## Nutzung

Private Vereinswebsite. Inhalte und Kennzeichen des TSV Poggenhagen bleiben beim Verein.
