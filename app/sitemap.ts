import type { MetadataRoute } from "next";
import { getPublicContent, publicSiteUrl } from "@/lib/site-settings";
import { absoluteSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { settings, committees, team, settingsUpdatedAt } = await getPublicContent();
  const base = publicSiteUrl(settings);
  const settingsLastModified = settingsUpdatedAt ? new Date(settingsUpdatedAt) : undefined;

  return [
    {
      url: base,
      ...(settingsLastModified ? { lastModified: settingsLastModified } : {}),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${base}/icon.png`],
    },
    ...(settings.sections.applications
      ? settings.applications
          .filter((item) => item.enabled)
          .map((item) => ({
            url: `${base}/apply/${item.id}`,
            ...(settingsLastModified ? { lastModified: settingsLastModified } : {}),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          }))
      : []),
    ...(settings.sections.committees
      ? committees.map((item) => ({
          url: `${base}/committees/${item.slug}`,
          lastModified: new Date(item.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.7,
          ...(item.imageUrl ? { images: [absoluteSiteUrl(base, item.imageUrl)] } : {}),
        }))
      : []),
    ...(settings.sections.team
      ? team.map((item) => ({
          url: `${base}/team/${item.slug}`,
          lastModified: new Date(item.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.7,
          ...(item.imageUrl ? { images: [absoluteSiteUrl(base, item.imageUrl)] } : {}),
        }))
      : []),
  ];
}
