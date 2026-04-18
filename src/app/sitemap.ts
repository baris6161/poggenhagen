import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.VERCEL_ENV === "preview") {
    return [];
  }

  const base = getCanonicalSiteUrl();
  const now = new Date();
  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/impressum`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
