import type { Metadata } from "next";
import type { SiteSettings } from "@/types/conference";
import { publicSiteUrl } from "@/lib/site-settings";

export const SOCIAL_IMAGE_PATH = "/icon.png";

export function absoluteSiteUrl(baseUrl: string, value: string) {
  try {
    return new URL(value, `${baseUrl}/`).toString();
  } catch {
    return `${baseUrl}${value.startsWith("/") ? value : `/${value}`}`;
  }
}

export function cleanDescription(value: string, maxLength = 170) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 3).trimEnd()}...`;
}

export function pageMetadata({
  settings,
  title,
  description,
  path,
  imageUrl,
  imageAlt,
  keywords = [],
}: {
  settings: SiteSettings;
  title: string;
  description: string;
  path: string;
  imageUrl?: string | null;
  imageAlt: string;
  keywords?: string[];
}): Metadata {
  const siteUrl = publicSiteUrl(settings);
  const canonical = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const pageUrl = absoluteSiteUrl(siteUrl, canonical);
  const resolvedImageUrl = absoluteSiteUrl(siteUrl, imageUrl || SOCIAL_IMAGE_PATH);
  const pageDescription = cleanDescription(description);
  const pageKeywords = [...new Set([settings.conference.shortName, settings.conference.brandName, ...keywords])];

  return {
    title,
    description: pageDescription,
    keywords: pageKeywords,
    alternates: { canonical },
    openGraph: {
      title,
      description: pageDescription,
      url: pageUrl,
      siteName: settings.conference.displayName,
      images: [
        {
          url: resolvedImageUrl,
          ...(imageUrl ? {} : { width: 640, height: 640 }),
          alt: imageAlt,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pageDescription,
      images: [resolvedImageUrl],
    },
  };
}
