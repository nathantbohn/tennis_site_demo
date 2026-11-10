"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import type { Tournament } from "@/data/types";
import { submitTournamentApplication, type ApplicationReceipt } from "@/lib/applications";
import { formatDateRange, formatMonthDay } from "@/lib/format";
import { formatPhone, normalizeToE164 } from "@/lib/phone";
import { buttonClass } from "@/components/ButtonLink";
import { AlertIcon, CheckIcon } from "@/components/Icons";

type Values = {
  fullName: string;
  phone: string;
  email: string;
  tournamentId: string;
  division: string;
  partnerName: string;
  level: string;
  notes: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const LEVELS = ["Not sure yet", "2.5 (new to the game)", "3.0", "3.5", "4.0", "4.5 or above"];

type Owner = { phone: string; email: string; firstName: string };

function validate(values: Values, tournament: Tournament | undefined): Errors {
  const errors: Errors = {};
  if (values.fullName.trim().length < 2) errors.fullName = "Enter your full name.";
  if (!values.phone.trim()) {
    errors.phone = "Enter a mobile number so we can confirm by text.";
  } else if (!normalizeToE164(values.phone)) {
    errors.phone = "Enter a 10-digit US number, like (386) 555-0100.";
  }
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "That email does not look right. It is optional, so you can leave it blank.";
  }
  if (!tournament) errors.tournamentId = "Choose a tournament.";
  if (!values.division) errors.division = "Choose a division.";
  return errors;
}

const inputClass =
  "block w-full min-h-12 rounded-xl border border-slate-500/30 bg-white px-4 text-base text-ink placeholder:text-ink-muted/70 focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/25 aria-[invalid=true]:border-2 aria-[invalid=true]:border-red-700";

