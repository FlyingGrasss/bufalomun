import Link from "next/link";
import type { SiteSettings } from "@/types/conference";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer id="contact" className="bg-[var(--charcoal)] text-white">
      <div className="site-container grid gap-12 py-16 md:grid-cols-2 md:items-end">
        <div>
          <p className="eyebrow text-[var(--red)]">Stay in touch</p>
          <h2 className="mt-3 max-w-xl font-display text-5xl leading-none sm:text-6xl">See you in İzmir.</h2>
          <p className="mt-6 max-w-lg text-white/65">{settings.conference.dates} · {settings.conference.location.venue}</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <Link className="link-underline text-lg" href={settings.conference.instagramUrl} target="_blank" rel="noreferrer">{settings.conference.instagramHandle}</Link>
          {settings.conference.contactEmail.includes("@") && <Link className="link-underline" href={`mailto:${settings.conference.contactEmail}`}>{settings.conference.contactEmail}</Link>}
          <p className="mt-5 text-xs uppercase tracking-[.15em] text-white/45">Website by <Link className="hover:text-white" href={settings.conference.organizer.creditUrl}>{settings.conference.organizer.creditName}</Link></p>
        </div>
      </div>
    </footer>
  );
}
