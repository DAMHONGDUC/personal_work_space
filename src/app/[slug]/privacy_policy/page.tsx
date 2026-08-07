import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppIcon } from "@/components/AppIcon";
import {
  contactEmail,
  formatDate,
  getApp,
  getApps,
  getOverview,
  getSections,
  site,
  type App,
} from "@/lib/apps";

export function generateStaticParams() {
  return getApps().map((app) => ({ slug: app.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[slug]/privacy_policy">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const app = getApp(slug);

  if (!app) {
    return { title: "Not found" };
  }

  const title = `${app.name} Privacy Policy`;
  const description = `How ${app.name} handles your data. Last updated ${formatDate(app.lastUpdated)}.`;

  return {
    title,
    description,
    alternates: { canonical: `/${app.slug}/privacy_policy/` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function PrivacyPolicyPage(
  props: PageProps<"/[slug]/privacy_policy">,
) {
  const { slug } = await props.params;
  const app = getApp(slug);

  if (!app) {
    notFound();
  }

  const sections = getSections(app);
  const overview = getOverview(app);
  const email = contactEmail(app);

  const toc = [
    ...(overview.length ? [{ id: "overview", title: "Overview" }] : []),
    { id: "at-a-glance", title: "At a glance" },
    { id: "data-collected", title: "Data we collect" },
    { id: "data-not-collected", title: "Data we do not collect" },
    ...(app.permissions.length ? [{ id: "permissions", title: "Device permissions" }] : []),
    ...(app.thirdParties.length ? [{ id: "third-parties", title: "Third-party services" }] : []),
    ...sections.map((section) => ({ id: section.id, title: section.title })),
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <nav className="pb-8 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-foreground">
          All apps
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{app.name}</span>
      </nav>

      <Hero app={app} />

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-10">
        <div className="flex min-w-0 flex-col gap-12">
          {overview.length > 0 && (
            <Section id="overview" title="Overview">
              <div className="flex flex-col gap-4">
                {overview.map((paragraph, index) => (
                  <p key={index} className="text-base leading-7 text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Section>
          )}

          <Section id="at-a-glance" title="At a glance">
            <ul className="flex flex-col gap-3">
              {app.summary.map((point) => (
                <li key={point} className="flex gap-3 text-base leading-7">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                  {point}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="data-collected" title="Data we collect">
            {app.collects.length === 0 ? (
              <p className="rounded-xl border border-border-soft bg-muted-surface p-5 text-base leading-7">
                {app.name} does not collect any data. Nothing is sent off your device.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {app.collects.map((entry) => (
                  <div
                    key={entry.category}
                    className="rounded-xl border border-border-soft bg-surface p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold tracking-tight">{entry.category}</h3>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs ${
                          entry.linked
                            ? "bg-amber-500/12 text-amber-700 dark:text-amber-400"
                            : "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {entry.linked ? "Linked to you" : "Not linked to you"}
                      </span>
                    </div>
                    <p className="mt-2 text-base leading-7 text-muted">{entry.purpose}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {entry.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-md bg-muted-surface px-2 py-1 text-xs text-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section id="data-not-collected" title="Data we do not collect">
            <p className="text-base leading-7 text-muted">
              {app.name} never asks for, receives, or stores any of the following:
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {app.notCollected.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 rounded-lg border border-border-soft px-3 py-2 text-sm"
                >
                  <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0 text-muted">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {app.permissions.length > 0 && (
            <Section id="permissions" title="Device permissions">
              <div className="flex flex-col gap-3">
                {app.permissions.map((permission) => (
                  <div
                    key={permission.name}
                    className="rounded-xl border border-border-soft bg-surface p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold tracking-tight">{permission.name}</h3>
                      <span className="rounded-md bg-muted-surface px-1.5 py-0.5 text-xs text-muted">
                        {permission.required ? "Required" : "Optional"}
                      </span>
                    </div>
                    <p className="mt-2 text-base leading-7 text-muted">{permission.reason}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {app.thirdParties.length > 0 && (
            <Section id="third-parties" title="Third-party services">
              <p className="text-base leading-7 text-muted">
                {app.name} relies on the services below. Each one handles data under its own
                privacy policy.
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {app.thirdParties.map((party) => (
                  <li
                    key={party.name}
                    className="flex flex-col gap-1 rounded-xl border border-border-soft bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold tracking-tight">{party.name}</span>
                      <span className="block text-base leading-7 text-muted">
                        {party.purpose}
                      </span>
                    </span>
                    <a
                      href={party.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="shrink-0 text-sm text-muted underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                      Privacy policy ↗
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {sections.map((section) => (
            <Section key={section.id} id={section.id} title={section.title}>
              <div className="flex flex-col gap-4">
                {section.body.map((paragraph, index) => (
                  <p key={index} className="text-base leading-7 text-muted">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="flex flex-col gap-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3 text-base leading-7 text-muted">
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/40"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Section>
          ))}

          <div className="rounded-2xl border border-border-soft bg-muted-surface p-6">
            <h2 className="font-semibold tracking-tight">Questions about {app.name}?</h2>
            <p className="mt-2 text-base leading-7 text-muted">
              Write to{" "}
              <a
                href={`mailto:${email}?subject=${encodeURIComponent(`${app.name} — privacy question`)}`}
                className="text-foreground underline underline-offset-4"
              >
                {email}
              </a>
              . We usually reply within a few business days.
            </p>
          </div>
        </div>

        <aside className="hidden lg:block">
          <nav
            aria-label="On this page"
            className="sticky top-24 flex flex-col gap-2 border-l border-border-soft pl-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              On this page
            </p>
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm leading-6 text-muted transition-colors hover:text-foreground"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
}

function Hero({ app }: { app: App }) {
  const links = [
    { label: "App Store", href: app.storeLinks?.appStore },
    { label: "Google Play", href: app.storeLinks?.playStore },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  return (
    <header className="flex flex-col gap-6 border-b border-border-soft pb-10">
      <div className="flex items-start gap-5">
        <AppIcon icon={app.icon} accent={app.accent} size="lg" />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {app.platforms.map((platform) => (
              <span
                key={platform}
                className="rounded-md bg-muted-surface px-1.5 py-0.5 text-xs text-muted"
              >
                {platform}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {app.name} Privacy Policy
          </h1>
          <p className="text-base leading-7 text-muted">{app.tagline}</p>
        </div>
      </div>

      <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div>
          <dt className="text-muted">Effective</dt>
          <dd className="font-medium">{formatDate(app.effectiveDate)}</dd>
        </div>
        <div>
          <dt className="text-muted">Last updated</dt>
          <dd className="font-medium">{formatDate(app.lastUpdated)}</dd>
        </div>
        <div>
          <dt className="text-muted">Publisher</dt>
          <dd className="font-medium">{site.publisher}</dd>
        </div>
      </dl>

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-border-soft px-3 py-1.5 text-sm transition-colors hover:border-foreground/25"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="pb-4 text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
