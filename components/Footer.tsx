import Link from "next/link";
import type { SiteSettings } from "@/types/conference";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const contactEmail = settings.conference.contactEmail?.trim() || "contact@bufalomun.org";
  const displayEmail = contactEmail.toLowerCase().includes("announced") ? "contact@bufalomun.org" : contactEmail;
  const creditName = settings.conference.organizer.creditName?.trim() || "Emre Bozkurt";
  const creditUrl = creditName.trim().toLowerCase() === "emre bozkurt"
    ? "https://www.instagram.com/emre.bozqurt/"
    : settings.conference.organizer.creditUrl;

  return (
    <footer id="contact" className="scroll-mt-10 bg-[var(--charcoal)] text-white">
      <div className="site-container grid gap-12 py-16 md:grid-cols-2 md:items-end">
        <div>
          <p className="eyebrow text-[var(--red)]">Contact Us</p>
          <h2 className="mt-3 max-w-xl font-display text-5xl leading-none sm:text-6xl">See you in İzmir.</h2>
          <p className="mt-6 max-w-lg text-white/65">{settings.conference.dates} · {settings.conference.location.venue}</p>
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
    </footer>
  );
}
