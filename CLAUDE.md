# DeLand Tennis Club — website

Rebuild of delandtennis.com (currently a thin 5-page Wix site) as a custom
Next.js site for a small tennis club in DeLand, FL. Mobile-first — most
visitors, and the owner, are on phones.

## Phases
Build only the current phase. Design so the next phases are additions, not rewrites.

- **Phase 1 (NOW): demo site.** Static data, no database, no auth. Goal: a
  polished preview URL that looks like a real, current site.
- Phase 2 (after approval): Postgres on Neon via Prisma, Auth.js single owner
  login, phone-friendly /admin for schedule rows, pricing, and posts.
  "Latest" section pulls the club's recent Instagram posts (Instagram is the
  input; Facebook cross-posts via Meta Business Suite). We do NOT publish
  to social from the site.
- Phase 3 (later): member court/lesson booking. Phone number + SMS one-time
  code login, 90-day device cookie, member allowlist, slot grid, confirmation
  and reminder texts via Twilio. Double-booking prevented in Postgres.

## Stack
- Next.js (App Router, TypeScript), Tailwind CSS
- Phase 1 hosting: Vercel Hobby preview; Pro after contract
- This repo will be forked per client later — keep club-specific content in
  /data and config, never hard-coded in components.

## Pages (clean single nav)
1. Home — hero, quick contact, pricing / ACE PASS section, "Latest" section
2. Services — lessons, clinics, court rental
3. About / Contact — click-to-call, click-to-email, Google Business link, map
4. Schedule — a real table rendered from data, NOT an image
5. Tournament Application — form; phone is the primary contact field.
   Phase 1: client-side UI only. Phase 2: emails the owner + stores submission.

## Architecture rules (apply from Phase 1)
- All editable content lives under /data with typed shapes (TypeScript types
  in /data/types.ts). Phase 2 swaps JSON files for Prisma models with the
  same shapes; page components must not change.
- Phone number is the universal identity (members, owner, applicants).
  Store E.164.
- All outbound messages go through one `notify(to, message, channel)`
  function in /lib/notify. Phase 1: it logs. Later: email, SMS.
- Bookings (Phase 3) use a status enum: PENDING | CONFIRMED | CANCELLED.
  Default flow auto-confirms; PENDING exists so owner-approval-by-text
  can be enabled later with a config flag, not a schema change.
- Store timestamps in UTC, render America/New_York.
- All secrets via env vars; document each in .env.example.

## Conventions
- Small, reviewable PRs; one feature per branch
- Server components by default; client components only for interactivity
- `npm run build` must pass before opening a PR
- Placeholder photos are fine — a real photo shoot comes later. Do not use
  the current site's snapshot photo grid.

## Out of scope entirely
Website→social publishing, multi-tenancy, a CMS.
