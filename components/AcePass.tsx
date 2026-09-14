import type { PriceItem, SiteInfo } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { telHref } from "@/lib/phone";
import { ButtonLink } from "@/components/ButtonLink";
import { BallMark, CheckIcon, PhoneIcon } from "@/components/Icons";

/** The club's signature offer, styled like a punch card. */
export function AcePass({ item, site }: { item: PriceItem; site: SiteInfo }) {
  const visits = item.visits ?? 5;
  return (
    <article
      aria-labelledby="ace-pass-title"
      className="relative rounded-3xl border-2 border-dashed border-clay-500 bg-sand-100 p-6 shadow-lift sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
            {site.shortName} · {item.unit}
          </p>
          <h3
            id="ace-pass-title"
            className="font-display soft mt-1 text-4xl font-semibold tracking-tight text-court-900"
          >
            {item.name}
          </h3>
        </div>
        <p className="text-right">
          <span className="font-display block text-4xl font-medium leading-none text-clay-700">
            {formatPrice(item.price)}
          </span>
          <span className="mt-1 block text-xs text-ink-muted">{item.unit}</span>
        </p>
      </div>

      <ul aria-label={`${visits} visits`} className="mt-6 flex gap-2">
        {Array.from({ length: visits }, (_, i) => (
          <li key={i} className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-clay-500/50">
            <BallMark className="h-7 w-7" />
          </li>
        ))}
      </ul>

      <p className="mt-6 leading-relaxed">{item.description}</p>
      {item.details ? (
        <ul className="mt-4 space-y-1.5 text-[0.9375rem] text-ink-muted">
          {item.details.map((d) => (
            <li key={d} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-court-600" />
              {d}
            </li>
          ))}
        </ul>
      ) : null}

      <ButtonLink href={telHref(site.phone)} className="mt-7 w-full sm:w-auto" size="lg" external>
        <PhoneIcon />
        Call to get a pass
      </ButtonLink>
    </article>
  );
}
