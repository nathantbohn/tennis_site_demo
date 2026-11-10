/**
 * The single exit for every outbound message the site sends.
 *
 * Phase 1: a stub. It sends nothing and logs nothing: the tournament form
 * runs in the browser, so a log line here would print the applicant's name,
 * phone and notes in the visitor's console and ship that code in the client
 * bundle. Phase 2: "email" goes to the owner via an email provider.
 * Phase 3: "sms" goes out through Twilio for booking confirmations and
 * reminders. Callers never talk to a provider directly.
 */
export type NotifyChannel = "sms" | "email";

export type NotifyResult = {
  ok: boolean;
  channel: NotifyChannel;
  /** E.164 phone for sms, email address for email. */
  to: string;
  /** ISO 8601, UTC. */
  sentAt: string;
  /** "none" until a real provider is wired in (Phase 2). */
  provider: "none";
};

export async function notify(
  to: string,
  // Unused until a provider exists. Do not log it: it can hold applicant details.
  _message: string,
  channel: NotifyChannel,
): Promise<NotifyResult> {
  return { ok: true, channel, to, sentAt: new Date().toISOString(), provider: "none" };
}
