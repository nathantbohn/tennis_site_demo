"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

/** The site's one and only navigation. Client-side only for the active state. */
export function NavLinks({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={className}>
      <ul className="-mx-1.5 flex items-stretch justify-between md:mx-0 md:justify-center md:gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative flex min-h-11 items-center whitespace-nowrap px-1.5 text-[0.8125rem] font-medium text-aqua-100 transition-colors hover:text-white aria-[current=page]:text-white after:absolute after:inset-x-1.5 after:bottom-0 after:h-[3px] after:rounded-full after:bg-lime-500 after:opacity-0 after:transition-opacity aria-[current=page]:after:opacity-100 xs:px-2 xs:text-sm xs:after:inset-x-2 md:px-3 md:text-[0.9375rem]"
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
