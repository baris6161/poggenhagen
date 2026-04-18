import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TSV Poggenhagen 1. Herren",
    short_name: "TSV Poggenhagen",
    description:
      "1. Herren: Spielplan, Tabelle, Ergebnisse, Kader. Kreisliga Neustadt am Rübenberge.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0f0a",
    theme_color: "#0c0f0a",
    orientation: "portrait-primary",
    lang: "de",
    icons: [
      {
        src: "/wappen.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/wappen.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
