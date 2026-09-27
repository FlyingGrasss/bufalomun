import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getPublicContent } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicContent();
  return {
    title: "Application received",
    description: `Your application to ${settings.conference.displayName} has been received.`,
    robots: { index: false, follow: false },
  };
}

export default function SuccessPage() {
  return <div className="site-container grid min-h-[70svh] place-items-center py-20 text-center"><div className="max-w-xl"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--red)] text-white"><Check className="size-8" /></span><p className="eyebrow mt-7 text-[var(--red)]">Application received</p><h1 className="mt-4 font-display text-6xl leading-none">Thank you for applying.</h1><p className="mt-6 leading-7 text-[var(--muted)]">Your verified application has been delivered to the BUFALOMUN team.</p><Link href="/" className={`${buttonVariants({ variant: "light" })} mt-8`}>Return home</Link></div></div>;
}
