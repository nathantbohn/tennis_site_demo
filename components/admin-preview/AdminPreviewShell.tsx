"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminPreviewProvider } from "@/lib/admin-preview/store";

const TABS = [
  { href: "/admin-preview/schedule", label: "Schedule" },
  { href: "/admin-preview/pricing", label: "Pricing" },
  { href: "/admin-preview/applications", label: "Applications" },
] as const;

function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin preview sections" className="border-b border-slate-500/20 bg-white">
      <ul className="mx-auto flex w-full max-w-2xl">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="relative flex min-h-13 items-center justify-center px-2 text-center text-sm font-semibold text-ink-muted transition-colors hover:text-ink aria-[current=page]:text-slate-800 after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-full after:bg-lime-500 after:opacity-0 after:transition-opacity aria-[current=page]:after:opacity-100"
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Not connected to anything — no database, no auth, nothing sent anywhere.
 * Always visible on every admin-preview screen, not dismissible, so it is
 * never possible to forget this is a demo mid-walkthrough.
 */
function PreviewBanner() {
  return (
    <div role="status" className="bg-slate-900 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-cream-100 sm:text-sm">
      Preview — not connected · changes reset on reload
    </div>
  );
}

/**
 * Everything under /admin-preview shares this shell: the state provider
 * (see lib/admin-preview/store.tsx), the "not connected" banner, and the
 * tab nav between the three screens. The public site's own header and
 * footer still wrap this (Next's root layout applies to every route), so
 * this shell leans on strong, distinct styling — a dark banner and a
 * white tab bar — to read clearly as a separate admin surface rather than
 * another public page.
 */
export function AdminPreviewShell({ children }: { children: ReactNode }) {
  return (
    <AdminPreviewProvider>
      <div className="min-h-[60vh] bg-sage-100">
        <PreviewBanner />
        <AdminTabs />
        <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">{children}</div>
      </div>
    </AdminPreviewProvider>
  );
}
