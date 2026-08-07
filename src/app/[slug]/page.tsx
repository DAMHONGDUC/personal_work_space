import Link from "next/link";
import { notFound } from "next/navigation";
import { getApps, getApp } from "@/lib/apps";

export const dynamicParams = false;

export function generateStaticParams() {
  return getApps().map((app) => ({ slug: app.slug }));
}

/**
 * `/<app>` is a convenience entry point that lands on the app's policy.
 * Static export has no server, so this forwards with a meta refresh (which works
 * without JavaScript) plus a visible link as the fallback.
 */
export default async function AppIndexPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const app = getApp(slug);

  if (!app) {
    notFound();
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const target = `${basePath}/${app.slug}/privacy_policy/`;

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <main className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-6 py-24">
        <h1 className="text-2xl font-semibold tracking-tight">
          Redirecting to the {app.name} privacy policy…
        </h1>
        <Link
          href={`/${app.slug}/privacy_policy`}
          className="rounded-lg border border-border-soft px-4 py-2 text-sm transition-colors hover:border-foreground/25"
        >
          Continue
        </Link>
      </main>
    </>
  );
}
