import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { formatTime, numberWord } from "@/lib/format";
import { formatPhone, mailtoHref, smsHref, telHref } from "@/lib/phone";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { CheckIcon, ExternalIcon, MailIcon, MessageIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import { Placeholder } from "@/components/Placeholder";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About & contact",
  description:
    "Call, text, email or find DeLand Tennis Club: 2285 Country Club Rd, DeLand, FL. Meet Fred Schwan, USPTA pro and director of tennis.",
  openGraph: { title: "About & contact", url: "/contact" },
};

const actionClass =
  "flex min-h-20 items-center gap-4 rounded-2xl bg-white px-5 py-4 text-left ring-1 ring-inset ring-sand-300 transition-colors hover:bg-sand-100";

export default async function ContactPage() {
  const site = await getSite();
  const { address, owner } = site;
  const hours = site.hours[0];
  const bookText = `Hi ${owner.firstName}, I'd like to book a court on ___ at ___.`;

  return (
    <>
      <Container className="pt-12 md:pt-20">
        <SectionHeading
          as="h1"
          eyebrow="About & contact"
          title="Come see the courts"
          lede={`${owner.firstName} answers the phone himself. Call, text or email, or just stop by: we are ${address.landmark ? address.landmark.charAt(0).toLowerCase() + address.landmark.slice(1) : `at ${address.street}`}.`}
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <a href={telHref(site.phone)} className={actionClass}>
            <PhoneIcon className="h-6 w-6 shrink-0 text-clay-700" />
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Call</span>
              <span className="block text-lg font-semibold">{formatPhone(site.phone)}</span>
            </span>
          </a>
          {site.phoneAcceptsSms ? (
            <a href={smsHref(site.phone)} className={actionClass}>
              <MessageIcon className="h-6 w-6 shrink-0 text-clay-700" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Text</span>
                <span className="block text-lg font-semibold">{formatPhone(site.phone)}</span>
              </span>
            </a>
          ) : null}
          <a href={mailtoHref(site.email)} className={actionClass}>
            <MailIcon className="h-6 w-6 shrink-0 text-clay-700" />
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Email</span>
              <span className="block break-all text-lg font-semibold">{site.email}</span>
            </span>
          </a>
          <a href={site.links.directions} target="_blank" rel="noopener noreferrer" className={actionClass}>
            <PinIcon className="h-6 w-6 shrink-0 text-clay-700" />
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Directions</span>
              <span className="block text-lg font-semibold">
                {address.street}
                <ExternalIcon className="ml-1.5 inline h-4 w-4 align-baseline text-ink-muted" />
              </span>
            </span>
          </a>
        </div>
      </Container>

      {/* Where and when */}
      <Container className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <a
            href={site.links.map}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-[2rem] shadow-lift"
            aria-label={`Open ${site.name} in Google Maps`}
          >
            <Placeholder
              image={{
                variant: "map",
                alt: `Map showing ${site.name} at ${address.street}, ${address.city}`,
              }}
              className="aspect-[4/3] rounded-[2rem]"
              note="Map to come · tap to open Google Maps"
            />
          </a>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={site.links.map} variant="secondary" external>
              Open in Google Maps
              <ExternalIcon />
            </ButtonLink>
            <ButtonLink href={site.links.googleBusiness} variant="quiet" external>
              Reviews and photos on Google
              <ExternalIcon />
            </ButtonLink>
          </div>
        </div>
        <div className="md:col-span-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">Where</h2>
          <address className="font-display soft mt-2 text-2xl not-italic leading-snug text-court-900">
            {address.street}
            <br />
            {address.city}, {address.state} {address.zip}
          </address>
          {address.landmark ? <p className="mt-2 text-ink-muted">{address.landmark}.</p> : null}

          <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">When</h2>
          <p className="font-display soft mt-2 text-2xl leading-snug text-court-900">
            {hours.label}, {formatTime(hours.open)} – {formatTime(hours.close)}
          </p>
          {site.hoursNote ? <p className="mt-2 leading-relaxed text-ink-muted">{site.hoursNote}</p> : null}

          <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">Follow</h2>
          <ul className="mt-2 space-y-1">
            {site.social.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium underline decoration-clay-300 underline-offset-4 hover:decoration-clay-700"
                >
                  {s.platform === "instagram" ? `Instagram ${s.handle}` : "Facebook"}
                  <ExternalIcon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Book a court */}
      <Container className="mt-16 md:mt-24">
        <section
          id="book"
          aria-labelledby="book-heading"
          className="scroll-mt-32 rounded-3xl bg-court-900 p-6 text-sand-50 sm:p-10 md:scroll-mt-24 md:grid md:grid-cols-12 md:gap-10"
        >
          <div className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-300">Book a court</p>
            <h2 id="book-heading" className="font-display soft mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
              Reserve by phone or text
            </h2>
            <p className="mt-4 leading-relaxed text-sand-200">
              Tell {owner.firstName} the day and time you want and how many players. He confirms by
              text. Same-day courts are usually available; evenings under the lights go first.
            </p>
            <ul className="mt-5 space-y-2 text-[0.9375rem] text-sand-200">
              {[
                `${numberWord(site.facility.courtCount).charAt(0).toUpperCase()}${numberWord(site.facility.courtCount).slice(1)} ${site.facility.surface} courts, all lit`,
                "Hourly reservations, walk-ins when a court is free",
                "ACE PASS holders: just say your name",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-ball" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-col gap-3 md:col-span-5 md:mt-0 md:justify-center">
            <ButtonLink href={telHref(site.phone)} size="lg" external>
              <PhoneIcon />
              Call {formatPhone(site.phone)}
            </ButtonLink>
            {site.phoneAcceptsSms ? (
              <ButtonLink href={smsHref(site.phone, bookText)} size="lg" variant="secondary" external>
                <MessageIcon />
                Text to book
              </ButtonLink>
            ) : null}
          </div>
        </section>
      </Container>

      {/* About */}
      <Container className="mt-16 md:mt-24" as="section" aria-labelledby="about-heading">
        <div id="about" className="scroll-mt-32 md:scroll-mt-24" />
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <Placeholder
              image={{ variant: "clubhouse", alt: `The vintage clubhouse at ${site.name}, porch lights on at dusk` }}
              className="aspect-[4/5] rounded-[2rem]"
            />
          </div>
          <div className="md:col-span-7">
            <SectionHeading
              eyebrow="About the club"
              id="about-heading"
              title="A vintage clubhouse, back in action"
              lede={site.description}
            />
            <h3 className="font-display soft mt-10 text-2xl font-medium text-court-900">{owner.name}</h3>
            <p className="mt-1 text-sm font-medium text-clay-700">
              {owner.title} · {owner.credentials}
            </p>
            <div className="mt-4 space-y-4 leading-relaxed">
              {owner.bio.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Facility highlights">
              {site.facility.highlights.map((h) => (
                <li key={h} className="rounded-full bg-court-100 px-3 py-1.5 text-sm font-medium text-court-800">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
