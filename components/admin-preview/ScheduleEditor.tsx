"use client";

import { useId, useState, type FormEvent } from "react";
import { DAYS_OF_WEEK, type DayOfWeek, type ScheduleEntry, type ScheduleKind } from "@/data/types";
import { DAY_LABELS, formatTimeRange } from "@/lib/format";
import { useAdminPreview } from "@/lib/admin-preview/store";
import { buttonClass } from "@/components/ButtonLink";
import { KIND_META } from "@/components/ScheduleTable";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import {
  adminCardClass,
  adminFormCardClass,
  adminIconButtonClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin-preview/adminStyles";

type FormValues = {
  day: DayOfWeek;
  start: string;
  end: string;
  activity: string;
  court: string;
  kind: ScheduleKind;
  notes: string;
};

const KIND_OPTIONS = Object.keys(KIND_META) as ScheduleKind[];

function emptyValues(day: DayOfWeek = "Mon"): FormValues {
  return { day, start: "08:00", end: "09:00", activity: "", court: "", kind: "clinic", notes: "" };
}

function fromEntry(entry: ScheduleEntry): FormValues {
  return {
    day: entry.day,
    start: entry.start,
    end: entry.end,
    activity: entry.activity,
    court: entry.court,
    kind: entry.kind,
    notes: entry.notes ?? "",
  };
}

function validate(values: FormValues): string | null {
  if (!values.activity.trim()) return "Enter what this session is.";
  if (!values.court.trim()) return "Enter a court.";
  if (values.start >= values.end) return "End time must be after the start time.";
  return null;
}

function RowForm({
  title,
  initial,
  onCancel,
  onSubmit,
}: {
  title: string;
  initial: FormValues;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
}) {
  const uid = useId();
  const [values, setValues] = useState<FormValues>(initial);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problem = validate(values);
    if (problem) {
      setError(problem);
      return;
    }
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className={`${adminFormCardClass} space-y-3`} aria-label={title}>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {error ? (
        <p role="alert" className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-500/30">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${uid}-day`} className={adminLabelClass}>
            Day
          </label>
          <select
            id={`${uid}-day`}
            className={`${adminInputClass} mt-1`}
            value={values.day}
            onChange={(e) => setValues((v) => ({ ...v, day: e.target.value as DayOfWeek }))}
          >
            {DAYS_OF_WEEK.map((day) => (
              <option key={day} value={day}>
                {DAY_LABELS[day]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-kind`} className={adminLabelClass}>
            Kind
          </label>
          <select
            id={`${uid}-kind`}
            className={`${adminInputClass} mt-1`}
            value={values.kind}
            onChange={(e) => setValues((v) => ({ ...v, kind: e.target.value as ScheduleKind }))}
          >
            {KIND_OPTIONS.map((kind) => (
              <option key={kind} value={kind}>
                {KIND_META[kind].label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-start`} className={adminLabelClass}>
            Start
          </label>
          <input
            id={`${uid}-start`}
            type="time"
            className={`${adminInputClass} mt-1`}
            value={values.start}
            onChange={(e) => setValues((v) => ({ ...v, start: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-end`} className={adminLabelClass}>
            End
          </label>
          <input
            id={`${uid}-end`}
            type="time"
            className={`${adminInputClass} mt-1`}
            value={values.end}
            onChange={(e) => setValues((v) => ({ ...v, end: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-activity`} className={adminLabelClass}>
          Activity
        </label>
        <input
          id={`${uid}-activity`}
          type="text"
          className={`${adminInputClass} mt-1`}
          value={values.activity}
          onChange={(e) => setValues((v) => ({ ...v, activity: e.target.value }))}
          placeholder="Adult clinic"
        />
      </div>

      <div>
        <label htmlFor={`${uid}-court`} className={adminLabelClass}>
          Court
        </label>
        <input
          id={`${uid}-court`}
          type="text"
          className={`${adminInputClass} mt-1`}
          value={values.court}
          onChange={(e) => setValues((v) => ({ ...v, court: e.target.value }))}
          placeholder="Court 1"
        />
      </div>

      <div>
        <label htmlFor={`${uid}-notes`} className={adminLabelClass}>
          Notes (optional)
        </label>
        <input
          id={`${uid}-notes`}
          type="text"
          className={`${adminInputClass} mt-1`}
          value={values.notes}
          onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          placeholder="Levels 3.0–3.5. Drop in, $25."
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" className={buttonClass("primary", "md", "flex-1")}>
          Save
        </button>
        <button type="button" onClick={onCancel} className={buttonClass("quiet", "md", "flex-1")}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/** Add/edit/delete the weekly schedule. Grouped by day, one form open at a time. */
export function ScheduleEditor() {
  const { schedule, addScheduleEntry, updateScheduleEntry, deleteScheduleEntry } = useAdminPreview();
  const [editing, setEditing] = useState<"new" | string | null>(null);

  const groups = DAYS_OF_WEEK.map((day) => ({
    day,
    entries: schedule.filter((entry) => entry.day === day).sort((a, b) => a.start.localeCompare(b.start)),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display soft text-2xl font-medium text-slate-800">Schedule</h1>
          <p className="mt-1 text-sm text-ink-muted">Add, edit or remove rows. Changes only exist in this tab.</p>
        </div>
        {editing === null ? (
          <button type="button" onClick={() => setEditing("new")} className={buttonClass("primary", "md", "shrink-0")}>
            <PlusIcon />
            Add
          </button>
        ) : null}
      </div>

      {editing === "new" ? (
        <RowForm
          title="New schedule row"
          initial={emptyValues()}
          onCancel={() => setEditing(null)}
          onSubmit={(values) => {
            addScheduleEntry({ ...values, notes: values.notes.trim() || undefined });
            setEditing(null);
          }}
        />
      ) : null}

      {groups.map((group) => (
        <section key={group.day} aria-labelledby={`day-${group.day}`}>
          <h2 id={`day-${group.day}`} className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-800">
            {DAY_LABELS[group.day]}
          </h2>
          <div className="mt-2 space-y-2">
            {group.entries.length === 0 && editing !== "new" ? (
              <p className="text-sm text-ink-muted">Nothing scheduled.</p>
            ) : null}
            {group.entries.map((entry) =>
              editing === entry.id ? (
                <RowForm
                  key={entry.id}
                  title="Edit schedule row"
                  initial={fromEntry(entry)}
                  onCancel={() => setEditing(null)}
                  onSubmit={(values) => {
                    updateScheduleEntry(entry.id, { ...values, notes: values.notes.trim() || undefined });
                    setEditing(null);
                  }}
                />
              ) : (
                <article key={entry.id} className={adminCardClass}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold tabular-nums text-slate-800">
                        {formatTimeRange(entry.start, entry.end)}
                        <span
                          aria-hidden="true"
                          className={`inline-block h-2 w-2 shrink-0 rounded-full ${KIND_META[entry.kind].dot}`}
                        />
                        <span className="font-normal text-ink-muted">{KIND_META[entry.kind].label}</span>
                      </p>
                      <p className="mt-0.5 truncate text-base font-medium">{entry.activity}</p>
                      <p className="text-sm text-ink-muted">{entry.court}</p>
                      {entry.notes ? <p className="mt-1 text-sm text-ink-muted">{entry.notes}</p> : null}
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditing(entry.id)}
                        aria-label={`Edit ${entry.activity}`}
                        className={adminIconButtonClass}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteScheduleEntry(entry.id)}
                        aria-label={`Delete ${entry.activity}`}
                        className={adminIconButtonClass}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
