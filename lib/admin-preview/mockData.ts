import type { AdminApplication } from "@/lib/admin-preview/types";

/**
 * Sample tournament applications for the /admin-preview demo. Phase 1 never
 * stores real applications (see lib/applications.ts), so there is no real
 * data to preview here — these are invented, with fictional 555 phone
 * numbers, referencing the real tournaments and divisions from
 * data/tournaments.json so the screen still feels grounded in the site's
 * actual content.
 */
export const mockApplications: AdminApplication[] = [
  {
    id: "app-mock-1",
    fullName: "Jordan Ellis",
    phone: "+13865550101",
    email: "jordan.ellis@example.com",
    tournamentId: "fall-classic-2026",
    tournamentName: "Fall Classic",
    division: "Men's singles 3.5",
    level: "3.5",
    status: "new",
    submittedAt: "2026-09-15T14:20:00Z",
  },
  {
    id: "app-mock-2",
    fullName: "Priya Nair",
    phone: "+13865550102",
    tournamentId: "fall-classic-2026",
    tournamentName: "Fall Classic",
    division: "Women's doubles 4.0+",
    partnerName: "Casey Nair",
    level: "4.0",
    notes: "We'd like adjacent match times if possible — driving in from Orlando.",
    status: "confirmed",
    submittedAt: "2026-09-14T19:05:00Z",
  },
  {
    id: "app-mock-3",
    fullName: "Marcus Webb",
    phone: "+13865550103",
    email: "mwebb@example.com",
    tournamentId: "fall-classic-2026",
    tournamentName: "Fall Classic",
    division: "Mixed doubles 7.0",
    partnerName: "Dana Webb",
    status: "waitlisted",
    submittedAt: "2026-09-13T22:40:00Z",
  },
  {
    id: "app-mock-4",
    fullName: "Sofia Reyes",
    phone: "+13865550104",
    tournamentId: "holiday-mixed-2026",
    tournamentName: "Holiday Mixed Doubles Social",
    division: "Mixed doubles 6.0–7.0",
    level: "Not sure yet",
    notes: "Total beginner, please pair me with someone patient!",
    status: "new",
    submittedAt: "2026-09-16T13:10:00Z",
  },
  {
    id: "app-mock-5",
    fullName: "Ben Okafor",
    phone: "+13865550105",
    email: "ben.okafor@example.com",
    tournamentId: "new-year-doubles-2027",
    tournamentName: "New Year Doubles Shootout",
    division: "Men's doubles 4.0+",
    partnerName: "Theo Park",
    level: "4.5",
    status: "confirmed",
    submittedAt: "2026-09-12T16:30:00Z",
  },
  {
    id: "app-mock-6",
    fullName: "Rachel Kim",
    phone: "+13865550106",
    tournamentId: "holiday-mixed-2026",
    tournamentName: "Holiday Mixed Doubles Social",
    division: "Mixed doubles 8.0+",
    notes: "Can't make it after all this year — happy to give up the spot.",
    status: "declined",
    submittedAt: "2026-09-10T18:00:00Z",
  },
];