function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (props: {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    "aria-required"?: boolean;
  }) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
        {optional ? (
          <>
            {" "}
            <span className="font-normal text-ink-muted">(optional)</span>
          </>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">
        {children({
          id,
          "aria-describedby": describedBy,
          "aria-invalid": error ? true : undefined,
          "aria-required": !optional,
        })}
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * Tournament application. Client-side only in Phase 1: validates, normalizes
 * the phone number to E.164 and hands off to the submit stub.
 */
export function TournamentForm({ tournaments, owner }: { tournaments: Tournament[]; owner: Owner }) {
  const uid = useId();
  const [values, setValues] = useState<Values>({
    fullName: "",
    phone: "",
    email: "",
    tournamentId: tournaments[0]?.id ?? "",
    division: "",
    partnerName: "",
    level: LEVELS[0],
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const tournament = tournaments.find((t) => t.id === values.tournamentId);
  const isDoubles = /doubles/i.test(values.division);
  const errorCount = Object.keys(errors).length;

  // The form is long and the button is at the bottom, so on a phone the swap to
  // the success panel would leave the visitor looking at the footer. Bring the
  // panel up instead: scrollIntoView stops below the sticky header because it
  // honours the page's scroll-padding-top, and it follows the CSS
  // scroll-behavior, so visitors who prefer reduced motion get a jump, not a
  // glide. Focus then moves to the heading without a second scroll.
  useEffect(() => {
    if (status !== "done") return;
    panelRef.current?.scrollIntoView({ block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [status]);

  function update(field: keyof Values) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const next = e.target.value;
      setValues((v) => (field === "tournamentId" ? { ...v, tournamentId: next, division: "" } : { ...v, [field]: next }));
      if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values, tournament);
    const cleaned = Object.fromEntries(Object.entries(nextErrors).filter(([, v]) => v)) as Errors;
    if (Object.keys(cleaned).length > 0 || !tournament) {
      setErrors(cleaned);
      const first = Object.keys(cleaned)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    const phone = normalizeToE164(values.phone) as string;
    const result = await submitTournamentApplication(
      {
        fullName: values.fullName.trim(),
        phone,
        email: values.email.trim() || undefined,
        tournamentId: tournament.id,
        division: values.division,
        partnerName: isDoubles && values.partnerName.trim() ? values.partnerName.trim() : undefined,
        level: values.level === LEVELS[0] ? undefined : values.level,
        notes: values.notes.trim() || undefined,
      },
      tournament,
      { ownerPhone: owner.phone, ownerEmail: owner.email },
    );
    setReceipt(result);
    setStatus("done");
  }

  /** A valid number becomes (386) 555-0100 on blur. Anything else stays as typed, so the error can point at it. */
  function tidyPhone() {
    setValues((v) => {
      const e164 = normalizeToE164(v.phone);
      return e164 ? { ...v, phone: formatPhone(e164) } : v;
    });
  }

  function reset() {
    setValues((v) => ({ ...v, fullName: "", phone: "", email: "", division: "", partnerName: "", notes: "" }));
    setErrors({});
    setReceipt(null);
    setStatus("idle");
  }

  if (tournaments.length === 0) {
    return (
      <p className="rounded-2xl bg-sage-100 p-6 leading-relaxed">
        No tournaments are taking applications right now. Text {owner.firstName} at{" "}
        <a href={`sms:${owner.phone}`} className="font-medium underline underline-offset-4">
          {formatPhone(owner.phone)}
        </a>{" "}
        to hear about the next one.
      </p>
    );
  }

  if (status === "done" && receipt && tournament) {
    const app = receipt.application;
    return (
      <div ref={panelRef} role="status" className="rounded-3xl bg-lime-100 p-6 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-500 text-ink">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="font-display soft mt-5 text-3xl font-medium tracking-tight text-slate-800"
        >
          Got it, {app.fullName.split(" ")[0]}.
        </h3>
        <p className="mt-3 leading-relaxed">
          {`${owner.firstName} will text ${formatPhone(app.phone)} to confirm your spot in ${tournament.name} (${app.division}).`}
        </p>
        <dl className="mt-6 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">Dates</dt>
            <dd className="font-medium">{formatDateRange(tournament.startDate, tournament.endDate)}</dd>
          </div>
          {app.partnerName ? (
            <div>
              <dt className="text-ink-muted">Partner</dt>
              <dd className="font-medium">{app.partnerName}</dd>
            </div>
          ) : null}
          {app.level ? (
            <div>
              <dt className="text-ink-muted">Level</dt>
              <dd className="font-medium">{app.level}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={reset} className={buttonClass("primary")}>
            Enter another player
          </button>
          <Link href="/" className={buttonClass("quiet")}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6" aria-describedby={`${uid}-intro`}>
      <p id={`${uid}-intro`} className="text-sm text-ink-muted">
        Your mobile number is how we confirm your spot. Email is optional.
      </p>

      {errorCount > 0 ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-r-xl border-l-4 border-red-700 bg-white px-4 py-3 text-sm font-medium text-red-700"
        >
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Please fix the {errorCount === 1 ? "highlighted field" : `${errorCount} highlighted fields`} below.</span>
        </p>
      ) : null}

      <Field id={`${uid}-fullName`} label="Full name" error={errors.fullName}>
        {(a) => (
          <input
            {...a}
            type="text"
            name="fullName"
            autoComplete="name"
            className={inputClass}
            value={values.fullName}
            onChange={update("fullName")}
          />
        )}
      </Field>

      <Field
        id={`${uid}-phone`}
        label="Mobile phone"
        hint="We text this number to confirm."
        error={errors.phone}
      >
        {(a) => (
          <input
            {...a}
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(386) 555-0100"
            className={inputClass}
            value={values.phone}
            onChange={update("phone")}
            onBlur={tidyPhone}
          />
        )}
      </Field>

      <Field id={`${uid}-email`} label="Email" optional error={errors.email}>
        {(a) => (
          <input
            {...a}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            className={inputClass}
            value={values.email}
            onChange={update("email")}
          />
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${uid}-tournamentId`} label="Tournament" error={errors.tournamentId}>
          {(a) => (
            <select
              {...a}
              name="tournamentId"
              className={inputClass}
              value={values.tournamentId}
              onChange={update("tournamentId")}
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {`${t.name} · ${formatMonthDay(t.startDate)}`}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field id={`${uid}-division`} label="Division" error={errors.division}>
          {(a) => (
            <select
              {...a}
              name="division"
              className={inputClass}
              value={values.division}
              onChange={update("division")}
            >
              <option value="">Choose a division</option>
              {(tournament?.divisions ?? []).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      {isDoubles ? (
        <Field
          id={`${uid}-partnerName`}
          label="Partner's name"
          optional
          hint="Leave blank and we will help you find one."
        >
          {(a) => (
            <input
              {...a}
              type="text"
              name="partnerName"
              autoComplete="off"
              className={inputClass}
              value={values.partnerName}
              onChange={update("partnerName")}
            />
          )}
        </Field>
      ) : null}

      <Field id={`${uid}-level`} label="Your level" hint="NTRP rating if you know it. A best guess is fine.">
        {(a) => (
          <select {...a} name="level" className={inputClass} value={values.level} onChange={update("level")}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field id={`${uid}-notes`} label="Anything else" optional>
        {(a) => (
          <textarea
            {...a}
            name="notes"
            rows={3}
            className={`${inputClass} py-3`}
            value={values.notes}
            onChange={update("notes")}
          />
        )}
      </Field>

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={buttonClass("primary", "lg", "w-full disabled:opacity-60 sm:w-auto")}
        >
          {status === "submitting" ? "Sending…" : "Send application"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          By sending this you agree that {owner.firstName} may call or text you about this event.
          Entry fees are collected at the club.
        </p>
      </div>
    </form>
  );
}
