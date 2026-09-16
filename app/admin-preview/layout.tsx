import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminPreviewShell } from "@/components/admin-preview/AdminPreviewShell";

/**
 * A UI-only preview of the Phase 2 admin (schedule, pricing, tournament
 * applications) — see CLAUDE.md's Phase 2 section. No auth, no database:
 * everything lives in client state via AdminPreviewShell and resets on
 * reload. Not linked from the public nav (lib/nav.ts); kept out of the
 * sitemap and disallowed in robots.txt, and every page here is noindexed
 * as a second layer, since none of that actually prevents someone with
 * the URL from opening it.
 */
export const metadata: Metadata = {
  title: { template: "%s · Admin preview", default: "Admin preview" },
  robots: { index: false, follow: false },
};

export default function AdminPreviewLayout({ children }: { children: ReactNode }) {
  return <AdminPreviewShell>{children}</AdminPreviewShell>;
}
