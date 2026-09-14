/** The five pages. This is the only nav on the site; nothing duplicates it. */
export type NavItem = { href: string; label: string };

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/schedule", label: "Schedule" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/contact", label: "Contact" },
] as const;

/** Where "Book a court" goes until online booking exists (Phase 3). */
export const BOOK_HREF = "/contact#book";
