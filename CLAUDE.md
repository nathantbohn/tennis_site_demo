# DeLand Tennis Club — website

Rebuild of delandtennis.com (currently a thin 5-page Wix site) as a custom
Next.js site for a small tennis club in DeLand, FL. Owner-editable via a
simple admin panel. Mobile-first — most visitors are on phones.

## Stack
- Next.js (App Router, TypeScript), Tailwind CSS
- Postgres on Neon via Prisma
- Auth.js for a single admin login (club owner)
- Hosting: Vercel; every PR should deploy cleanly as a preview
- No CMS, no multi-tenancy. This repo is a template that will be forked per
  client later — keep club-specific content in data/config, not scattered
  in components.

## Pages (mobile-first, clean single nav)
1. Home — hero, quick contact, pricing / ACE PASS section, "Latest" news section
2. Services — lessons, clinics, court rental
3. About / Contact — click-to-call, click-to-email, Google Business link, map
4. Schedule — a real editable table (rows stored in Postgres), NOT an image
5. Tournament Application — form; emails the owner and stores the submission

## Admin panel (/admin)
- Edit schedule rows, pricing text, "Latest" posts; view tournament submissions
- One owner account; keep it dead simple and phone-friendly

## Conventions
- Small, reviewable PRs; one feature per branch
- Prefer server components; client components only where interactivity needs them
- All secrets via env vars; document each new one in .env.example
- Store timestamps in UTC, render America/New_York
- Do not build social-media posting; social is handled outside the site
- Placeholder photos are fine for now — a real photo shoot comes later

## Out of scope for v1
Court booking / SMS system (planned as a separate v2)
