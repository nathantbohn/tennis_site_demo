import type { SiteInfo } from "@/data/types";
import { formatTime } from "@/lib/format";
import { formatPhone, mailtoHref, telHref } from "@/lib/phone";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";

const cell =
  "flex min-h-24 items-start gap-3 px-4 py-4 sm:px-6 [&>svg]:mt-0.5 [&>svg]:shrink-0 [&>svg]:text-lime-300";
const label = "block text-sm font-semibold uppercase tracking-[0.16em] text-sage-100/80";
const value = "mt-1 block text-base font-medium leading-snug text-white";
// An email address is read letter by letter, so it never wraps. The grid gives its cell room instead.
const valueEmail = "mt-1 block whitespace-nowrap text-base font-medium leading-snug text-white";
const link = `${cell} transition-colors hover:bg-slate-900`;

/** Four things a phone visitor wants in the first scroll: call, find, hours, email. */
export function ContactStrip({ site }: { site: SiteInfo }) {
  const hours = site.hours[0];
  return (
    <section aria-label="Quick contact" className="on-dark bg-slate-800 text-white">
      {/*
        One column of four rows below 480px; two columns from there (the right
        column is the wider one so the email fits); four across from md.
      */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 min-[480px]:grid-cols-[0.8fr_1.2fr] md:grid-cols-[0.85fr_1.15fr_0.85fr_1.15fr]">
        <a
          href={telHref(site.phone)}
          className={`${link} border-b border-white/10 min-[480px]:border-r md:border-b-0`}
        >
          <PhoneIcon />
          <span>
            <span className={label}>{site.phoneAcceptsSms ? "Call or text" : "Call"}</span>
            <span className={value}>{formatPhone(site.phone)}</span>
          </span>
        </a>
        <a
          href={site.links.map}
          target="_blank"
          rel="noopener noreferrer"
          className={`${link} border-b border-white/10 md:border-b-0 md:border-r`}
        >
          <PinIcon />
          <span>
            <span className={label}>Find us</span>
            <span className={value}>
              {site.address.street}
              {site.address.landmark ? (
                <span className="block font-normal text-sage-100/80">{site.address.landmark}</span>
              ) : null}
            </span>
          </span>
        </a>
        <div className={`${cell} border-b border-white/10 min-[480px]:border-b-0 min-[480px]:border-r`}>
          <ClockIcon />
          <span>
            <span className={label}>Open</span>
            <span className={value}>
              {hours.label}
              <span className="block font-normal text-sage-100/80">
                {formatTime(hours.open)} – {formatTime(hours.close)}
              </span>
            </span>
          </span>
        </div>
        <a href={mailtoHref(site.email)} className={link}>
          <MailIcon />
          <span className="min-w-0">
            <span className={label}>Email</span>
            <span className={valueEmail}>{site.email}</span>
          </span>
        </a>
      </div>
    </section>
  );
}
