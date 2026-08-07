import type { MetadataRoute } from "next";
import { apps, site } from "@/lib/apps";

// Required so the sitemap is emitted as a file by `output: "export"`.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    ...apps.map((app) => ({
      url: `${site.url}/${app.slug}/privacy_policy/`,
      lastModified: new Date(`${app.lastUpdated}T00:00:00Z`),
      changeFrequency: "yearly" as const,
    })),
  ];
}
