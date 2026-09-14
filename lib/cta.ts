import type { SiteInfo } from "@/data/types";
import { mailtoHref, smsHref, telHref } from "@/lib/phone";

/**
 * Turns a data-driven CTA ("call" | "text" | "email" | path) into an href.
 * `context` becomes the prefilled text/email body so the owner knows what
 * the message is about.
 */
export function resolveCtaHref(action: string, site: SiteInfo, context?: string): string {
  switch (action) {
    case "call":
      return telHref(site.phone);
    case "text":
      return site.phoneAcceptsSms
        ? smsHref(site.phone, context ? `Hi ${site.owner.firstName}, ${context}` : undefined)
        : telHref(site.phone);
    case "email":
      return mailtoHref(site.email, context);
    default:
      return action;
  }
}
