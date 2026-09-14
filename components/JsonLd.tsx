import type { SiteInfo } from "@/data/types";
import { getSiteUrl } from "@/lib/site-url";

const DAY_CODES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** schema.org LocalBusiness markup so Google can read the basics. */
export function JsonLd({ site }: { site: SiteInfo }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: site.name,
    description: site.description,
    url: getSiteUrl(site).toString(),
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_CODES,
      opens: h.open,
      closes: h.close,
    })),
    sameAs: site.social.map((s) => s.url),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
