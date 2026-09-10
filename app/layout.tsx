import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { getPublicContent, publicSiteUrl } from "@/lib/site-settings";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicContent();
  const siteUrl = publicSiteUrl(settings);
  const conference = settings.conference;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: conference.displayName,
      template: `%s | ${conference.displayName}`,
    },
    description: `${conference.sessionName}. Join us on ${conference.dates}. ${conference.hashtag}`,
    keywords: [conference.shortName, conference.brandName, "MUN", "Model United Nations", "Turkey MUN 2026", "BUFALOMUN 2026"],
    alternates: { canonical: "/" },
    authors: [{ name: conference.organizer.name || conference.brandName }],
    creator: conference.organizer.name || conference.brandName,
    publisher: conference.organizer.name || conference.brandName,
    icons: {
      icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: `${conference.displayName} | ${conference.fullName}`,
      description: `${conference.dates} | ${conference.sessionName}.`,
      url: siteUrl,
      siteName: conference.displayName,
      images: [{ url: `${siteUrl}/icon.png`, width: 640, height: 640, alt: `${conference.displayName} - ${conference.fullName}` }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${conference.displayName} | ${conference.fullName}`,
      description: `${conference.dates} | ${conference.hashtag}`,
      images: [`${siteUrl}/icon.png`],
    },
    robots: { index: true, follow: true, nocache: false, googleBot: { index: true, follow: true, noimageindex: false } },
  };
}

export const viewport: Viewport = { themeColor: "#2E2E2E", colorScheme: "light" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { settings } = await getPublicContent();
  return (
    <html lang="en" className={`${manrope.variable} ${instrument.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteNav enabled={settings.sections} />
        <main id="main-content">{children}</main>
        {settings.sections.contact && <Footer settings={settings} />}
      </body>
    </html>
  );
}
