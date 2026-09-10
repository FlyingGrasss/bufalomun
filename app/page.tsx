import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Countdown from "@/components/Countdown";
import FadeIn from "@/components/FadeIn";
import StructuredData from "@/components/StructuredData";
import { buttonVariants } from "@/components/ui/button";
import { formatConferenceText } from "@/config/conference";
import { getPublicContent } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

function SectionTitle({ number, kicker, children, light = false }: { number: string; kicker: string; children: React.ReactNode; light?: boolean }) {
  return (
    <FadeIn>
      <div className="grid gap-5 border-t border-current/20 pt-5 md:grid-cols-[10rem_1fr]">
        <p className={cn("eyebrow", light ? "text-white/50" : "text-[var(--brown)]")}>{number} / {kicker}</p>
        <h2 className="max-w-4xl font-display text-5xl leading-[.94] sm:text-7xl lg:text-8xl">{children}</h2>
      </div>
    </FadeIn>
  );
}

export default async function Home() {
  const { settings, committees, team } = await getPublicContent();
  const enabledApplications = settings.applications.filter((application) => application.enabled);
  const place = `${settings.conference.location.venue}, ${settings.conference.location.city}`;

  return (
    <>
      <StructuredData settings={settings} />
      <section id="top" className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-[var(--charcoal)] text-white">
        <div className="absolute inset-y-0 right-0 -z-10 w-[46%] bg-[var(--brown)] opacity-45" />
        <div className="site-container grid min-h-[calc(100svh-5rem)] items-center gap-12 py-14 lg:grid-cols-[1fr_25rem]">
          <FadeIn delay={100}>
            <div>
              <p className="eyebrow text-[var(--red)]">{settings.conference.fullName}</p>
              <h1 className="mt-7 font-display text-[clamp(5rem,15vw,11rem)] leading-[.75] tracking-[-.04em]">
                BUFALO<span className="block text-[var(--buffalo)]">MUN<span className="text-[var(--red)]">’26</span></span>
              </h1>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm font-bold uppercase tracking-[.1em] text-white/78">
                <span className="flex items-center gap-2"><CalendarDays className="size-4 text-[var(--red)]" />{settings.conference.dates}</span>
                <span className="flex items-center gap-2"><MapPin className="size-4 text-[var(--red)]" />{place}</span>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="#applications" className={buttonVariants({ variant: "primary", className: "min-h-12 px-7" })}>
                  Applications <ArrowDown className="size-4" />
                </Link>
                <Link href="#about" className={buttonVariants({ variant: "light", className: "min-h-12 px-7" })}>
                  Explore the conference
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={250} className="mx-auto w-full max-w-sm">
            <div className="relative aspect-square border border-white/20 bg-[var(--charcoal)] p-5">
              <Image src="/logo.jpg" alt="BUFALOMUN buffalo and laurel logo" fill sizes="(max-width: 1024px) 80vw, 400px" className="object-cover p-5" priority />
            </div>
            <div className="mt-8">
              <Countdown date={settings.conference.startDateIso} />
            </div>
          </FadeIn>
        </div>
      </section>

      {settings.sections.about && (
        <section id="about" className="section-shell bg-[var(--paper)]">
          <div className="site-container">
            <SectionTitle number="01" kicker="The conference">Diplomacy has a new home in the west.</SectionTitle>
            <div className="mt-16 grid gap-10 md:grid-cols-[1fr_1.6fr]">
              <FadeIn delay={120}>
                <p className="eyebrow text-[var(--red)]">{settings.conference.hashtag}</p>
              </FadeIn>
              <FadeIn delay={200} className="space-y-8 text-xl leading-relaxed text-[var(--ink)]/78 sm:text-2xl">
                <p>{settings.conference.displayName} is the {settings.conference.sessionName.toLowerCase()}. Across three days, participants will research urgent questions, defend ideas, negotiate, and build solutions together.</p>
                <p>Hosted at {settings.conference.location.venue}, the conference brings an ambitious MUN experience to {settings.conference.location.city} with committees designed for sharp debate and meaningful collaboration.</p>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {settings.sections.letters && (
        <section id="letters" className="section-shell bg-[var(--buffalo)]">
          <div className="site-container">
            <SectionTitle number="02" kicker="Letters">A welcome from the people behind the session.</SectionTitle>
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              {settings.letters.map((letter, index) => (
                <FadeIn key={letter.id} delay={index * 140} as="article" className="border-t-2 border-[var(--charcoal)] pt-7">
                  <p className="eyebrow text-[var(--red)]">Letter {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 font-display text-4xl leading-none">{letter.titlePrefix} <span className="text-[var(--red)]">{letter.titleHighlight}</span></h3>
                  <p className="mt-9 font-bold">{letter.opening},</p>
                  <div className="mt-5 space-y-5 leading-7 text-[var(--ink)]/75">
                    {letter.paragraphs.map((paragraph) => <p key={paragraph}>{formatConferenceText(paragraph, settings)}</p>)}
                  </div>
                  {letter.author && <p className="mt-8 text-sm font-extrabold uppercase tracking-[.12em]">{letter.author}</p>}
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings.sections.committees && (
        <section id="committees" className="section-shell bg-[var(--charcoal)] text-white">
          <div className="site-container">
            <SectionTitle number="03" kicker="Committees" light>Rooms built for bold questions.</SectionTitle>
            {committees.length ? (
              <div className="mt-16 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
                {committees.map((committee, index) => (
                  <FadeIn key={committee.id} delay={index * 90}>
                    <Link href={`/committees/${committee.slug}`} className="group block min-h-72 bg-[var(--charcoal)] p-7 transition-colors hover:bg-[var(--brown)]">
                      <p className="eyebrow text-white/45">Committee {String(index + 1).padStart(2, "0")}</p>
                      <h3 className="mt-16 font-display text-4xl">{committee.name}</h3>
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-white/65">{committee.description}</p>
                      <span className="mt-8 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[var(--red)]">
                        Discover <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </span>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <FadeIn delay={120} className="mt-16 border-y border-white/15 py-16">
                <p className="eyebrow text-[var(--red)]">The agenda is taking shape</p>
                <p className="mt-4 max-w-2xl font-display text-4xl text-white/85 sm:text-5xl">Committee announcements are coming soon.</p>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {settings.sections.team && (
        <section id="team" className="section-shell bg-[var(--paper)]">
          <div className="site-container">
            <SectionTitle number="04" kicker="Secretariat">Meet the team shaping BUFALOMUN.</SectionTitle>
            {team.length ? (
              <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((member, index) => (
                  <FadeIn key={member.id} delay={index * 90}>
                    <Link href={`/team/${member.slug}`} className="group block border-t border-[var(--ink)] pt-5">
                      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--buffalo)]">
                        {member.imageUrl ? (
                          <Image src={member.imageUrl} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                        ) : (
                          <div className="grid size-full place-items-center font-display text-7xl text-[var(--brown)]">{member.name.charAt(0)}</div>
                        )}
                      </div>
                      <h3 className="mt-5 font-display text-3xl">{member.name}</h3>
                      <p className="mt-1 text-xs font-extrabold uppercase tracking-[.13em] text-[var(--red)]">{member.role}</p>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <FadeIn delay={120} className="mt-16 grid gap-8 border-y border-[var(--ink)]/20 py-14 md:grid-cols-2">
                <p className="eyebrow text-[var(--red)]">Behind the scenes</p>
                <p className="font-display text-4xl sm:text-5xl">The full secretariat will be introduced soon.</p>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {settings.sections.applications && (
        <section id="applications" className="section-shell bg-[var(--brown)] text-white">
          <div className="site-container">
            <SectionTitle number="05" kicker="Applications" light>Choose the role you want to play.</SectionTitle>
            <div className="mt-16 divide-y divide-white/20 border-y border-white/20">
              {enabledApplications.map((application, index) => (
                <FadeIn key={application.id} delay={index * 80}>
                  <Link href={`/apply/${application.id}`} className="group grid gap-5 py-8 md:grid-cols-[5rem_14rem_1fr_auto] md:items-center">
                    <span className="eyebrow text-white/45">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-4xl">{application.title}</h3>
                    <p className="max-w-xl text-sm leading-6 text-white/65">{application.description}</p>
                    <span className="grid size-12 place-items-center border border-white/30 transition-colors group-hover:border-[var(--red)] group-hover:bg-[var(--red)]">
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
