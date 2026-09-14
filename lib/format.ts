/**
 * Display formatting. Timestamps are stored in UTC and rendered in the club's
 * time zone. Schedule times are wall-clock times and are not converted.
 */
import type { DayOfWeek } from "@/data/types";

export const CLUB_TIME_ZONE = "America/New_York";

export const DAY_LABELS: Record<DayOfWeek, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

type Clock = { hour12: number; minute: number; meridiem: "AM" | "PM" };

function parseClock(hhmm: string): Clock {
  const [h, m] = hhmm.split(":").map(Number);
  return { hour12: h % 12 === 0 ? 12 : h % 12, minute: m, meridiem: h < 12 ? "AM" : "PM" };
}

/** "07:00" → "7 AM"; "09:30" → "9:30 AM". */
export function formatTime(hhmm: string, { withMeridiem = true } = {}): string {
  const { hour12, minute, meridiem } = parseClock(hhmm);
  const base = minute === 0 ? `${hour12}` : `${hour12}:${String(minute).padStart(2, "0")}`;
  return withMeridiem ? `${base} ${meridiem}` : base;
}

/** "08:00","09:30" → "8–9:30 AM"; "11:00","13:00" → "11 AM–1 PM". */
export function formatTimeRange(start: string, end: string): string {
  const sameMeridiem = parseClock(start).meridiem === parseClock(end).meridiem;
  return sameMeridiem
    ? `${formatTime(start, { withMeridiem: false })}–${formatTime(end)}`
    : `${formatTime(start)}–${formatTime(end)}`;
}

/** UTC ISO timestamp → "Sep 10, 2026" in the club's time zone. */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CLUB_TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

/** Calendar date "YYYY-MM-DD" → Date at noon UTC, safe to format in any US zone. */
function calendarDate(ymd: string): Date {
  return new Date(`${ymd}T12:00:00Z`);
}

const longDate = new Intl.DateTimeFormat("en-US", {
  timeZone: CLUB_TIME_ZONE,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** "2026-10-12" → "Mon, Oct 12, 2026". */
export function formatCalendarDate(ymd: string): string {
  return longDate.format(calendarDate(ymd));
}

/** "2026-10-17","2026-10-18" → "Oct 17–18, 2026"; cross-month ranges spell both. */
export function formatDateRange(start: string, end?: string): string {
  const s = calendarDate(start);
  if (!end || end === start) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: CLUB_TIME_ZONE,
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(s);
  }
  const e = calendarDate(end);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CLUB_TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).formatRange(s, e);
}

const SMALL_NUMBERS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

/** 6 → "six"; larger numbers stay numeric. */
export function numberWord(n: number): string {
  return Number.isInteger(n) && n >= 0 && n < SMALL_NUMBERS.length ? SMALL_NUMBERS[n] : String(n);
}

/** 75 → "$75". Whole dollars only, which is all the club uses. */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
