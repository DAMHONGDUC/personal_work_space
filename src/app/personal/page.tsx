import type { Metadata } from "next";
import { LegacyRedirect } from "@/components/LegacyRedirect";
import { routes } from "@/lib/routes";

// The section holds one page today, so its root forwards instead of 404ing.
export const metadata: Metadata = { robots: { index: false } };

export default function PersonalIndexPage() {
  return <LegacyRedirect href={routes.cv} label="the CV" />;
}
