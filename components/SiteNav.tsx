"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, FilePenLine, Landmark, MailOpen, Menu, MessageCircle, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { DialogContent, DialogRoot, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const links: ReadonlyArray<{ id: string; label: string; icon: LucideIcon }> = [
  { id: "about", label: "About", icon: Compass },
  { id: "letters", label: "Letters", icon: MailOpen },
  { id: "committees", label: "Committees", icon: Landmark },
  { id: "team", label: "Team", icon: UsersRound },
  { id: "applications", label: "Apply", icon: FilePenLine },
  { id: "contact", label: "Contact", icon: MessageCircle },
];

export default function SiteNav({ enabled }: { enabled: Record<string, boolean> }) {
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const sections = links.flatMap(({ id }) => {
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

  const handleNavClick = (id: string, event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (pathname === "/") {
      event.preventDefault();
      const target = document.getElementById(id);
      if (target) {
        const headerOffset = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
        if (lenis) {
          lenis.scrollTo(target, { offset: -headerOffset });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
        window.history.replaceState(null, "", id === "top" ? "/" : `/#${id}`);
      }
    }
  };

  const visibleLinks = links.filter(({ id }) => enabled[id] !== false);
  const anchorClass = (id: string) => cn(
    "text-xs font-extrabold uppercase tracking-[.16em] transition-colors hover:text-[var(--red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)]",
    active === id ? "text-[var(--red)]" : "text-white/72",
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--charcoal)] text-white">
      <div className="site-container flex h-[var(--nav-height)] items-center justify-between gap-4 lg:gap-8">
        <Link
          href="/#top"
          onClick={(event) => handleNavClick("top", event)}
          className="flex items-center gap-2.5 font-extrabold tracking-[.12em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)] lg:gap-3"
          aria-label="BUFALOMUN home"
        >
          <Image src="/logo.jpg" alt="" width={46} height={46} className="size-10 rounded-full object-cover lg:size-11" priority />
          <span className="text-sm lg:text-base">BUFALOMUN</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {visibleLinks.map(({ id, label }) => (
            <Link
              key={id}
              href={`/#${id}`}
              onClick={(event) => handleNavClick(id, event)}
              className={anchorClass(id)}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <DialogRoot open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation-drawer"
          >
            <Menu aria-hidden="true" size={21} />
          </DialogTrigger>
          <DialogContent
            id="mobile-navigation-drawer"
            title="Navigation"
            description="Find your way around BUFALOMUN."
            variant="drawer"
          >
            <div className="mb-6 border-y border-white/10 py-4">
              <p className="eyebrow text-[var(--red)]">BUFALOMUN&apos;26</p>
              <p className="mt-2 text-sm leading-6 text-white/55">The conference menu</p>
            </div>

            <nav className="flex flex-col" aria-label="Mobile navigation">
              {visibleLinks.map(({ id, label, icon: Icon }) => (
                <Link
                  key={id}
                  href={`/#${id}`}
                  onClick={(event) => handleNavClick(id, event)}
                  className={cn(
                    "group flex min-h-14 items-center gap-3 border-t border-white/12 py-4 text-xl font-semibold transition-colors last:border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--red)]",
                    active === id ? "text-[var(--red)]" : "text-white hover:text-[var(--buffalo)]",
                  )}
                  aria-current={active === id ? "location" : undefined}
                >
                  <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
                  <span>{label}</span>
                  <ArrowUpRight aria-hidden="true" className="ml-auto size-4 opacity-45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </nav>

            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="eyebrow text-white/40">BUFALOMUN&apos;26</p>
              <p className="mt-2 max-w-[16rem] text-sm leading-6 text-white/55">Research boldly. Debate clearly. Build together.</p>
            </div>
          </DialogContent>
        </DialogRoot>
      </div>
    </header>
  );
}
