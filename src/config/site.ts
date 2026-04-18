/**
 * Canonical URL für Meta-Tags, Open Graph, Sitemap und WhatsApp-Vorschau.
 * Eigene Domain: in Vercel `NEXT_PUBLIC_SITE_URL` auf die HTTPS-Root-URL setzen (ohne Schrägstrich am Ende).
 * Google Search Console: optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` mit dem Meta-Tag-Inhalt aus der Konsole.
 */
export function getCanonicalSiteUrl(): string {
  const custom = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (custom) return custom;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "https://tsv-poggenhagen-erste.de";
}

/** Relativer Pfad zum Share-Bild; muss unter `public/` erreichbar sein. */
export const defaultOgImagePath = "/TSV-Poggenhagen.webp";

export const seoDefaults = {
  /** Tabtitel und Suchsnippet, ohne Gedankenstrich */
  title: "TSV Poggenhagen 1. Herren | Fußball Kreisliga Neustadt am Rübenberge",
  /** Kurzbezeichnung für Open Graph site_name und strukturierte Daten */
  siteName: "TSV Poggenhagen 1. Herren",
  /** Meta-Description: sachlich, ein Satz plus Präzisierung, Zielbereich ca. 150 bis 160 Zeichen */
  description:
    "Erste Herrenmannschaft des TSV Poggenhagen in der Kreisliga Neustadt am Rübenberge. Spielplan, Tabellenstand, Ergebnisse, Kader und Trainerteam. Heimspiele am Sportplatz Ilschenheide.",
} as const;

/** Für Meta keywords und interne Auszeichnung; Suchmaschinen gewichten das Feld gering. */
export const seoKeywords = [
  "TSV Poggenhagen",
  "1. Herren",
  "Herrenfußball",
  "Fußball",
  "Kreisliga Neustadt",
  "Neustadt am Rübenberge",
  "Ilschenheide",
  "Sportplatz Poggenhagen",
  "Landkreis Hannover",
] as const;

export const siteConfig = {
  clubName: "TSV Poggenhagen",
  teamName: "1. Herren",
  mainClubUrl: "http://www.tsv-poggenhagen1946.de/",
  league: "Kreisliga",
  region: "Neustadt",
  instagramHandle: "tsv.poggenhagen_1.herren",
  instagramUrl: "https://www.instagram.com/tsv.poggenhagen_1.herren/",
  fussballWidgets: {
    fixtures: "",
    results: "",
    table: "",
    nextMatch: "",
  },
  tableMode: "iframe" as "json" | "iframe",
  tableIframeUrl: "",
  venue: {
    name: "Sportplatz Poggenhagen",
    address: "Ilschenheide 4, 31535 Neustadt am Rübenberge",
    mapsUrl: "https://maps.app.goo.gl/sDquMmHoEzkxwv4W8?g_st=ic",
  },
  navItems: [
    { label: "Start", href: "#hero" },
    { label: "Nächstes Spiel", href: "#naechstes-spiel" },
    { label: "Spielplan", href: "#spielplan" },
    { label: "Ergebnisse", href: "#ergebnisse" },
    { label: "Tabelle", href: "#tabelle" },
    { label: "Kader", href: "#kader" },
    { label: "Trainerstab", href: "#trainerstab" },
    { label: "Instagram", href: "#instagram" },
  ],
};
