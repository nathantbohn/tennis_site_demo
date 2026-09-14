import type { Metadata } from "next";
import { getPriceItems, getServices, getSite } from "@/lib/content";
import { resolveCtaHref } from "@/lib/cta";
import { formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { ArrowIcon, CheckIcon } from "@/components/Icons";
import { Placeholder } from "@/components/Placeholder";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Private lessons, clinics, court time, junior camps, leagues and tournaments on lit clay courts in DeLand, Florida.",
  openGraph: { title: "Services", url: "/services" },
};

export default async function ServicesPage() {
  const [site, services] = await Promise.all([getSite(), getServices()]);
  const withPricing = await Promise.all(
    services.map(async (service) => ({
      service,
      pricing: await getPriceItems(service.pricingIds),
    })),
  );

  return (
    <>
      <Container className="pb-4 pt-12 md:pt-20">
        <SectionHeading
          as="h1"
          eyebrow="Services"
          title="Lessons, clinics and court time on clay"
          lede={`Everything below is run by ${site.owner.firstName}. If you are not sure where to start, call or text and describe your game; he will point you to the right thing.`}
        />
      </Container>

      <div className="mt-8 divide-y divide-sand-200">
        {withPricing.map(({ service, pricing }, i) => {
          const flip = i % 2 === 1;
          const ctaContext = `I'm interested in ${service.name.toLowerCase()}.`;
          return (
            <section
              key={service.id}
              id={service.id}
              aria-labelledby={`${service.id}-title`}
              className="py-12 md:py-16"
            >
              <Container className="grid gap-8 md:grid-cols-12 md:items-center md:gap-12">
                <div className={`md:col-span-5 ${flip ? "md:order-2" : ""}`}>
                  <Placeholder
                    image={service.image}
                    className={`aspect-[4/3] ${flip ? "rounded-[2rem] rounded-tl-md" : "rounded-[2rem] rounded-br-md"}`}
                  />
                </div>
                <div className={`md:col-span-7 ${flip ? "md:order-1" : ""}`}>
                  <p className="font-display text-lg text-clay-600">{String(i + 1).padStart(2, "0")}</p>
                  <h2
                    id={`${service.id}-title`}
                    className="font-display soft mt-1 text-3xl font-medium leading-tight tracking-tight text-court-900 sm:text-4xl"
                  >
                    {service.name}
                  </h2>
                  <p className="font-display mt-2 text-xl italic text-clay-700">{service.tagline}</p>
                  <p className="mt-4 text-sm font-medium text-ink-muted">
                    <span className="font-semibold text-ink">For:</span> {service.audience}
                  </p>
                  <div className="mt-4 space-y-3 leading-relaxed">
                    {service.description.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                  <ul className="mt-5 space-y-2">
                    {service.includes.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-[0.9375rem]">
                        <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-court-600" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  {pricing.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Pricing">
                      {pricing.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-full bg-sand-100 px-3 py-1.5 text-sm ring-1 ring-inset ring-sand-300"
                        >
                          <span className="font-medium">{item.name}</span>{" "}
                          <span className="font-display text-base font-medium text-clay-700">
                            {formatPrice(item.price)}
                          </span>{" "}
                          <span className="text-ink-muted">{item.unit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <ButtonLink
                    href={resolveCtaHref(service.cta.action, site, ctaContext)}
                    className="mt-7 w-full sm:w-auto"
                    size="lg"
                  >
                    {service.cta.label}
                    <ArrowIcon />
                  </ButtonLink>
                </div>
              </Container>
            </section>
          );
        })}
      </div>
    </>
  );
}
