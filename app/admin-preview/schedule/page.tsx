import type { Metadata } from "next";
import { ScheduleEditor } from "@/components/admin-preview/ScheduleEditor";

export const metadata: Metadata = { title: "Schedule" };

export default function AdminPreviewSchedulePage() {
  return <ScheduleEditor />;
}
