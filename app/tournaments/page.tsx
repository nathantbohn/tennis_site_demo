import type { Metadata } from "next";
import { getSite, getUpcomingTournaments } from "@/lib/content";
import { formatCalendarDate, formatDateRange, formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { ArrowIcon } from "@/components/Icons";
import { SectionHeading } from "@/components/SectionHeading";
import { TournamentForm } from "@/components/TournamentForm";

export const metadata: Metadata = {
  title: "Tournament application",
  description:
    "Upcoming tournaments at DeLand Tennis Club and the application form. Players from beginner to advanced are welcome.",
  openGraph: { title: "Tournament application", url: "/tournaments" },
};

export default async function TournamentsPage() {
  const [site, tournaments] = await Promise.all([getSite(), getUpcomingTournaments()]);

  return (
    <>
      <Container className="pt-12 md:pt-20">
        <SectionHeading
          as="h1"
          eyebrow="Tournaments"
          title="Play in a tournament"
          lede="The club welcomes players from beginners to advanced. Pick an event, tell us your division, and we will text you to confirm your spot."
        />
        <div className="mt-6">
          <ButtonLink href="#apply" variant="primary" external>
            Skip to the application
            <ArrowIcon />
          </ButtonLink>
        </div>
      </Container>

      <Container as="section" className="mt-12 md:mt-16">
        <h2 className="sr-only">Upcoming tournaments</h2>
        <ol className="divide-y divide-slate-500/20 border-y border-slate-500/20">
          {tournaments.map((t) => (
            <li key={t.id} id={t.id} className="scroll-mt-32 py-8 md:grid md:grid-cols-12 md:gap-10 md:py-10">
              <div className="md:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-800">
                  {formatDateRange(t.startDate, t.endDate)}
                </p>
                <h3 className="font-display soft mt-2 text-3xl font-medium leading-tight tracking-tight text-slate-800">
                  {t.name}
                </h3>
                <p className="mt-3 text-sm text-ink-muted">
                  Applications close {formatCalendarDate(t.registrationCloses)}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-display text-xl font-medium text-slate-800">{formatPrice(t.entryFee)}</span>{" "}
                  <span className="text-ink-muted">{t.entryFeeNote ?? "per player"}</span>
                </p>
              </div>
              <div className="mt-5 md:col-span-8 md:mt-0">
                <p className="leading-relaxed">{t.description}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  <span className="font-semibold text-ink">Format:</span> {t.format}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${t.name} divisions`}>
                  {t.divisions.map((d) => (
                    <li key={d} className="rounded-full bg-aqua-100 px-3 py-1.5 text-sm ring-1 ring-inset ring-slate-500/30">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      <Container as="section" className="mt-16 md:mt-24" aria-labelledby="apply-heading">
        <div className="md:grid md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="Application"
              id="apply-heading"
              title="Put your name in"
              lede={`Takes about a minute. ${site.owner.firstName} confirms every entry personally by text, usually the same day.`}
            />
            <div id="apply" className="scroll-mt-32 md:scroll-mt-24" />
          </div>
          <div className="mt-8 md:col-span-7 md:mt-0">
            <TournamentForm
              tournaments={tournaments}
              owner={{ phone: site.phone, email: site.email, firstName: site.owner.firstName }}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
