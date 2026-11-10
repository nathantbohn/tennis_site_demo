"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

/** The site's one and only navigation. Client-side only for the active state. */
export function NavLinks({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={className}>
      {/*
        15px at every width. Five links at 15px need about 318px of text, so
        the side padding gives way first (2px on a 375px phone, growing as
        the screen does) instead of the type size. Under 375px the letter
        spacing tightens a touch so a 360px phone still gets one row; below
        ~350px the links wrap to a second row rather than shrinking or running
        off the screen. From md the header is a single row with the logo and
        buttons either side, which leaves the nav about 360px at 768px, so it
        stays tight until lg. The ul's negative margin matches the link
        padding so the first word lines up with the page gutter.
      */}
      <ul className="-mx-0.5 flex flex-wrap items-stretch justify-between min-[390px]:-mx-1 xs:-mx-1.5 md:mx-0 md:flex-nowrap md:justify-center lg:gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative flex min-h-11 items-center whitespace-nowrap px-0.5 text-[0.9375rem] font-medium tracking-tight text-aqua-100 transition-colors hover:text-white aria-[current=page]:text-white after:absolute after:inset-x-0.5 after:bottom-0 after:h-[3px] after:rounded-full after:bg-lime-500 after:opacity-0 after:transition-opacity aria-[current=page]:after:opacity-100 min-[375px]:tracking-normal min-[390px]:px-1 min-[390px]:after:inset-x-1 xs:px-1.5 xs:after:inset-x-1.5 md:px-1 md:after:inset-x-1 lg:px-3 lg:after:inset-x-2"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
