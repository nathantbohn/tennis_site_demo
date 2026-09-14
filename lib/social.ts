import type { SocialLink, SocialPlatform } from "@/data/types";

/**
 * Every social link on the site renders from `site.social` — add or remove
 * a platform there and the footer, contact page and "Latest" section all
 * follow without a code change. Nothing here should hardcode which
 * platforms exist; this label map is the only place that needs to know
 * about a new one.
 */
const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
};

/** "Instagram @handle" for Instagram (handles read naturally with an @),
 * just the platform name for anything else (a Facebook page name repeats
 * the club's own name, so showing it twice reads as redundant). */
export function socialLinkLabel(link: SocialLink): string {
  return link.platform === "instagram" ? `${PLATFORM_LABEL[link.platform]} ${link.handle}` : PLATFORM_LABEL[link.platform];
}

/** "Follow on Instagram" / "Follow on Facebook", for a generic follow CTA. */
export function socialFollowLabel(link: SocialLink): string {
  return `Follow on ${PLATFORM_LABEL[link.platform]}`;
}
