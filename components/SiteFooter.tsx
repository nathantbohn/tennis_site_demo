import type { SiteInfo } from "@/data/types";
import { formatTime } from "@/lib/format";
import { formatPhone, mailtoHref, smsHref, telHref } from "@/lib/phone";
import { Container } from "@/components/Container";
import { BallMark, ExternalIcon } from "@/components/Icons";

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 text-sand-50 underline decoration-sand-50/40 underline-offset-4 hover:decoration-sand-50";

export function SiteFooter({ site }: { site: SiteInfo }) {
  const { address } = site;
  return (
    <footer className="mt-20 bg-court-900 text-sand-200">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8">
        <div>
          <p className="flex items-center gap-2.5">
            <BallMark className="h-8 w-8" />
            <span className="font-display soft text-2xl font-semibold text-sand-50">{site.name}</span>
          </p>
          <p className="mt-3 font-display text-lg italic text-clay-300">{site.tagline}.</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{site.description}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-300">Visit</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed">
            {address.street}
            <br />
            {address.city}, {address.state} {address.zip}
            {address.landmark ? (
              <>
                <br />
                <span className="text-sand-300">{address.landmark}</span>
              </>
            ) : null}
          </address>
          <a href={site.links.directions} className={`${linkClass} mt-1 text-sm`} target="_blank" rel="noopener noreferrer">
            Directions <ExternalIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-300">Hours</h2>
          <dl className="mt-3 text-sm leading-relaxed">
            {site.hours.map((h) => (
              <div key={h.label} className="flex justify-between gap-3">
                <dt>{h.label}</dt>
                <dd>
                  {formatTime(h.open)} – {formatTime(h.close)}
                </dd>
              </div>
            ))}
          </dl>
          {site.hoursNote ? <p className="mt-2 text-xs leading-relaxed text-sand-300">{site.hoursNote}</p> : null}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-300">Contact</h2>
          <ul className="mt-2 text-sm">
            <li>
              <a href={telHref(site.phone)} className={linkClass}>
                {formatPhone(site.phone)}
              </a>
            </li>
            {site.phoneAcceptsSms ? (
              <li>
                <a href={smsHref(site.phone)} className={linkClass}>
                  Text us
                </a>
              </li>
            ) : null}
            <li>
              <a href={mailtoHref(site.email)} className={`${linkClass} break-all`}>
                {site.email}
              </a>
            </li>
            {site.social.map((s) => (
              <li key={s.platform}>
                <a href={s.url} className={linkClass} target="_blank" rel="noopener noreferrer">
                  {s.platform === "instagram" ? `Instagram ${s.handle}` : "Facebook"}
                  <ExternalIcon className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
            <li>
              <a href={site.links.googleBusiness} className={linkClass} target="_blank" rel="noopener noreferrer">
                Google reviews <ExternalIcon className="h-3.5 w-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-sand-50/10">
        <Container className="flex flex-col gap-1 py-5 text-xs text-sand-300 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All times Eastern.
          </p>
          <p>
            {address.city}, {address.state}
          </p>
        </Container>
      </div>
    </footer>
  );
}
