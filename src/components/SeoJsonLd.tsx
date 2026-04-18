import { getCanonicalSiteUrl, siteConfig, seoDefaults, defaultOgImagePath } from "@/config/site";

/** Strukturierte Daten für Startseite: SportsTeam, WebSite, WebPage (schema.org). */
export default function SeoJsonLd() {
  const base = getCanonicalSiteUrl();
  const logoUrl = new URL("/wappen.png", `${base}/`).toString();
  const heroImageUrl = new URL(defaultOgImagePath, `${base}/`).toString();
  const clubHttps = siteConfig.mainClubUrl.replace(/^http:\/\//i, "https://");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsTeam",
        "@id": `${base}/#mannschaft`,
        name: `${siteConfig.clubName} ${siteConfig.teamName}`,
        alternateName: "TSV Poggenhagen Erste Herren",
        sport: "https://schema.org/Soccer",
        url: base,
        logo: { "@type": "ImageObject", url: logoUrl },
        image: heroImageUrl,
        sameAs: [siteConfig.instagramUrl, clubHttps],
        parentOrganization: {
          "@type": "SportsOrganization",
          name: "Turn- und Sportverein Poggenhagen von 1946 e. V.",
          url: clubHttps,
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Ilschenheide 4",
          addressLocality: "Neustadt am Rübenberge",
          postalCode: "31535",
          addressCountry: "DE",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: seoDefaults.siteName,
        description: seoDefaults.description,
        inLanguage: "de-DE",
        publisher: { "@id": `${base}/#mannschaft` },
      },
      {
        "@type": "WebPage",
        "@id": `${base}/#start`,
        url: base,
        name: seoDefaults.title,
        description: seoDefaults.description,
        isPartOf: { "@id": `${base}/#website` },
        about: { "@id": `${base}/#mannschaft` },
        inLanguage: "de-DE",
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
