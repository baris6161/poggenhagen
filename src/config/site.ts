export const siteConfig = {
  clubName: "TSV Poggenhagen",
  teamName: "1. Herren",
  league: "Kreisliga",
  region: "Neustadt",
  instagramHandle: "tsv.poggenhagen",
  instagramUrl: "https://www.instagram.com/tsv.poggenhagen/",
  // fussball.de Widget URLs
  // Diese URLs müssen von fussball.de generiert werden
  // Gehe zu: https://www.fussball.de/widgets
  fussballWidgets: {
    // Spielplan Widget URL
    fixtures: "",
    // Ergebnisse Widget URL
    results: "",
    // Tabelle Widget URL
    table: "",
    // Nächstes Spiel Widget URL (optional)
    nextMatch: "",
  },
  // Legacy Support
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
    address: "Sportplatzweg 1, 31535 Neustadt am Rübenberge",
    mapsUrl: "https://maps.google.com/?q=Sportplatz+Poggenhagen+Neustadt",
  },
  navItems: [
    { label: "Start", href: "#hero" },
    { label: "Spielplan", href: "#spielplan" },
    { label: "Ergebnisse", href: "#ergebnisse" },
    { label: "Tabelle", href: "#tabelle" },
    { label: "Kader", href: "#kader" },
    { label: "Trainerstab", href: "#trainerstab" },
    { label: "Instagram", href: "#instagram" },
    { label: "Kontakt", href: "#kontakt" },
  ],
};
