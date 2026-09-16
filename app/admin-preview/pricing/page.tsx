import type { Metadata } from "next";
import { PricingEditor } from "@/components/admin-preview/PricingEditor";

export const metadata: Metadata = { title: "Pricing" };

export default function AdminPreviewPricingPage() {
  return <PricingEditor />;
}
