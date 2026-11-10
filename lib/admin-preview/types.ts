/**
 * Types for the /admin-preview demo only. Nothing here is the real Phase 2
 * data contract — that will be designed against Postgres/Prisma when Phase 2
 * actually starts. This just needs a plausible shape for tournament
 * applications, which Phase 1 never persists (the real form only logs and
 * shows a receipt — see lib/applications.ts).
 */

export type ApplicationStatus = "new" | "confirmed" | "waitlisted" | "declined";

export const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  "new",
  "confirmed",
  "waitlisted",
  "declined",
] as const;

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  waitlisted: "Waitlisted",
  declined: "Declined",
};

/** Same fields the real tournament form collects, plus what an owner needs to act on one. */
export type AdminApplication = {
  id: string;
  fullName: string;
  /** E.164, matching the real TournamentApplication shape. */
  phone: string;
  email?: string;
  tournamentId: string;
  /** Denormalized so the list and detail view don't need a join. */
  tournamentName: string;
  division: string;
  partnerName?: string;
  level?: string;
  notes?: string;
  status: ApplicationStatus;
  /** ISO 8601 in UTC, same convention as the rest of the site. */
  submittedAt: string;
};
