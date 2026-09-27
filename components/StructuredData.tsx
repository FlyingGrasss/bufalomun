import type { SiteSettings } from "@/types/conference";
import { SOCIAL_IMAGE_PATH } from "@/lib/seo";
import { publicSiteUrl } from "@/lib/site-settings";

export default function StructuredData({ settings }: { settings: SiteSettings }) {
  const siteUrl = publicSiteUrl(settings);
  const organizationName = settings.conference.organizer.name || settings.conference.brandName;
  const imageUrl = `${siteUrl}${SOCIAL_IMAGE_PATH}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "@id": `${siteUrl}/#event`,
        name: `${settings.conference.displayName} | ${settings.conference.fullName}`,
        description: `${settings.conference.sessionName}. ${settings.conference.dates}.`,
        url: siteUrl,
        startDate: settings.conference.startDateIso,
        ...(settings.conference.endDateIso ? { endDate: settings.conference.endDateIso } : {}),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        image: [imageUrl],
        location: {
          "@type": "Place",
          name: `${settings.conference.location.venue}, ${settings.conference.location.city}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: settings.conference.location.city,
            addressCountry: settings.conference.location.country,
          },
        },
        organizer: {
          "@type": "Organization",
          name: organizationName,
          url: siteUrl,
          ...(settings.conference.instagramUrl ? { sameAs: [settings.conference.instagramUrl] } : {}),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: settings.conference.displayName,
        description: `${settings.conference.sessionName}. Join us on ${settings.conference.dates}.`,
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: organizationName,
        url: siteUrl,
        logo: imageUrl,
        ...(settings.conference.instagramUrl ? { sameAs: [settings.conference.instagramUrl] } : {}),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
