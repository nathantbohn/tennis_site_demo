# DeLand Tennis Club — website

Phase 1 demo of the new [delandtennis.com](https://www.delandtennis.com): a
static, mobile-first Next.js site for a small clay-court club in DeLand, FL.
No database, no auth. See `CLAUDE.md` for the phase plan and architecture rules.

## Run it locally

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Before opening a PR, both of these must pass clean:

```bash
npm run build      # production build, also type-checks
npm run lint       # eslint, zero warnings allowed
```

`npm run build && npm start` serves the production build locally.

## Where things live

| Path            | What                                                                     |
| --------------- | ------------------------------------------------------------------------ |
| `app/`          | Routes (App Router): `/`, `/services`, `/schedule`, `/tournaments`, `/contact`, plus sitemap, robots, icons and the Open Graph image |
| `components/`   | UI. Server components by default; only `NavLinks` and `TournamentForm` are client components |
| `data/`         | **All editable content**, as JSON, typed by `data/types.ts`              |
| `lib/content.ts`| The only place that reads `/data`. Pages call `getSite()`, `getSchedule()` and friends |
| `lib/notify.ts` | `notify(to, message, channel)`: the single exit for outbound messages. Logs in Phase 1 |
| `lib/phone.ts`  | E.164 normalization and display formatting for phone numbers             |
| `lib/format.ts` | Dates, times and prices. Timestamps are UTC in data, rendered in America/New_York |

## Editing content

Everything the club might want to change is in `/data`:

- `site.json`: name, tagline, phone, email, address, hours, social links, owner bio, hero copy
- `services.json`: the Services page
- `pricing.json`: prices, including the ACE PASS (`featured: true`)
- `schedule.json`: weekly schedule rows (day, start, end, activity, court, notes)
- `posts.json`: the "Latest" section on the home page (three sample posts)
- `tournaments.json`: upcoming events the application form offers

Conventions:

- Phone numbers are stored in E.164 (`+13868379123`) and formatted for display in code.
- Schedule times are 24-hour wall-clock strings (`"08:00"`) in the club's time zone.
- Post timestamps are ISO 8601 in UTC; tournament dates are `YYYY-MM-DD`.
- Any object may carry a `todo` field written as `TODO(fred): …`. It is a review
  note for the owner, is never rendered, and should be deleted once confirmed.
- `lib/content.ts` validates the JSON when the app starts or builds, so a bad
  day name, time or pricing reference fails the build with a readable message.

Photos are stand-ins for now: the `Placeholder` component draws a solid or
gradient block, and each block's `alt` text describes the shot to take later.

## Deploying to Vercel

1. Import the repository in Vercel. The Next.js preset is detected automatically; no build settings are needed.
2. Add the environment variable `NEXT_PUBLIC_SITE_URL` with the deployment's URL
   (for example `https://deland-tennis.vercel.app`). It is used for Open Graph
   URLs, the sitemap and robots.txt. Without it, links fall back to the club's
   domain from `data/site.json`.
3. Every push to a branch gets a preview URL; `main` deploys to production.

The Hobby plan is fine for the Phase 1 preview. There are no secrets in Phase 1;
`.env.example` lists every variable the app reads.

## Roadmap

Phase 2 swaps the JSON files for Postgres via Prisma behind the same accessors
in `lib/content.ts`, adds an owner login and a phone-friendly admin, and pulls
the "Latest" section from Instagram. Phase 3 adds member court booking with
SMS one-time codes. Page components are written so neither phase needs to
touch them.
