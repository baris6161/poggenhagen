import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/config/site";

/** Produktion: Crawling erlauben. Vercel Preview: keine Doppelindexierung. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  const base = getCanonicalSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https:\/\//, ""),
  };
}
