"use client";

import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { formatPhone, mailtoHref, smsHref, telHref } from "@/lib/phone";
import { useAdminPreview } from "@/lib/admin-preview/store";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABEL } from "@/lib/admin-preview/types";
import { buttonClass } from "@/components/ButtonLink";
import { ChevronLeftIcon, MailIcon, MessageIcon, PhoneIcon } from "@/components/Icons";
import { adminCardClass } from "@/components/admin-preview/adminStyles";
import { STATUS_CHIP_CLASS } from "@/components/admin-preview/statusChip";

const BACK_LINK_CLASS =
  "inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink";

export function ApplicationDetail({ id }: { id: string }) {
  const { applications, setApplicationStatus } = useAdminPreview();
  const application = applications.find((app) => app.id === id);

  if (!application) {
    return (
      <div className="space-y-4">
        <Link href="/admin-preview/applications" className={BACK_LINK_CLASS}>
          <ChevronLeftIcon />
          Applications
        </Link>
        <p className="rounded-2xl bg-white p-4 text-sm text-ink-muted ring-1 ring-slate-500/15">
          Can&apos;t find that application — it may have been added in a session that has since reloaded.
          Applications in this preview reset when the page reloads.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link href="/admin-preview/applications" className={BACK_LINK_CLASS}>
        <ChevronLeftIcon />
        Applications
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display soft text-2xl font-medium text-slate-800">{application.fullName}</h1>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CHIP_CLASS[application.status]}`}>
            {APPLICATION_STATUS_LABEL[application.status]}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          {application.tournamentName} · {application.division}
        </p>
        <p className="mt-1 text-xs text-ink-muted">Submitted {formatDateTime(application.submittedAt)}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a href={telHref(application.phone)} className={`flex items-center gap-2 ${adminCardClass}`}>
          <PhoneIcon className="h-4 w-4 shrink-0 text-slate-800" />
          <span className="min-w-0 truncate text-sm font-medium">{formatPhone(application.phone)}</span>
        </a>
        <a href={smsHref(application.phone)} className={`flex items-center gap-2 ${adminCardClass}`}>
          <MessageIcon className="h-4 w-4 shrink-0 text-slate-800" />
          <span className="text-sm font-medium">Text</span>
        </a>
        {application.email ? (
          <a href={mailtoHref(application.email)} className={`col-span-2 flex items-center gap-2 ${adminCardClass}`}>
            <MailIcon className="h-4 w-4 shrink-0 text-slate-800" />
            <span className="min-w-0 truncate text-sm font-medium">{application.email}</span>
          </a>
        ) : null}
      </div>

      <dl className={`grid grid-cols-2 gap-x-4 gap-y-3 text-sm ${adminCardClass}`}>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">Division</dt>
          <dd className="mt-0.5 font-medium">{application.division}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">Level</dt>
          <dd className="mt-0.5 font-medium">{application.level ?? "Not given"}</dd>
        </div>
        {application.partnerName ? (
          <div className="col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">Partner</dt>
            <dd className="mt-0.5 font-medium">{application.partnerName}</dd>
          </div>
        ) : null}
        {application.notes ? (
          <div className="col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">Notes</dt>
            <dd className="mt-0.5 leading-relaxed">{application.notes}</dd>
          </div>
        ) : null}
      </dl>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">Update status</h2>
        <div role="group" aria-label="Application status" className="mt-2 flex flex-wrap gap-2">
          {APPLICATION_STATUSES.map((status) => {
            const active = application.status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setApplicationStatus(application.id, status)}
                aria-pressed={active}
                className={
                  active
                    ? buttonClass("primary", "md")
                    : buttonClass("quiet", "md")
                }
              >
                {APPLICATION_STATUS_LABEL[status]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
