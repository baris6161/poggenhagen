import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/config/site";

/** Dynamisch: korrekte Domain inkl. Vercel Preview / NEXT_PUBLIC_SITE_URL */
export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https:\/\//, ""),
  };
}
