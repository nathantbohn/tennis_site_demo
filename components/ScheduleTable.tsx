import type { ScheduleDay } from "@/lib/content";
import type { ScheduleKind } from "@/data/types";
import { DAY_LABELS, formatTimeRange } from "@/lib/format";

export const KIND_META: Record<ScheduleKind, { label: string; dot: string }> = {
  clinic: { label: "Clinic", dot: "bg-lime-600" },
  lesson: { label: "Lesson", dot: "bg-lime-300 ring-1 ring-slate-500/30" },
  junior: { label: "Juniors", dot: "bg-cream-100 ring-1 ring-slate-500/30" },
  league: { label: "League", dot: "bg-slate-800" },
  social: { label: "Social play", dot: "bg-aqua-200 ring-1 ring-slate-500/30" },
  open: { label: "Open play", dot: "bg-slate-400 ring-1 ring-ink/20" },
};

function KindDot({ kind }: { kind: ScheduleKind }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${KIND_META[kind].dot}`}
      title={KIND_META[kind].label}
      aria-label={KIND_META[kind].label}
      role="img"
    />
  );
}

/**
 * One day of the weekly schedule. A real table from 640px up; below that,
 * the same rows stack into cards so nothing needs sideways scrolling.
 */
export function ScheduleDaySection({ group }: { group: ScheduleDay }) {
  const label = DAY_LABELS[group.day];
  const headingId = `day-${group.day.toLowerCase()}`;
  return (
    <section aria-labelledby={headingId} className="scroll-mt-32 md:scroll-mt-24" id={group.day.toLowerCase()}>
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-slate-800 pb-2">
        <h2 id={headingId} className="font-display soft text-3xl font-medium tracking-tight text-slate-800">
          {label}
        </h2>
        <p className="text-sm text-ink-muted">
          {group.entries.length} {group.entries.length === 1 ? "session" : "sessions"}
        </p>
      </div>

      <table className="hidden w-full text-left text-[0.9375rem] sm:table">
        <caption className="sr-only">{label} schedule</caption>
        <thead>
          <tr className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            <th scope="col" className="w-36 py-3 pr-4 font-semibold">
              Time
            </th>
            <th scope="col" className="py-3 pr-4 font-semibold">
              Activity
            </th>
            <th scope="col" className="w-32 py-3 pr-4 font-semibold">
              Court
            </th>
            <th scope="col" className="py-3 font-semibold">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-500/20">
          {group.entries.map((entry) => (
            <tr key={entry.id} className="align-top">
              <td className="whitespace-nowrap py-3.5 pr-4 font-semibold tabular-nums">
                {formatTimeRange(entry.start, entry.end)}
              </td>
              <td className="py-3.5 pr-4">
                <span className="flex items-center gap-2 font-medium">
                  <KindDot kind={entry.kind} />
                  {entry.activity}
                </span>
              </td>
              <td className="py-3.5 pr-4">{entry.court}</td>
              <td className="py-3.5 text-ink-muted">{entry.notes ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-slate-500/20 sm:hidden">
        {group.entries.map((entry) => (
          <li key={entry.id} className="py-4">
            <p className="flex items-center gap-2 text-sm font-semibold tabular-nums text-slate-800">
              {formatTimeRange(entry.start, entry.end)}
              <span className="text-ink-muted">·</span>
              <span className="font-medium text-ink-muted">{entry.court}</span>
            </p>
            <p className="mt-1 flex items-center gap-2 text-lg font-medium leading-snug">
              <KindDot kind={entry.kind} />
              {entry.activity}
            </p>
            {entry.notes ? <p className="mt-1 text-[0.9375rem] text-ink-muted">{entry.notes}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ScheduleLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted" aria-label="Legend">
      {(Object.keys(KIND_META) as ScheduleKind[]).map((kind) => (
        <li key={kind} className="flex items-center gap-2">
          <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-full ${KIND_META[kind].dot}`} />
          {KIND_META[kind].label}
        </li>
      ))}
    </ul>
  );
}
