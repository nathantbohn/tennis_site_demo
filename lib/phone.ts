/**
 * Phone numbers are the universal identity on this site (members, owner,
 * applicants) and are always stored in E.164, e.g. "+13868379123".
 *
 * Phase 1 only needs North American numbers, so this is a small hand-rolled
 * normalizer rather than a libphonenumber dependency.
 */

/** Returns the E.164 form of a US/Canada number, or null if it is not one. */
export function normalizeToE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  let national: string;
  if (digits.length === 10) {
    national = digits;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    national = digits.slice(1);
  } else {
    return null;
  }
  // NANP: area code and exchange cannot start with 0 or 1.
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(national)) return null;
  return `+1${national}`;
}

/** "+13868379123" → "(386) 837-9123". Non-NANP numbers are returned as-is. */
export function formatPhone(e164: string): string {
  const match = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(e164);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : e164;
}

export function telHref(e164: string): string {
  return `tel:${e164}`;
}

/** The "?&body=" form is the one both iOS and Android honour. */
export function smsHref(e164: string, body?: string): string {
  return body ? `sms:${e164}?&body=${encodeURIComponent(body)}` : `sms:${e164}`;
}

export function mailtoHref(email: string, subject?: string): string {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}
