import { HubCard } from "@/components/home/HubCard";
import { formatDate, getApps, site } from "@/lib/apps";
import { getCv } from "@/lib/cv";
import { routes } from "@/lib/routes";

export default function Home() {
  const apps = getApps();
  const cv = getCv();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20">
      <div className="flex max-w-2xl flex-col gap-5 pb-14">
        <span className="w-fit rounded-full border border-border-soft px-3 py-1 text-xs text-muted">
          {site.publisher}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Apps and CV
        </h1>
        <p className="text-lg leading-8 text-muted">
          {site.description}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <HubCard
          href={routes.apps}
          icon="🛡️"
          accent="#6366f1"
          title="App privacy policies"
          description="One permanent page per published app, describing exactly what it collects and why."
          meta={`${apps.length} ${apps.length === 1 ? "app" : "apps"}`}
        />
        <HubCard
          href={routes.cv}
          icon="📄"
          accent="#0ea5e9"
          title="CV"
          description="Background, experience and contact details, available to read online or download."
          meta={cv ? `Updated ${formatDate(cv.updated)}` : "Coming soon"}
        />
      </div>
    </main>
  );
}
