import Image from "next/image";
import type { SiteInfo } from "@/data/types";
import { formatTime } from "@/lib/format";
import { formatPhone, mailtoHref, smsHref, telHref } from "@/lib/phone";
import { Container } from "@/components/Container";
import { ExternalIcon } from "@/components/Icons";
import logo from "@/public/logo.png";

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 text-sage-100 underline decoration-sage-100/40 underline-offset-4 hover:decoration-white hover:text-white";

export function SiteFooter({ site }: { site: SiteInfo }) {
  const { address } = site;
  return (
    <footer className="on-dark mt-20 bg-slate-800 text-sage-100">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8">
        <div>
          <p className="flex items-center gap-2.5">
            <Image src={logo} alt="" className="h-10 w-10" />
            <span className="font-display soft text-2xl font-semibold text-white">{site.name}</span>
          </p>
          <p className="mt-3 font-display text-lg italic text-lime-300">{site.tagline}.</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{site.description}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Visit</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed">
            {address.street}
            <br />
            {address.city}, {address.state} {address.zip}
            {address.landmark ? (
              <>
                <br />
                <span className="text-sage-100/80">{address.landmark}</span>
              </>
            ) : null}
          </address>
          <a href={site.links.directions} className={`${linkClass} mt-1 text-sm`} target="_blank" rel="noopener noreferrer">
            Directions <ExternalIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Hours</h2>
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
          {site.hoursNote ? <p className="mt-2 text-xs leading-relaxed text-sage-100/80">{site.hoursNote}</p> : null}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Contact</h2>
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
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-1 py-5 text-xs text-sage-100/80 sm:flex-row sm:justify-between">
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
