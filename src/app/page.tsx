import { AppDirectory } from "@/components/AppDirectory";
import type { DirectoryEntry } from "@/components/home/AppCard";
import { HomeHero } from "@/components/home/HomeHero";
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
      <HomeHero publisher={site.publisher} appCount={apps.length} />
      <AppDirectory entries={entries} />
    </main>
  );
}
