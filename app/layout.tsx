import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import SmoothScroll from "@/components/SmoothScroll";
import { getPublicContent, publicSiteUrl } from "@/lib/site-settings";
import { SOCIAL_IMAGE_PATH, cleanDescription } from "@/lib/seo";
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
  const organizationName = conference.organizer.name || conference.brandName;
  const description = cleanDescription(
    `${conference.sessionName} in ${conference.location.city}, ${conference.location.country}. Join us on ${conference.dates}. ${conference.hashtag}`,
  );
  const keywords = [
    conference.shortName,
    conference.brandName,
    "MUN",
    "Model United Nations",
    `${conference.location.city} MUN`,
    `${conference.location.country} MUN`,
    `${conference.brandName} ${conference.year}`,
  ];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: conference.displayName,
      template: `%s | ${conference.displayName}`,
    },
    description,
    keywords,
    alternates: { canonical: "/" },
    applicationName: conference.displayName,
    authors: [{ name: organizationName }],
    creator: organizationName,
    publisher: organizationName,
    referrer: "origin-when-cross-origin",
    formatDetection: { email: false, address: false, telephone: false },
    icons: {
      icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: `${conference.displayName} | ${conference.fullName}`,
      description,
      url: siteUrl,
      siteName: conference.displayName,
      images: [{ url: `${siteUrl}${SOCIAL_IMAGE_PATH}`, width: 640, height: 640, alt: `${conference.displayName} - ${conference.fullName}` }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${conference.displayName} | ${conference.fullName}`,
      description,
      images: [`${siteUrl}${SOCIAL_IMAGE_PATH}`],
    },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport: Viewport = { themeColor: "#2E2E2E", colorScheme: "light" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { settings } = await getPublicContent();
  return (
    <html lang="en" className={`${manrope.variable} ${instrument.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <SmoothScroll>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteNav enabled={settings.sections} />
          <main id="main-content">{children}</main>
          {settings.sections.contact && <Footer settings={settings} />}
        </SmoothScroll>
      </body>
    </html>
  );
}
