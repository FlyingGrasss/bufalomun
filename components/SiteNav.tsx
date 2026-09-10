"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { DialogContent, DialogRoot, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const links = [
  ["about", "About"],
  ["letters", "Letters"],
  ["committees", "Committees"],
  ["team", "Team"],
  ["applications", "Apply"],
  ["contact", "Contact"],
] as const;

export default function SiteNav({ enabled }: { enabled: Record<string, boolean> }) {
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = links.flatMap(([id]) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -60%", threshold: [0, 0.25, 0.75] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const visibleLinks = links.filter(([id]) => enabled[id] !== false);
  const anchorClass = (id: string) => cn(
    "text-xs font-extrabold uppercase tracking-[.16em] transition-colors hover:text-[var(--red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)]",
    active === id ? "text-[var(--red)]" : "text-white/72",
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--charcoal)] text-white">
      <div className="site-container flex h-20 items-center justify-between gap-8">
        <Link href="/#top" className="flex items-center gap-3 font-extrabold tracking-[.12em]" aria-label="BUFALOMUN home">
          <Image src="/logo.jpg" alt="" width={46} height={46} className="size-11 rounded-full object-cover" priority />
          <span>BUFALOMUN</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {visibleLinks.map(([id, label]) => <Link key={id} href={`/#${id}`} className={anchorClass(id)} aria-current={active === id ? "location" : undefined}>{label}</Link>)}
        </nav>
        <DialogRoot open={open} onOpenChange={setOpen}>
          <DialogTrigger className="grid size-11 place-items-center border border-white/25 lg:hidden" aria-label="Open navigation"><Menu aria-hidden="true" /></DialogTrigger>
          <DialogContent title="Navigation" className="max-w-sm bg-[var(--charcoal)] text-white">
            <div className="mb-10">
              <span className="font-extrabold tracking-[.12em]">BUFALOMUN</span>
            </div>
            <nav className="flex flex-col" aria-label="Mobile navigation">
              {visibleLinks.map(([id, label]) => <Link key={id} href={`/#${id}`} onClick={() => setOpen(false)} className="border-t border-white/15 py-5 font-display text-4xl last:border-b">{label}</Link>)}
            </nav>
          </DialogContent>
        </DialogRoot>
      </div>
    </header>
  );
}
