import type { SiteInfo } from "@/data/types";

/**
 * Base URL for absolute links (Open Graph, sitemap, robots). Set
 * NEXT_PUBLIC_SITE_URL on each deployment; falls back to the club's domain.
 */
export function getSiteUrl(site: SiteInfo): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? site.url);
}
