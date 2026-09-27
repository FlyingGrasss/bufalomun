import type { SiteSettings } from "@/types/conference";

export default function StructuredData({ settings }: { settings: SiteSettings }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: settings.conference.displayName,
    description: settings.conference.fullName,
    startDate: settings.conference.startDateIso,
    endDate: settings.conference.endDateIso,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: settings.conference.location.venue,
      address: `${settings.conference.location.city}, ${settings.conference.location.country}`,
    },
    organizer: { "@type": "Organization", name: settings.conference.organizer.name },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }} />;
}
