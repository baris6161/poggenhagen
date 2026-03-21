# TSV Poggenhagen - 1. Herren

Offizielle Website der 1. Herren des TSV Poggenhagen.

## Technologien

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (Animationen)
- **shadcn/ui** (UI Components)

## Sicherheit (Kurz)

- Keine Secrets mit `NEXT_PUBLIC_*` ausliefern; API-Keys nur in `.env.local` (nicht versioniert).
- Nach `npm install` regelmäßig `npm audit` / `npm audit fix` ausführen (Transitive Pakete).
- Produktion: Security-Header & CSP in `next.config.js`; `console.log` wird per Build entfernt (außer `error`/`warn`).

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten (erzeugt zuvor Favicon aus public/TSV-Poggenhagen.webp)
npm run dev

# Production Build
npm run build
npm start
```

## Spieler hinzufügen

Spieler werden automatisch aus Bildern in `/public/bilder/` generiert.

### Schritte:

1. **Bild hochladen**
   - Dateiname: `Vorname-Nachname.jpg` (oder `.png`, `.webp`, `.jpeg`)
   - Beispiel: `Jannik-Brosch.jpg`
   - Unterstützte Formate: `.jpg`, `.jpeg`, `.png`, `.webp`

2. **Position definieren**
   - Öffne `/src/data/playerMeta.ts`
   - Füge den Spieler hinzu:
     ```typescript
     "Jannik Brosch": "Tor",
     ```
   - Verfügbare Positionen: `"Tor"`, `"Abwehr"`, `"Mittelfeld"`, `"Sturm"`

3. **Wichtig**
   - Nur Spieler mit **Bild UND Position-Mapping** werden angezeigt
   - Dateiname muss exakt dem Namen in `playerMeta.ts` entsprechen (mit Leerzeichen statt Bindestrichen)

## Konfiguration

### Fussball.de iFrame

In `/src/config/site.ts`:

```typescript
tableMode: "iframe",
tableIframeUrl: "https://www.fussball.de/...",
```

### Instagram Feed

Posts in `/src/data/instagram.json` eintragen:

```json
[
  {
    "id": "1",
    "imageUrl": "/instagram/post1.jpg",
    "permalink": "https://instagram.com/p/xyz",
    "caption": "Derbysieg! 🔥",
    "timestampISO": "2026-01-15T18:30:00Z"
  }
]
```

Bilder in `/public/instagram/` ablegen.

## Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Globale Styles
├── src/
│   ├── components/        # React Components
│   ├── sections/          # Page Sections
│   ├── data/             # Daten & Config
│   │   ├── playerMeta.ts  # Spieler-Positionen Mapping
│   │   └── instagram.json # Instagram Posts
│   └── lib/              # Utilities
│       └── getPlayersFromImages.ts
└── public/
    ├── bilder/           # Spieler-Bilder
    └── instagram/        # Instagram-Bilder
```

## Design-System

- **Primary Color**: Gelb (`hsl(70 100% 50%)`)
- **Dark Neon Look**: Dunkler Hintergrund mit subtilen Neon-Glow-Effekten
- **Fokus States**: Gelb (Primary)
- **Border Radius**: Einheitlich `0.75rem` (var(--radius))
- **Animationen**: Framer Motion für sanfte Übergänge

## Features

- ✅ Automatische Spieler-Generierung aus Bildern
- ✅ Fussball.de iFrame Integration
- ✅ Instagram Feed (JSON-basiert)
- ✅ Responsive Design
- ✅ Dark Neon Look
- ✅ Performance-optimiert (next/image)
- ✅ Smooth Animations

## Deployment

Das Projekt kann auf Vercel, Netlify oder anderen Next.js-kompatiblen Plattformen deployed werden.

```bash
npm run build
```
