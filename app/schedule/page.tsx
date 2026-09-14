import type { Metadata } from "next";
import { getScheduleByDay, getSite } from "@/lib/content";
import { DAY_LABELS, formatTime } from "@/lib/format";
import { smsHref, telHref } from "@/lib/phone";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { MessageIcon, PhoneIcon } from "@/components/Icons";
import { ScheduleDaySection, ScheduleLegend } from "@/components/ScheduleTable";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Weekly schedule",
  description:
    "Clinics, junior sessions, leagues and social play at DeLand Tennis Club, by day and court.",
  openGraph: { title: "Weekly schedule", url: "/schedule" },
};

export default async function SchedulePage() {
  const [site, days] = await Promise.all([getSite(), getScheduleByDay()]);
  const hours = site.hours[0];

  return (
    <>
      <Container className="pt-12 md:pt-20">
        <SectionHeading
          as="h1"
          eyebrow="Schedule"
          title="This week on the courts"
          lede={`Clinics, juniors, leagues and social play. Courts are open ${hours.label.toLowerCase()} from ${formatTime(hours.open)} to ${formatTime(hours.close)}; anything not listed below is open court time you can reserve.`}
        />

        <nav aria-label="Jump to day" className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2">
            {days.map((group) => (
              <li key={group.day}>
                <a
                  href={`#${group.day.toLowerCase()}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-sand-100 px-4 text-sm font-medium ring-1 ring-inset ring-sand-300 hover:bg-sand-200"
                >
                  <span className="sm:hidden">{group.day}</span>
                  <span className="hidden sm:inline">{DAY_LABELS[group.day]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6">
          <ScheduleLegend />
        </div>
      </Container>

      <Container className="mt-10 space-y-12 md:mt-14 md:space-y-16">
        {days.map((group) => (
          <ScheduleDaySection key={group.day} group={group} />
        ))}
      </Container>

      <Container className="mt-16">
        <div className="rounded-3xl bg-court-900 p-6 text-sand-50 sm:p-10 md:flex md:items-center md:justify-between md:gap-10">
          <div className="max-w-xl">
            <h2 className="font-display soft text-3xl font-medium tracking-tight">Want a court outside these times?</h2>
            <p className="mt-3 leading-relaxed text-sand-200">
              Call or text {site.owner.firstName} with the day and time you have in mind and he will
              confirm by text. Drop-ins for clinics are welcome when there is room on the court.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0 md:shrink-0">
            <ButtonLink href={telHref(site.phone)} size="lg" external>
              <PhoneIcon />
              Call
            </ButtonLink>
            {site.phoneAcceptsSms ? (
              <ButtonLink
                href={smsHref(site.phone, `Hi ${site.owner.firstName}, I'd like to book a court.`)}
                size="lg"
                variant="secondary"
                external
              >
                <MessageIcon />
                Text
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </>
  );
}
