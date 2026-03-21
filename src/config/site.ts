/** Canonical URL für Meta-Tags, Open Graph & WhatsApp-Vorschau. Auf Vercel: optional NEXT_PUBLIC_SITE_URL setzen (eigene Domain). */
export function getCanonicalSiteUrl(): string {
  const custom = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (custom) return custom;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "https://poggenhagen.vercel.app";
}

/** Relativer Pfad zum Share-Bild; muss unter `public/` erreichbar sein. */
export const defaultOgImagePath = "/TSV-Poggenhagen.webp";

export const seoDefaults = {
  /** Kurz & klar für Tab, Google & Link-Vorschauen */
  title: "TSV Poggenhagen – 1. Herren | Kreisliga Neustadt",
  /** ~155 Zeichen: Nutzen + Ort + Instagram (WhatsApp, Facebook, X) */
  description:
    "1. Herren des TSV Poggenhagen in der Kreisliga Neustadt: Spielplan, Tabelle, Ergebnisse, Kader & Trainerstab, Sportplatz. Instagram: @tsv.poggenhagen_1.herren.",
} as const;

export const siteConfig = {
  clubName: "TSV Poggenhagen",
  teamName: "1. Herren",
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
  endpoints: {
    fixtures: "/api/fixtures",
    results: "/api/results",
    table: "/api/table",
    instagram: "/api/instagram",
  },
  venue: {
    name: "Sportplatz Poggenhagen",
    address: "Ilschenheide 4, 31535 Neustadt am Rübenberge",
    mapsUrl: "https://maps.app.goo.gl/sDquMmHoEzkxwv4W8?g_st=ic",
  },
  navItems: [
    { label: "Start", href: "#hero" },
    { label: "Nächstes Spiel", href: "#naechstes-spiel" },
    { label: "Kader", href: "#kader" },
    { label: "Trainerstab", href: "#trainerstab" },
    { label: "Spielplan", href: "#spielplan" },
    { label: "Ergebnisse", href: "#ergebnisse" },
    { label: "Tabelle", href: "#tabelle" },
    { label: "Instagram", href: "#instagram" },
  ],
};
