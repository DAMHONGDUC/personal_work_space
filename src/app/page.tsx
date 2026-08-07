import { AppDirectory, type DirectoryEntry } from "@/components/AppDirectory";
import { formatDate, getApps, site } from "@/lib/apps";

export default function Home() {
  const apps = getApps();

  const entries: DirectoryEntry[] = apps.map((app) => ({
    slug: app.slug,
    name: app.name,
    tagline: app.tagline,
    icon: app.icon,
    accent: app.accent,
    platforms: app.platforms,
    updated: formatDate(app.lastUpdated),
  }));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20">
      <div className="flex max-w-2xl flex-col gap-5 pb-14">
        <span className="w-fit rounded-full border border-border-soft px-3 py-1 text-xs text-muted">
          {apps.length} {apps.length === 1 ? "app" : "apps"}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Privacy policies
        </h1>
        <p className="text-lg leading-8 text-muted">
          Every app published by {site.publisher} has its own privacy policy, hosted at
          a permanent address. Pick an app below to read its policy.
        </p>
      </div>

      <AppDirectory entries={entries} />
    </main>
  );
}
