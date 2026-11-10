"use client";

/**
 * All state for /admin-preview lives here, in memory, for the tab of the
 * browser the demo is running in. There is no database and no API call —
 * refreshing the page (or closing the tab) throws everything away and the
 * three screens go back to this seed data. That is deliberate: this is a
 * UI preview of the Phase 2 admin, not the real thing.
 *
 * Schedule and pricing seed from the site's real data files so editing
 * them here previews editing the actual content shape. Applications have
 * no real data to seed from (Phase 1 never stores a submitted application
 * — see lib/applications.ts), so lib/admin-preview/mockData.ts invents a
 * plausible set.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import scheduleJson from "@/data/schedule.json";
import pricingJson from "@/data/pricing.json";
import type { PriceItem, ScheduleEntry } from "@/data/types";
import { mockApplications } from "@/lib/admin-preview/mockData";
import type { AdminApplication, ApplicationStatus } from "@/lib/admin-preview/types";

function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
}

type AdminPreviewContextValue = {
  schedule: ScheduleEntry[];
  addScheduleEntry: (entry: Omit<ScheduleEntry, "id">) => void;
  updateScheduleEntry: (id: string, entry: Omit<ScheduleEntry, "id">) => void;
  deleteScheduleEntry: (id: string) => void;

  pricing: PriceItem[];
  addPriceItem: (item: Omit<PriceItem, "id">) => void;
  updatePriceItem: (id: string, item: Omit<PriceItem, "id">) => void;
  deletePriceItem: (id: string) => void;

  applications: AdminApplication[];
  setApplicationStatus: (id: string, status: ApplicationStatus) => void;
};

const AdminPreviewContext = createContext<AdminPreviewContextValue | null>(null);

export function AdminPreviewProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(() =>
    (scheduleJson as ScheduleEntry[]).map((entry) => ({ ...entry })),
  );
  const [pricing, setPricing] = useState<PriceItem[]>(() =>
    (pricingJson as PriceItem[]).map((item) => ({ ...item })),
  );
  const [applications, setApplications] = useState<AdminApplication[]>(() =>
    mockApplications.map((application) => ({ ...application })),
  );

  const value = useMemo<AdminPreviewContextValue>(
    () => ({
      schedule,
      addScheduleEntry: (entry) => setSchedule((rows) => [...rows, { ...entry, id: makeId("schedule") }]),
      updateScheduleEntry: (id, entry) =>
        setSchedule((rows) => rows.map((row) => (row.id === id ? { ...entry, id } : row))),
      deleteScheduleEntry: (id) => setSchedule((rows) => rows.filter((row) => row.id !== id)),

      pricing,
      addPriceItem: (item) => setPricing((rows) => [...rows, { ...item, id: makeId("price") }]),
      updatePriceItem: (id, item) =>
        setPricing((rows) => rows.map((row) => (row.id === id ? { ...item, id } : row))),
      deletePriceItem: (id) => setPricing((rows) => rows.filter((row) => row.id !== id)),

      applications,
      setApplicationStatus: (id, status) =>
        setApplications((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row))),
    }),
    [schedule, pricing, applications],
  );

  return <AdminPreviewContext.Provider value={value}>{children}</AdminPreviewContext.Provider>;
}

export function useAdminPreview(): AdminPreviewContextValue {
  const ctx = useContext(AdminPreviewContext);
  if (!ctx) {
    throw new Error("useAdminPreview must be used inside <AdminPreviewProvider>");
  }
  return ctx;
}
