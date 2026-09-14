/**
 * Tournament application handling.
 *
 * Phase 1: runs in the browser, logs the application and the messages that
 * would be sent, and returns a receipt so the form can show its success state.
 * Phase 2: becomes a Server Action that emails the owner and stores the
 * submission. The input and receipt shapes stay the same.
 */
import type { Tournament, TournamentApplication } from "@/data/types";
import { formatPhone } from "@/lib/phone";
import { notify } from "@/lib/notify";

export type ApplicationInput = Omit<TournamentApplication, "submittedAt">;

export type ApplicationReceipt = {
  id: string;
  application: TournamentApplication;
};

type Recipients = {
  /** Owner's phone, E.164. */
  ownerPhone: string;
  ownerEmail: string;
};

export async function submitTournamentApplication(
  input: ApplicationInput,
  tournament: Tournament,
  recipients: Recipients,
): Promise<ApplicationReceipt> {
  const application: TournamentApplication = {
    ...input,
    submittedAt: new Date().toISOString(),
  };
  const id = `app_${application.submittedAt.replace(/\D/g, "").slice(0, 14)}`;

  console.info("[applications] new tournament application", { id, ...application });

  const summary = [
    `New application for ${tournament.name}`,
    `${application.fullName} · ${formatPhone(application.phone)}`,
    `${application.division}${application.partnerName ? ` with ${application.partnerName}` : ""}`,
    application.level ? `Level: ${application.level}` : null,
    application.email ? `Email: ${application.email}` : null,
    application.notes ? `Notes: ${application.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await notify(recipients.ownerPhone, summary, "sms");
  await notify(recipients.ownerEmail, summary, "email");
  await notify(
    application.phone,
    `Thanks ${application.fullName.split(" ")[0]}, we got your application for ${tournament.name} (${application.division}). We will text you to confirm your spot.`,
    "sms",
  );

  return { id, application };
}
