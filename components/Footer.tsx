import Link from "next/link";
import { ArrowUpRight, MapPinned } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { SiteSettings } from "@/types/conference";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const contactEmail = settings.conference.contactEmail?.trim() || "contact@bufalomun.org";
  const displayEmail = contactEmail.toLowerCase().includes("announced") ? "contact@bufalomun.org" : contactEmail;
  const mapQuery = [settings.conference.location.venue, settings.conference.location.city, settings.conference.location.country].filter(Boolean).join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const creditName = settings.conference.organizer.creditName?.trim() || "Emre Bozkurt";
  const creditUrl = creditName.trim().toLowerCase() === "emre bozkurt"
    ? "https://www.instagram.com/emre.bozqurt/"
    : settings.conference.organizer.creditUrl;

  return (
    <footer id="contact" className="scroll-mt-10 bg-[var(--charcoal)] text-white">
      <div className="site-container py-16">
        <div className="grid gap-12 md:grid-cols-2 md:items-end">
        <div>
          <p className="eyebrow text-[var(--red)]">Contact Us</p>
          <h2 className="mt-3 max-w-xl font-display text-5xl leading-none sm:text-6xl">See you in İzmir.</h2>
          <p className="mt-6 max-w-lg text-white/65">{settings.conference.dates} · {settings.conference.location.venue}</p>
          <ButtonLink href={mapsUrl} target="_blank" rel="noreferrer" variant="secondary" className="mt-7 border-white/30 text-white hover:border-[var(--red)] hover:text-[var(--red)]">
            <MapPinned aria-hidden="true" className="size-4" />
            Open in Google Maps
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <Link className="link-underline text-lg font-bold text-white hover:text-[var(--red)]" href={`mailto:${displayEmail}`}>
            {displayEmail}
          </Link>
          {settings.conference.instagramUrl && (
            <Link className="link-underline text-sm text-white/80 hover:text-white" href={settings.conference.instagramUrl} target="_blank" rel="noreferrer">
              {settings.conference.instagramHandle || settings.conference.instagramUrl}
            </Link>
          )}
          <p className="mt-5 text-xs uppercase tracking-[.15em] text-white/45">
            Website by <Link className="hover:text-white" href={creditUrl} target="_blank" rel="noreferrer">{creditName}</Link>
          </p>
        </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-10">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <p className="eyebrow text-white/45">Find the venue</p>
            <p className="text-sm text-white/45">{mapQuery}</p>
          </div>
          <div className="aspect-[16/9] overflow-hidden border border-white/15 bg-black/20 md:aspect-[16/6]">
            <iframe
              title={`Map showing ${mapQuery}`}
              src={mapEmbedUrl}
              className="size-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
