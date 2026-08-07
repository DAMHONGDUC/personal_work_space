import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PolicyNav, type NavItem } from "@/components/PolicyNav";
import { ReadingProgress } from "@/components/ReadingProgress";
import {
  CollectedSection,
  ContactCard,
  NotCollectedSection,
  PermissionsSection,
  SummarySection,
  ThirdPartiesSection,
} from "@/components/policy/DataSections";
import { PolicyHero } from "@/components/policy/PolicyHero";
import { Bullets, Prose, Section } from "@/components/policy/Section";
import {
  contactEmail,
  formatDate,
  getApp,
  getApps,
  getOverview,
  getSections,
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

  const toc: NavItem[] = [
    ...(overview.length ? [{ id: "overview", title: "Overview" }] : []),
    { id: "at-a-glance", title: "At a glance" },
    { id: "data-collected", title: "Data we collect" },
    { id: "data-not-collected", title: "Data we do not collect" },
    ...(app.permissions.length ? [{ id: "permissions", title: "Device permissions" }] : []),
    ...(app.thirdParties.length ? [{ id: "third-parties", title: "Third-party services" }] : []),
    ...sections.map((section) => ({ id: section.id, title: section.title })),
  ];

  return (
    <>
      <ReadingProgress accent={app.accent} />

      <PolicyHero app={app} />

      <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-14">
        <details className="mb-10 rounded-xl border border-border-soft bg-surface lg:hidden">
          <summary className="cursor-pointer list-none px-5 py-3.5 text-sm font-medium marker:content-none">
            On this page
            <span className="float-right text-muted">{toc.length} sections</span>
          </summary>
          <div className="border-t border-border-soft px-5 py-3">
            <PolicyNav items={toc} accent={app.accent} />
          </div>
        </details>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-14">
            {overview.length > 0 && (
              <Section id="overview" title="Overview" accent={app.accent}>
                <Prose paragraphs={overview} />
              </Section>
            )}

            <SummarySection app={app} />
            <CollectedSection app={app} />
            <NotCollectedSection app={app} />

            {app.permissions.length > 0 && <PermissionsSection app={app} />}
            {app.thirdParties.length > 0 && <ThirdPartiesSection app={app} />}

            {sections.map((section) => (
              <Section
                key={section.id}
                id={section.id}
                title={section.title}
                accent={app.accent}
              >
                <Prose paragraphs={section.body} />
                {section.list && <Bullets items={section.list} accent={app.accent} />}
              </Section>
            ))}

            <ContactCard app={app} email={email} />
          </div>

          <aside className="hidden lg:block">
            <nav
              aria-label="On this page"
              className="sticky top-24 flex flex-col gap-3 border-l border-border-soft"
            >
              <p className="pl-4 text-xs font-medium uppercase tracking-wider text-muted">
                On this page
              </p>
              <PolicyNav items={toc} accent={app.accent} />
            </nav>
          </aside>
        </div>
      </main>
    </>
  );
}
