# TSV Poggenhagen, 1. Herren

Öffentliche Vereinsseite für die erste Herrenmannschaft: Spielplan, Tabelle, Ergebnisse, Kader und Anfahrt.

Live: [https://poggenhagen.vercel.app](https://poggenhagen.vercel.app)

## Was das Projekt ist

Eine Next.js Anwendung, die alles Wichtige zur Mannschaft auf einer Seite bündelt, statt Nutzer über mehrere Portale zu schicken. Visuell angelehnt an den Verein: dunkles Layout, Vereinsgelb, klare Typografie.

## Wie die Daten ankommen

Beim Rendern auf dem Server wird ein gebündelter Datensatz geladen und zwischengespeichert (Next.js Cache mit Revalidate und Tags, damit Cron oder manuelles Revalidieren die fussball.de Daten auffrischen kann, ohne bei jedem Seitenaufruf die Quelle zu fluten).

Die öffentlichen Mannschaftsseiten auf fussball.de liefern Tabelle und Spielplan als HTML. Daraus werden im Code strukturierte Listen für die Tabelle und die Termine extrahiert. Zusätzlich wird das zuletzt ausgetragene Pflichtspiel aus dem Markup gelesen und mit einem lokalen Archiv zusammengeführt: fussball.de zeigt typischerweise nur das neueste Ergebnis prominent, ältere und Freundschaftsspiele bleiben deshalb als statische Ergänzung in der Codebasis, damit die Ergebnisliste vollständig wirkt.

Kaderbilder liegen im Projekt als Dateien; Namen und Positionen werden über eine kleine Zuordnung im Code zusammengeführt. Instagram Einträge können als strukturierte JSON Daten gepflegt werden, ohne dass die Seite dafür die Instagram API braucht.

## Technik und Betrieb

Stack: Next.js 15 mit App Router, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui. Hosting auf Vercel inklusive Analytics und Speed Insights.

Die Seite ist als installierbare Web App ausgelegt (Manifest, eigenes Icon aus dem Vereinswappen, Hinweis auf dem Smartphone zum Ablegen auf dem Home-Bildschirm, wo der Browser das unterstützt). Sicherheitsheader und Content Security Policy sind für die Produktion in der Next Konfiguration hinterlegt.

## Nutzung

Private Vereinswebsite. Inhalte und Kennzeichen des TSV Poggenhagen bleiben beim Verein.
