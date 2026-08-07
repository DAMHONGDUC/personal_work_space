import { AppDirectory, type DirectoryEntry } from "@/components/AppDirectory";
import { apps, site } from "@/lib/apps";

export default function Home() {
  const entries: DirectoryEntry[] = apps.map((app) => ({
    slug: app.slug,
    name: app.name,
    tagline: app.tagline,
    icon: app.icon,
    accent: app.accent,
    platforms: app.platforms,
  }));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-4 pb-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy policies
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Every app published by {site.publisher} has its own privacy policy, hosted at
          a permanent address you can submit to the App Store and Google Play. Pick an
          app below to read its policy.
        </p>
        <p className="w-fit rounded-lg bg-muted-surface px-3 py-2 font-mono text-xs text-muted">
          {site.url.replace(/^https?:\/\//, "")}/&lt;app&gt;/privacy_policy
        </p>
      </div>

      <AppDirectory entries={entries} />
    </main>
  );
}
