import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ApplicationForm from "@/components/ApplicationForm";
import { getPublicContent } from "@/lib/site-settings";
import { isApplicationType } from "@/lib/applications/validation";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params; const { settings } = await getPublicContent();
  const application = settings.applications.find((item) => item.id === type);
  return { title: application?.formTitle || "Application" };
}

export default async function ApplicationPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isApplicationType(type)) notFound();
  const { settings } = await getPublicContent();
  const application = settings.applications.find((item) => item.id === type && item.enabled);
  if (!application) notFound();
  return <div className="bg-[var(--paper)]"><div className="site-container py-12 sm:py-20">
    <Link href="/#applications" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brown)] hover:text-[var(--red)]"><ArrowLeft className="size-4" /> All applications</Link>
    <div className="mt-10 grid gap-10 lg:grid-cols-[19rem_1fr]">
      <aside><p className="eyebrow text-[var(--red)]">BUFALOMUN’26</p><h1 className="mt-4 font-display text-5xl leading-none">{application.formTitle}</h1><p className="mt-6 text-sm leading-6 text-[var(--muted)]">{application.description}</p></aside>
      <div className="rounded-xl border border-[var(--border)] bg-[#fbf8f5] p-5 sm:p-8"><ApplicationForm application={application} settings={settings} /></div>
    </div>
  </div></div>;
}
