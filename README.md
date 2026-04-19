# TSV Poggenhagen, 1. Herren

Öffentliche Vereinsseite für die erste Herrenmannschaft: Spielplan, Tabelle, Ergebnisse, Kader und Anfahrt.

**Live:** [https://tsv-poggenhagen-erste.de/](https://tsv-poggenhagen-erste.de/)

(Vorschau ohne gesetzte Domain nutzt weiterhin `VERCEL_URL` bzw. den Fallback in `getCanonicalSiteUrl()` in [src/config/site.ts](src/config/site.ts).)

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

Der **Torstand** des zuletzt gespielten Pflichtspiels kommt primär von der **Spielseite** (wenn noch vorhanden: JSON in `data-match-events`; sonst Glyphen im `div.result`). Fehlt dort alles Verwertbare, wird der Stand aus dem **Mannschafts-Slider** (`div.match-score`, Webfont-Glyphen mit bekanntem Zeichen-Mapping) als Fallback genutzt — siehe `src/lib/fussball/obfuscated-score-glyphs.ts` (Mapping bei neuen Glyphen ggf. erweitern).

Optional kann `FUSSBALL_TEAM_URL` gesetzt werden; erlaubt sind nur **HTTPS-URLs** mit Hostname **fussball.de** bzw. **www.fussball.de** (andere Werte werden verworfen, es gilt die Standard-Mannschafts-URL im Code).

Kaderbilder liegen im Projekt als Dateien; Namen und Positionen werden über eine kleine Zuordnung im Code zusammengeführt. Instagram Einträge können als strukturierte JSON Daten gepflegt werden, ohne dass die Seite dafür die Instagram API braucht.

## Technik und Betrieb

Stack: Next.js 15 mit App Router, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui. Hosting auf Vercel inklusive Analytics und Speed Insights. Routen und Layout liegen unter `src/app`, gemeinsame UI und Logik unter `src/components` und `src/lib`.

### Umgebungsvariablen (Auszug)

Siehe [.env.example](.env.example). Wichtig für die Live-Domain:

- `NEXT_PUBLIC_SITE_URL` = `https://tsv-poggenhagen-erste.de` (ohne Schrägstrich am Ende), damit Canonical-URL, Open Graph und Sitemap zur echten Domain passen.
- `CRON_SECRET` für die geschützten Endpunkte `/api/cron/revalidate-fussball` und `/api/admin/verify-discord-webhook` (jeweils `Authorization: Bearer …`). Token kryptografisch stark wählen.
- Optional: `DISCORD_ADMIN_WEBHOOK_URL` — siehe Abschnitt **Discord-Adminlogs** unten.

### Discord-Adminlogs (optional, Betrieb)

Wenn `DISCORD_ADMIN_WEBHOOK_URL` in Vercel oder `.env.local` gesetzt ist (nur Server, **niemals** committen), postet die Anwendung Statusmeldungen in einen Discord-Kanal — nützlich für Monitoring und Git-Release-Notes („was ist neu am Betrieb“):

| Ereignis | Inhalt (kurz) |
|----------|----------------|
| Bundle neu von fussball.de | Embed: Quelle, `NODE_ENV`, Anzahl Fixtures / Tabellenzeilen, HTTP-Status und Größe der Mannschafts-HTML, ob „Letztes Spiel“-Link und Spielseiten-Tore geparst wurden, ob Torstand aus **Team-Slider-Glyphen** (Fallback) kam, Match-ID-Suffix, Live-Torstand falls vorhanden, berechnetes **Nächstes Spiel**, Anzahl upcoming / merged Ergebnisse |
| `DISABLE_FUSSBALL_SYNC=1` | Hinweis „Static“, Kurzinfo zu nächstem Spiel und Archiv |
| Live-Fetch oder Parse fehlgeschlagen | Fehler + Cause, Fallback-„Nächstes Spiel“ (static) |
| Cron `GET /api/cron/revalidate-fussball` (nach Auth) | Kurzmeldung: Cache-Tag `pogge-fussball` invalidiert |
| Manuell `GET /api/admin/verify-discord-webhook` (nach Auth, gleicher Bearer wie Cron) | Kurzes Embed **„Pogge: Webhook-Verbindung OK“** — prüft Discord **ohne** Fussball-Bundle; HTTP **200** + JSON bei Erfolg, **503** wenn keine Webhook-URL gesetzt, **502** wenn Discord ablehnt |

**Webhook gezielt testen** (nach Setzen von `DISCORD_ADMIN_WEBHOOK_URL` in Vercel, nach Deploy):

```bash
curl -sS -H "Authorization: Bearer DEIN_CRON_SECRET" "https://tsv-poggenhagen-erste.de/api/admin/verify-discord-webhook"
```

Erwartung: JSON `{"ok":true,"discordStatus":204,...}` (oder 200) und im Kanal eine grüne Test-Nachricht mit Zeitstempel.

Es gibt **kein** Discord-Posting bei reinem **Cache-Hit** ohne Revalidate (vermeidet Spam pro Seitenaufruf). Bei versehentlich veröffentlichter Webhook-URL den Webhook in Discord **löschen und neu anlegen**.

### Performance (Build-Referenz)

Nach Änderungen am Bundle: `npm run perf:baseline` (führt `next build` aus und zeigt u. a. First Load JS pro Route).

### Unit-Tests (optional)

`npm run test:unit` — prüft u. a. den fussball.de-Glyphen-Torstand-Parser (`obfuscated-score-glyphs`).

### Web App und Home-Bildschirm

Die Seite ist als **installierbare Web App** ausgelegt: Web App Manifest, Anzeigename und Icon aus dem Vereinswappen, daraus im Build erzeugte Favicon-Assets. Auf **schmalen Viewports** erscheint ein Hinweisbanner, die Vereinsseite auf den **Home-Bildschirm** zu legen. Dazu öffnet sich eine **Kurzanleitung** (iPhone: Menü, Teilen, Zum Home-Bildschirm, ggf. Als Web-App öffnen; Android: Installieren oder Eintrag im Browsermenü), der Hilfedialog sitzt **oben** am Bildschirm, damit man die Schritte beim Mitmachen im Blick behält. Wo Chrome den installierbaren PWA-Flow anbietet, kann direkt installiert werden.

### Aktuelle Daten in der Web-App

Wird die Seite **als Web-App vom Home-Bildschirm** gestartet (Standalone-Modus), löst der Client **in Intervallen** und **wenn die App wieder sichtbar wird** eine sanfte Aktualisierung der Server-Komponenten aus (`router.refresh()` in Next.js). Parallel dazu ist der **Server-Cache** für den Fussball-Datensatz auf etwa **15 Minuten** gestellt. So bleiben Spielplan, Tabelle und Ergebnisse mit vertretbarem Aufwand für die Quelle aktuell, **ohne** die App jedes Mal neu zu öffnen.

Sicherheitsheader und Content Security Policy sind für die Produktion in der Next Konfiguration hinterlegt.

## Nutzung

Private Vereinswebsite. Inhalte und Kennzeichen des TSV Poggenhagen bleiben beim Verein.
