import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { NavItem } from "@/components/PolicyNav";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Bullets } from "@/components/policy/Bullets";
import { PolicyHero } from "@/components/policy/PolicyHero";
import { MobileToc, SidebarToc } from "@/components/policy/PolicyToc";
import { Prose } from "@/components/policy/Prose";
import { Section } from "@/components/policy/Section";
import { CollectedSection } from "@/components/policy/sections/CollectedSection";
import { ContactCard } from "@/components/policy/sections/ContactCard";
import { NotCollectedSection } from "@/components/policy/sections/NotCollectedSection";
import { PermissionsSection } from "@/components/policy/sections/PermissionsSection";
import { SummarySection } from "@/components/policy/sections/SummarySection";
import { ThirdPartiesSection } from "@/components/policy/sections/ThirdPartiesSection";
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
        <MobileToc items={toc} accent={app.accent} />

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

          <SidebarToc items={toc} accent={app.accent} />
        </div>
      </main>
    </>
  );
}
