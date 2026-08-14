import type { MetadataRoute } from "next";
import { getApps, site } from "@/lib/apps";
import { getCv } from "@/lib/cv";
import { routes } from "@/lib/routes";

// Required so the sitemap is emitted as a file by `output: "export"`.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const cv = getCv();

  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${site.url}${routes.apps}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    ...getApps().map((app) => ({
      url: `${site.url}${routes.privacyPolicy(app.slug)}/`,
      lastModified: new Date(`${app.lastUpdated}T00:00:00Z`),
      changeFrequency: "yearly" as const,
    })),
    // Only listed once there is something to read there.
    ...(cv
      ? [
          {
            url: `${site.url}${routes.cv}/`,
            lastModified: new Date(`${cv.updated}T00:00:00Z`),
            changeFrequency: "monthly" as const,
          },
        ]
      : []),
    // The legacy /<slug>/... redirects are deliberately absent: they are
    // noindex, and listing them would compete with the canonical paths.
  ];
}
