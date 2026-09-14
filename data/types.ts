/**
 * Typed shapes for every piece of editable content on the site.
 *
 * Phase 1: each shape is backed by a JSON file in /data.
 * Phase 2: the same shapes are backed by Prisma models. Page components read
 * everything through the accessors in /lib/content.ts, so swapping the
 * source must not change the pages.
 *
 * The optional `todo` field is a review note for the owner (always written as
 * "TODO(fred): …"). It is never rendered. Delete it once the fact is confirmed.
 */

export type Reviewable = {
  /** Review note for the owner. Never rendered. */
  todo?: string;
};

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const DAYS_OF_WEEK: readonly DayOfWeek[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

/** Wall-clock time in America/New_York, 24-hour "HH:MM". */
export type LocalTime = string;

export type Address = {
  street: string;
  /** Wayfinding hint shown under the street line, e.g. "Behind Publix". */
  landmark?: string;
  city: string;
  state: string;
  zip: string;
};

export type HoursEntry = Reviewable & {
  /** Human label for the range of days, e.g. "Every day" or "Mon–Fri". */
  label: string;
  open: LocalTime;
  close: LocalTime;
};

export type SocialPlatform = "instagram" | "facebook";

export type SocialLink = Reviewable & {
  platform: SocialPlatform;
  /** Display handle, e.g. "@delandtennisclub". */
  handle: string;
  url: string;
};

export type PlaceholderVariant = "clay" | "dusk" | "grass" | "clubhouse" | "ball" | "map";

/**
 * Phase 1 stands in for photography with gradient blocks. The `alt` text
 * describes the photo that will eventually go there so the shoot list writes
 * itself and screen readers get something meaningful now.
 */
export type PlaceholderImage = {
  variant: PlaceholderVariant;
  alt: string;
};

export type SiteInfo = Reviewable & {
  name: string;
  /** Short form for tight spaces (header on small phones, OG image). */
  shortName: string;
  tagline: string;
  /** One-paragraph description used for SEO and the footer. */
  description: string;
  /** Canonical production URL. Overridden by NEXT_PUBLIC_SITE_URL. */
  url: string;
  /** Home page hero copy. */
  hero: Reviewable & {
    eyebrow: string;
    headline: string;
    lede: string;
  };
  /** Phone in E.164, e.g. "+13868379123". The universal identity field. */
  phone: string;
  /** Whether the phone number accepts text messages. */
  phoneAcceptsSms: boolean;
  email: string;
  address: Address;
  hours: HoursEntry[];
  hoursNote?: string;
  social: SocialLink[];
  links: {
    /** Google Business Profile link ("See what's here" / reviews). */
    googleBusiness: string;
    /** Opens the club in Google Maps. */
    map: string;
    /** Opens turn-by-turn directions to the club. */
    directions: string;
  };
  owner: {
    name: string;
    firstName: string;
    title: string;
    credentials: string;
    bio: string[];
  };
  facility: {
    courtCount: number;
    surface: string;
    lit: boolean;
    highlights: string[];
  };
};

export type Service = Reviewable & {
  id: string;
  name: string;
  /** One line under the name. */
  tagline: string;
  /** Who it is for. */
  audience: string;
  description: string[];
  /** Bullet points: what is included / what to expect. */
  includes: string[];
  /** Ids into pricing[] that apply to this service. */
  pricingIds: string[];
  cta: {
    label: string;
    /** "call" | "text" | "email" → resolved against site data; otherwise an href. */
    action: "call" | "text" | "email" | string;
  };
  image: PlaceholderImage;
};

export type PricingCategory = "pass" | "court" | "lesson" | "clinic" | "program";

export type PriceItem = Reviewable & {
  id: string;
  name: string;
  category: PricingCategory;
  /** USD. Whole dollars. */
  price: number;
  /** e.g. "5 visits", "per hour", "per person". */
  unit: string;
  description: string;
  details?: string[];
  /** Featured items get the big treatment (ACE PASS). */
  featured?: boolean;
  /** For passes: number of visits included. */
  visits?: number;
};

export type ScheduleKind = "clinic" | "lesson" | "league" | "social" | "junior" | "open";

export type ScheduleEntry = Reviewable & {
  id: string;
  day: DayOfWeek;
  start: LocalTime;
  end: LocalTime;
  activity: string;
  court: string;
  kind: ScheduleKind;
  /** Level, age group, price pointer, or anything else worth knowing. */
  notes?: string;
};

export type PostSource = "instagram" | "club";

export type Post = Reviewable & {
  id: string;
  source: PostSource;
  /** ISO 8601 in UTC. Rendered in America/New_York. */
  publishedAt: string;
  body: string;
  /** Link to the original post (Instagram permalink in Phase 2). */
  permalink?: string;
  image: PlaceholderImage;
};

export type TournamentStatus = "open" | "closed" | "past";

export type Tournament = Reviewable & {
  id: string;
  name: string;
  /** Calendar dates, "YYYY-MM-DD", local to the club. */
  startDate: string;
  endDate?: string;
  registrationCloses: string;
  format: string;
  divisions: string[];
  /** USD per player per event. */
  entryFee: number;
  entryFeeNote?: string;
  description: string;
  status: TournamentStatus;
};

/** What the application form submits. Phone (E.164) is the primary contact. */
export type TournamentApplication = {
  fullName: string;
  phone: string;
  email?: string;
  tournamentId: string;
  division: string;
  partnerName?: string;
  level?: string;
  notes?: string;
  /** ISO 8601 in UTC. */
  submittedAt: string;
};
