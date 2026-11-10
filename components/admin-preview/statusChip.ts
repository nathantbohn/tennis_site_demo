import type { ApplicationStatus } from "@/lib/admin-preview/types";

/** Chip styling per status. Deliberately no red anywhere in this preview — the site reserves its one dark red for a single home-page heading, not spread across UI like a status color. */
export const STATUS_CHIP_CLASS: Record<ApplicationStatus, string> = {
  new: "bg-cream-100 text-slate-800 ring-1 ring-inset ring-slate-500/25",
  confirmed: "bg-lime-500 text-ink",
  waitlisted: "bg-aqua-100 text-slate-800 ring-1 ring-inset ring-slate-500/25",
  declined: "bg-slate-500/15 text-ink-muted ring-1 ring-inset ring-slate-500/25",
};
