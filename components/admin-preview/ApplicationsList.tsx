"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDateTime } from "@/lib/format";
import { formatPhone } from "@/lib/phone";
import { useAdminPreview } from "@/lib/admin-preview/store";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABEL, type ApplicationStatus } from "@/lib/admin-preview/types";
import { adminCardClass } from "@/components/admin-preview/adminStyles";
import { STATUS_CHIP_CLASS } from "@/components/admin-preview/statusChip";

type Filter = "all" | ApplicationStatus;

/** Read-only list of applications, newest first, with a status filter. Tap a row for the detail view. */
export function ApplicationsList() {
  const { applications } = useAdminPreview();
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = [...applications].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const visible = filter === "all" ? sorted : sorted.filter((app) => app.status === filter);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display soft text-2xl font-medium text-slate-800">Tournament applications</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {applications.length} {applications.length === 1 ? "application" : "applications"}. Tap one for details.
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="group" aria-label="Filter by status" className="flex w-max gap-1.5 sm:w-full sm:flex-wrap">
          {(["all", ...APPLICATION_STATUSES] as const).map((value) => {
            const active = filter === value;
            const label = value === "all" ? "All" : APPLICATION_STATUS_LABEL[value];
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={active}
                className={`min-h-9 shrink-0 rounded-full px-3.5 text-sm font-medium ring-1 ring-inset transition-colors ${
                  active
                    ? "bg-slate-800 text-white ring-slate-800"
                    : "bg-white text-ink-muted ring-slate-500/30 hover:bg-sage-100"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-ink-muted ring-1 ring-slate-500/15">
          No applications match this filter.
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((app) => (
            <li key={app.id}>
              <Link
                href={`/admin-preview/applications/${app.id}`}
                className={`block ${adminCardClass} transition-colors hover:bg-sage-100`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium">{app.fullName}</p>
                    <p className="text-sm text-ink-muted">
                      {app.tournamentName} · {app.division}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {formatPhone(app.phone)} · {formatDateTime(app.submittedAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CHIP_CLASS[app.status]}`}
                  >
                    {APPLICATION_STATUS_LABEL[app.status]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
