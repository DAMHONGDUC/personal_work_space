import data from "@/data/apps.json";

export type Section = {
  id: string;
  title: string;
  body: string[];
  list?: string[];
};

export type DataCategory = {
  category: string;
  items: string[];
  purpose: string;
  /** Whether the data is linked to the user's identity (App Store nutrition-label wording). */
  linked: boolean;
};

export type Permission = {
  name: string;
  required: boolean;
  reason: string;
};

export type ThirdParty = {
  name: string;
  purpose: string;
  url: string;
};

export type App = {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  accent: string;
  platforms: string[];
  effectiveDate: string;
  lastUpdated: string;
  contactEmail?: string;
  storeLinks?: { appStore?: string; playStore?: string };
  /** Opening prose, rendered above "At a glance". Optional. */
  overview?: string[];
  summary: string[];
  collects: DataCategory[];
  notCollected: string[];
  permissions: Permission[];
  thirdParties: ThirdParty[];
  sections?: Section[];
};

export type Site = {
  publisher: string;
  url: string;
  contactEmail: string;
  description: string;
};

type PrivacyData = {
  site: Site;
  defaults: { sections: Section[] };
  apps: App[];
};

const privacy = data as PrivacyData;

export const site = privacy.site;
export const apps = privacy.apps;

export function getApp(slug: string): App | undefined {
  return privacy.apps.find((app) => app.slug === slug);
}

/** Fills the {{app}}, {{publisher}} and {{email}} placeholders used in the shared sections. */
function fill(text: string, app: App): string {
  return text
    .replaceAll("{{app}}", app.name)
    .replaceAll("{{publisher}}", site.publisher)
    .replaceAll("{{email}}", app.contactEmail ?? site.contactEmail);
}

/**
 * Shared sections from `defaults`, with any app-specific section of the same id
 * replacing it in place. Sections with a new id are appended before "changes".
 */
export function getSections(app: App): Section[] {
  const overrides = new Map((app.sections ?? []).map((s) => [s.id, s]));
  const merged: Section[] = [];

  for (const section of privacy.defaults.sections) {
    const override = overrides.get(section.id);
    if (override) overrides.delete(section.id);
    merged.push(override ?? section);
  }

  // Extra app-only sections read best right after the app-specific data details,
  // so insert them before the boilerplate tail instead of at the very end.
  const tailStart = merged.findIndex((s) => s.id === "changes");
  const insertAt = tailStart === -1 ? merged.length : tailStart;
  merged.splice(insertAt, 0, ...overrides.values());

  return merged.map((section) => ({
    ...section,
    body: section.body.map((p) => fill(p, app)),
    list: section.list?.map((item) => fill(item, app)),
  }));
}

/** Overview paragraphs with the same placeholders as the shared sections filled in. */
export function getOverview(app: App): string[] {
  return (app.overview ?? []).map((paragraph) => fill(paragraph, app));
}

export function contactEmail(app: App): string {
  return app.contactEmail ?? site.contactEmail;
}

export function formatDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
