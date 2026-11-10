import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  return {
    // /admin-preview is a UI-only preview of the Phase 2 admin, not linked
    // from the nav or sitemap and noindexed on every page besides — this
    // is one more layer, not the thing keeping it private.
    rules: { userAgent: "*", allow: "/", disallow: "/admin-preview" },
    sitemap: new URL("/sitemap.xml", getSiteUrl(site)).toString(),
  };
}
