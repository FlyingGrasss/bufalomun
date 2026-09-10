import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getTeamMemberBySlug } from "@/lib/site-settings";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getTeamMemberBySlug(slug);
  return { title: item?.name || "Team", description: item?.bio };
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getTeamMemberBySlug(slug);
  if (!item) notFound();
  return <article className="site-container py-14 sm:py-24"><Link href="/#team" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brown)] hover:text-[var(--red)]"><ArrowLeft className="size-4" /> Secretariat</Link><div className="mt-12 grid gap-12 lg:grid-cols-[24rem_1fr]"><div className="relative aspect-[4/5] bg-[var(--buffalo)]">{item.imageUrl ? <Image src={item.imageUrl} alt="" fill unoptimized className="object-cover" sizes="400px" /> : <div className="grid size-full place-items-center font-display text-8xl text-[var(--brown)]">{item.name.charAt(0)}</div>}</div><div className="self-center"><p className="eyebrow text-[var(--red)]">{item.role}</p><h1 className="mt-4 font-display text-6xl leading-none sm:text-8xl">{item.name}</h1><p className="mt-9 max-w-2xl whitespace-pre-line text-lg leading-8 text-[var(--muted)]">{item.bio}</p>{item.instagram && <Link href={item.instagram} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-bold hover:text-[var(--red)]"><ExternalLink className="size-5" /> Instagram</Link>}</div></div></article>;
}
