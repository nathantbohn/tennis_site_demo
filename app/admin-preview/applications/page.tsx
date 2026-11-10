import type { Metadata } from "next";
import { ApplicationsList } from "@/components/admin-preview/ApplicationsList";

export const metadata: Metadata = { title: "Applications" };

export default function AdminPreviewApplicationsPage() {
  return <ApplicationsList />;
}
