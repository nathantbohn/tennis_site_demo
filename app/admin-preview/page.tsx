import { redirect } from "next/navigation";

/** /admin-preview has no content of its own — land on the schedule screen. */
export default function AdminPreviewIndexPage() {
  redirect("/admin-preview/schedule");
}
