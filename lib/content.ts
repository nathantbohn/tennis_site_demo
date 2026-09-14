/**
 * Data access layer.
 *
 * Phase 1 reads the JSON files in /data. Phase 2 replaces the bodies of these
 * functions with Prisma queries that return the same shapes, so every page
 * already awaits them as if they were remote.
 */
import siteJson from "@/data/site.json";
import servicesJson from "@/data/services.json";
import pricingJson from "@/data/pricing.json";
import scheduleJson from "@/data/schedule.json";
import postsJson from "@/data/posts.json";
import tournamentsJson from "@/data/tournaments.json";
import {
  DAYS_OF_WEEK,
  type DayOfWeek,
  type Post,
  type PriceItem,
  type ScheduleEntry,
  type Service,
  type SiteInfo,
  type Tournament,
} from "@/data/types";

const site = siteJson as SiteInfo;
const services = servicesJson as Service[];
const pricing = pricingJson as PriceItem[];
const schedule = scheduleJson as ScheduleEntry[];
const posts = postsJson as Post[];
const tournaments = tournamentsJson as Tournament[];

validate();

export async function getSite(): Promise<SiteInfo> {
  return site;
}

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getPricing(): Promise<PriceItem[]> {
  return pricing;
}

export async function getPriceItems(ids: string[]): Promise<PriceItem[]> {
  return ids
    .map((id) => pricing.find((item) => item.id === id))
    .filter((item): item is PriceItem => Boolean(item));
}

export async function getSchedule(): Promise<ScheduleEntry[]> {
  return [...schedule].sort(
    (a, b) =>
      DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day) ||
      a.start.localeCompare(b.start),
  );
}

export type ScheduleDay = { day: DayOfWeek; entries: ScheduleEntry[] };

/** Schedule grouped by day, Monday first. Days with nothing on are omitted. */
export async function getScheduleByDay(): Promise<ScheduleDay[]> {
  const sorted = await getSchedule();
  return DAYS_OF_WEEK.map((day) => ({
    day,
    entries: sorted.filter((entry) => entry.day === day),
  })).filter((group) => group.entries.length > 0);
}

/** Newest first. */
export async function getLatestPosts(limit = 3): Promise<Post[]> {
  return [...posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Tournaments still taking applications, soonest first. */
export async function getUpcomingTournaments(): Promise<Tournament[]> {
  return tournaments
    .filter((t) => t.status !== "past")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/**
 * Fails the build (or the dev server) with a readable message when a JSON
 * file has been edited into a shape the pages cannot render.
 */
function validate(): void {
  const problems: string[] = [];
  const time = /^([01]\d|2[0-3]):[0-5]\d$/;
  const date = /^\d{4}-\d{2}-\d{2}$/;

  if (!/^\+[1-9]\d{6,14}$/.test(site.phone)) {
    problems.push(`site.phone must be E.164 (got "${site.phone}")`);
  }
  for (const h of site.hours) {
    if (!time.test(h.open) || !time.test(h.close)) {
      problems.push(`site.hours "${h.label}" must use HH:MM times`);
    }
  }

  const pricingIds = new Set(pricing.map((p) => p.id));
  for (const s of services) {
    for (const id of s.pricingIds) {
      if (!pricingIds.has(id)) {
        problems.push(`service "${s.id}" points at unknown pricing id "${id}"`);
      }
    }
  }

  const scheduleIds = new Set<string>();
  for (const e of schedule) {
    if (!DAYS_OF_WEEK.includes(e.day)) {
      problems.push(`schedule "${e.id}" has unknown day "${e.day}"`);
    }
    if (!time.test(e.start) || !time.test(e.end) || e.start >= e.end) {
      problems.push(`schedule "${e.id}" needs HH:MM start before end`);
    }
    if (scheduleIds.has(e.id)) problems.push(`duplicate schedule id "${e.id}"`);
    scheduleIds.add(e.id);
  }

  for (const p of posts) {
    if (Number.isNaN(Date.parse(p.publishedAt))) {
      problems.push(`post "${p.id}" has an unparseable publishedAt`);
    }
  }

  for (const t of tournaments) {
    for (const [field, value] of [
      ["startDate", t.startDate],
      ["endDate", t.endDate ?? t.startDate],
      ["registrationCloses", t.registrationCloses],
    ] as const) {
      if (!date.test(value)) {
        problems.push(`tournament "${t.id}" ${field} must be YYYY-MM-DD`);
      }
    }
    if (t.divisions.length === 0) {
      problems.push(`tournament "${t.id}" needs at least one division`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Invalid content in /data:\n- ${problems.join("\n- ")}`);
  }
}
