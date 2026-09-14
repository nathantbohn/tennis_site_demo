import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", getSiteUrl(site)).toString(),
  };
}
