/**
 * The single exit for every outbound message the site sends.
 *
 * Phase 1: logs. Phase 2: "email" goes to the owner via an email provider.
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
  provider: "console";
};

export async function notify(
  to: string,
  message: string,
  channel: NotifyChannel,
): Promise<NotifyResult> {
  const sentAt = new Date().toISOString();
  console.info(`[notify:${channel}] to=${to} at=${sentAt}\n${message}`);
  return { ok: true, channel, to, sentAt, provider: "console" };
}
