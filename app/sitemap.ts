import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";
import { NAV_ITEMS } from "@/lib/nav";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  const base = getSiteUrl(site);
  const lastModified = new Date();
  return NAV_ITEMS.map((item) => ({
    url: new URL(item.href, base).toString(),
    lastModified,
    changeFrequency: item.href === "/schedule" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));
}
