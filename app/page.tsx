import type { Metadata } from "next";
import Link from "next/link";
import { getLatestPosts, getPricing, getServices, getSite } from "@/lib/content";
import { formatTime } from "@/lib/format";
import { BOOK_HREF } from "@/lib/nav";
import { formatPhone, smsHref, telHref } from "@/lib/phone";
import { AcePass } from "@/components/AcePass";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactStrip } from "@/components/ContactStrip";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { ArrowIcon, PhoneIcon } from "@/components/Icons";
import { LatestPosts } from "@/components/LatestPosts";
import { Placeholder } from "@/components/Placeholder";
import { PriceList } from "@/components/PriceList";
import { SectionHeading } from "@/components/SectionHeading";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const title = `${site.name} · Clay courts in ${site.address.city}, ${site.address.state}`;
  return {
    title: { absolute: title },
    description: site.description,
    openGraph: { title, description: site.description, url: "/" },
  };
}

export default async function HomePage() {
  const [site, services, pricing, posts] = await Promise.all([
    getSite(),
    getServices(),
    getPricing(),
    getLatestPosts(3),
  ]);
  const acePass = pricing.find((p) => p.featured) ?? pricing[0];
  const otherPricing = pricing.filter((p) => p !== acePass);
  const hours = site.hours[0];

  return (
    <>
      {/* Hero: editorial split, not a photo with text over it. */}
      <section className="overflow-hidden">
        <Container className="grid gap-10 pb-14 pt-10 md:grid-cols-12 md:items-center md:gap-8 md:pb-20 md:pt-16">
          <div className="md:col-span-7">
            <Eyebrow>{site.hero.eyebrow}</Eyebrow>
            <h1 className="font-display soft mt-4 text-[2.5rem] font-medium leading-[1.02] tracking-tight text-court-900 sm:text-5xl md:text-[3.75rem]">
              {site.hero.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">{site.hero.lede}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={telHref(site.phone)} size="lg" external>
                <PhoneIcon />
                Call {formatPhone(site.phone)}
              </ButtonLink>
              <ButtonLink href={BOOK_HREF} variant="secondary" size="lg">
                Book a court
                <ArrowIcon />
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm text-ink-muted">
              {site.phoneAcceptsSms ? (
                <>
                  Prefer to text?{" "}
                  <a
                    href={smsHref(site.phone)}
                    className="font-medium text-ink underline decoration-clay-300 underline-offset-4 hover:decoration-clay-700"
                  >
                    Send a message
                  </a>
                  .{" "}
                </>
              ) : null}
              Open {hours.label.toLowerCase()}, {formatTime(hours.open)} – {formatTime(hours.close)}.
            </p>
          </div>

          <div className="relative md:col-span-5">
            <Placeholder
              image={{
                variant: "clay",
                alt: `The clay courts at ${site.name} in late-afternoon light, lines freshly swept`,
              }}
              className="aspect-[4/3] rounded-[2rem] shadow-lift sm:aspect-[5/4] md:aspect-[4/5]"
            />
            <p
              className="font-display absolute -top-3 right-3 rotate-3 rounded-full bg-ball px-3.5 py-1.5 text-[0.95rem] font-medium italic text-court-900 shadow-lift md:-right-3"
              aria-label={`Club motto: ${site.tagline}`}
            >
              {site.tagline}.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Facility highlights">
              {site.facility.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full bg-court-100 px-3 py-1.5 text-xs font-medium text-court-800"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <ContactStrip site={site} />

      {/* What we do: a numbered list, not a card grid. */}
      <section aria-labelledby="services-heading" className="py-16 md:py-24">
        <Container className="md:grid md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="What we do"
              id="services-heading"
              title="Everything from a first swing to tournament play"
              lede={`Run by ${site.owner.name}, ${site.owner.credentials}. Pick what fits and ${site.owner.firstName} will sort out the rest.`}
            />
            <ButtonLink href="/services" variant="quiet" className="mt-6">
              All services
              <ArrowIcon />
            </ButtonLink>
          </div>
          <ol className="mt-10 divide-y divide-sand-200 border-y border-sand-200 md:col-span-7 md:mt-0">
            {services.map((service, i) => (
              <li key={service.id}>
                <Link
                  href={`/services#${service.id}`}
                  className="group flex items-baseline gap-4 py-5 transition-colors hover:bg-sand-100 sm:gap-6 sm:px-3"
                >
                  <span className="font-display w-8 shrink-0 text-lg text-clay-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display soft block text-2xl font-medium leading-tight text-court-900">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] text-ink-muted">{service.tagline}</span>
                  </span>
                  <ArrowIcon className="h-5 w-5 shrink-0 self-center text-clay-600 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Pricing and the ACE PASS. */}
      <section id="pricing" aria-labelledby="pricing-heading" className="bg-sand-100/60 py-16 md:py-24">
        <Container className="md:grid md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="Pricing"
              id="pricing-heading"
              title="Court time that is easy to say yes to"
              lede="No membership required. Play once, or buy a pass and make it a habit."
            />
            <div className="mt-8">
              <AcePass item={acePass} site={site} />
            </div>
          </div>
          <div className="mt-12 md:col-span-7 md:mt-0 md:pt-2">
            <PriceList items={otherPricing} />
            <p className="mt-6 text-sm text-ink-muted">
              Prices are per person unless noted and can change with the season. Call or text to
              confirm before you come out.
            </p>
          </div>
        </Container>
      </section>

      <LatestPosts posts={posts} site={site} />

      {/* Meet Fred / plan your visit. */}
      <section aria-labelledby="visit-heading" className="bg-clay-100 py-16 md:py-24">
        <Container className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="mx-auto w-56 md:col-span-4 md:w-full md:max-w-xs">
            <Placeholder
              image={{
                variant: "clubhouse",
                alt: `${site.owner.name} on the clubhouse porch, racquet in hand`,
              }}
              className="aspect-square rounded-full"
              note={false}
            />
            <p className="mt-3 text-center text-xs text-ink-muted" aria-hidden="true">
              Photo to come · {site.owner.firstName} on the clubhouse porch
            </p>
          </div>
          <div className="md:col-span-8">
            <SectionHeading
              eyebrow={`Meet ${site.owner.firstName}`}
              id="visit-heading"
              title={`${site.owner.name}, ${site.owner.title.toLowerCase()}`}
              lede={site.owner.bio[0]}
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/contact#about" variant="primary">
                About the club
                <ArrowIcon />
              </ButtonLink>
              <ButtonLink href={site.links.directions} variant="quiet" external>
                Get directions
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
