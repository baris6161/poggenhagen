# TSV Poggenhagen, 1. Herren

Öffentliche Vereinsseite für die erste Herrenmannschaft: Spielplan, Tabelle, Ergebnisse, Kader und Anfahrt. Live betriebene Seite:

[https://poggenhagen.vercel.app](https://poggenhagen.vercel.app)

## Was hier steckt

Die Seite bündelt alles, was Fans und Interessierte zur Mannschaft brauchen, ohne dass sich jemand durch mehrere Portale hangeln muss. Inhalt und Look sind auf den TSV zugeschnitten (dunkles Layout, Vereinsgelb, klare Typo).

Auf dem Server holen wir bei jedem Seitenaufbau (mit Cache) Daten von fussball.de: Kreisliga-Tabelle, Spielplan und das zuletzt ausgetragene Pflichtspiel. Daraus werden „Nächste Spiele“ und das oberste Ergebnis gebaut. Ältere und Freundschaftsspiele liegen als Archiv in `src/data/matches.ts`, damit die Liste vollständig bleibt, auch wenn fussball.de nur ein letztes Spiel liefert.

Spieler kommen aus Bildern unter `public/bilder/` plus Positionszuordnung in `src/data/playerMeta.ts`. Instagram kann über `src/data/instagram.json` gepflegt werden.

## Technik

Stack: **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**, **Framer Motion**, **shadcn/ui**. Deployment auf **Vercel** mit Analytics und Speed Insights.

Die Seite ist als PWA ausgelegt: Web App Manifest, eigenes Startverhalten, Vereinswappen als Icon (`public/wappen.png`, daraus generierte `src/app/icon.svg` und `src/app/apple-icon.svg` per `npm run prebuild`). Auf dem Handy blenden wir einen Hinweis ein, die Seite zum Home-Bildschirm zu legen (iOS: Kurzanleitung in Safari, Android: Install-Prompt des Browsers, wo der Browser das unterstützt).

## Lokal starten

```bash
npm install
npm run dev
```

Vor dem Production-Build werden die Icons aus dem Wappen erzeugt (`prebuild`). Anschließend:

```bash
npm run build
npm start
```

## Konfiguration

Canonical URL und Social-Vorschau: `src/config/site.ts` (`getCanonicalSiteUrl`, optional `NEXT_PUBLIC_SITE_URL` auf der eigenen Domain). Tabelle: entweder eingebettetes fussball.de Widget oder JSON-Modus, ebenfalls in `siteConfig`.

Keine Secrets mit `NEXT_PUBLIC_*` ausliefern. Sicherheitsheader und CSP stehen in `next.config.js`.

## Lizenz / Nutzung

Private Vereinswebsite; Inhalte und Marken des TSV Poggenhagen bleiben beim Verein.
