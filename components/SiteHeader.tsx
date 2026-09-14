import Link from "next/link";
import type { SiteInfo } from "@/data/types";
import { BOOK_HREF } from "@/lib/nav";
import { telHref } from "@/lib/phone";
import { BallMark, PhoneIcon } from "@/components/Icons";
import { ButtonLink } from "@/components/ButtonLink";
import { NavLinks } from "@/components/NavLinks";

/**
 * Sticky on every screen size. On phones it is two rows: wordmark plus the
 * Call and Book actions, then the five page links. On wider screens the
 * same nav sits between them in a single row.
 */
export function SiteHeader({ site }: { site: SiteInfo }) {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-center px-4 sm:px-6 md:grid-cols-[auto_1fr_auto] md:gap-x-6">
        <Link
          href="/"
          className="row-start-1 flex min-h-14 items-center gap-2.5 py-2 md:min-h-16"
          aria-label={`${site.name} home`}
        >
          <BallMark className="h-8 w-8 shrink-0" />
          <span className="font-display soft text-[1.2rem] font-semibold leading-none tracking-tight text-court-900 sm:text-[1.35rem]">
            <span className="sm:hidden">{site.shortName}</span>
            <span className="hidden sm:inline">{site.name}</span>
          </span>
        </Link>

        <div className="col-start-2 row-start-1 flex items-center gap-2 md:col-start-3">
          <ButtonLink href={telHref(site.phone)} variant="quiet" className="px-3.5" external>
            <PhoneIcon className="h-4.5 w-4.5" />
            Call
          </ButtonLink>
          <ButtonLink href={BOOK_HREF} variant="primary" className="px-4">
            Book a court
          </ButtonLink>
        </div>

        <NavLinks className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1" />
      </div>
    </header>
  );
}
