/** Shared Tailwind classes for the /admin-preview forms and cards, so the schedule and pricing editors read as one system. */
export const adminInputClass =
  "block w-full min-h-11 rounded-lg border border-slate-500/30 bg-white px-3 text-[0.9375rem] text-ink placeholder:text-ink-muted/70 focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/25 aria-[invalid=true]:border-slate-800 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-slate-800/25";

export const adminLabelClass = "block text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted";

export const adminCardClass = "rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgb(16_22_26/0.08)] ring-1 ring-slate-500/15";

export const adminFormCardClass = "rounded-2xl bg-aqua-100 p-4 ring-1 ring-inset ring-slate-500/25";

/** A compact, square icon-only button (edit/delete) — the same "quiet" treatment as ButtonLink's quiet variant, just sized for an icon instead of a label. */
export const adminIconButtonClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink ring-1 ring-inset ring-slate-500/40 transition-colors hover:bg-sage-100 active:bg-aqua-100";
