import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyRedirect } from "@/components/LegacyRedirect";
import { getApps, getApp } from "@/lib/apps";
import { routes } from "@/lib/routes";

export const dynamicParams = false;

// This is the address submitted to the app stores before the restructure, so it
// has to keep resolving. It forwards to the new canonical path and stays out of
// the index so only one copy is listed.
export const metadata: Metadata = { robots: { index: false } };

export function generateStaticParams() {
  return getApps().map((app) => ({ slug: app.slug }));
}

export default async function LegacyPrivacyPolicyPage(
  props: PageProps<"/[slug]/privacy_policy">,
) {
  const { slug } = await props.params;
  const app = getApp(slug);

  if (!app) {
    notFound();
  }

  return (
    <LegacyRedirect
      href={routes.privacyPolicy(app.slug)}
      label={`the ${app.name} privacy policy`}
    />
  );
}
