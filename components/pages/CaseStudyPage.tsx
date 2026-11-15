import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { path, type Locale } from '@/lib/routes';
import { getDict } from '@/lib/data/content';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import CaseVisual from '@/components/ui/CaseVisual';
import Heading from '@/components/ui/Heading';
import CtaBand from '@/components/sections/CtaBand';

export default async function CaseStudyPage({ locale, slug }: { locale: Locale; slug: string }) {
  const dict = await getDict(locale);
  const index = dict.work.items.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const item = dict.work.items[index];
  const next = dict.work.items[(index + 1) % dict.work.items.length];
  const labels = dict.work.caseLabels;

  return (
    <>
      {/* Testata */}
      <Section theme="dark" pad={false} className="pt-[9.5rem] pb-16 md:pt-[12rem]">
        <div className="shell">
          <Reveal className="mb-8" y={14}>
            <Link
              href={path(locale, 'work')}
              className="eyebrow inline-flex items-center gap-2 text-[var(--fg-muted)] transition-colors duration-300 hover:text-[var(--fg)]"
            >
              <span aria-hidden>←</span> {labels.back}
            </Link>
          </Reveal>

          <p className="eyebrow mb-6 text-[var(--color-accent)]">{item.client}</p>
          <Heading text={item.title} tag="h1" className="display-lg max-w-[18ch]" />

          <Reveal
            className="mt-14 grid gap-8 border-t border-[var(--line)] pt-10 sm:grid-cols-3"
            stagger={0.08}
          >
            <div>
              <p className="eyebrow mb-3 text-[var(--fg-muted)]">{labels.sector}</p>
              <p className="text-[0.95rem]">{item.sector}</p>
            </div>
            <div>
              <p className="eyebrow mb-3 text-[var(--fg-muted)]">{labels.year}</p>
              <p className="text-[0.95rem]">{item.year}</p>
            </div>
            <div>
              <p className="eyebrow mb-3 text-[var(--fg-muted)]">{labels.services}</p>
              <p className="text-[0.95rem]">{item.services.join(', ')}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Copertina */}
      <Section theme="dark" pad={false} className="pb-[clamp(4rem,10vh,8rem)]">
        <div className="shell">
          <Reveal y={40}>
            <CaseVisual
              accent={item.accent}
              client={item.client}
              image={item.cover}
              index={index}
              priority
              className="aspect-[16/9] w-full"
            />
          </Reveal>
        </div>
      </Section>

      {/* Racconto */}
      <Section theme="paper">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="display-sm">{labels.challenge}</h2>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal delay={0.1}>
              <p className="lead text-[var(--fg-muted)]">{item.challenge}</p>
            </Reveal>
          </div>

          <div className="md:col-span-5 md:col-start-1">
            <Reveal>
              <h2 className="display-sm">{labels.solution}</h2>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal delay={0.1}>
              <p className="lead text-[var(--fg-muted)]">{item.solution}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Galleria */}
      {item.gallery.length > 0 && (
        <Section theme="paper" pad={false} className="pb-[clamp(4rem,10vh,8rem)]">
          <div className="shell grid gap-5 md:grid-cols-2">
            {item.gallery.map((src, i) => (
              <Reveal key={src} y={34} delay={(i % 2) * 0.08}>
                <Image
                  src={src}
                  alt={`${item.client} — ${item.title}`}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full rounded-2xl border border-[var(--line)] object-cover"
                />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Numeri */}
      <Section theme="dark">
        <div className="shell">
          <Reveal className="mb-12 flex items-center gap-3" y={14}>
            <span className="h-px w-8 bg-[var(--color-accent)]" />
            <span className="eyebrow text-[var(--fg-muted)]">{labels.result}</span>
          </Reveal>

          <Reveal
            className="grid gap-x-8 gap-y-12 border-t border-[var(--line)] pt-12 sm:grid-cols-3"
            stagger={0.1}
            y={34}
          >
            {item.results.map((result) => (
              <div key={result.label}>
                <p className="display-lg tabular-nums">{result.value}</p>
                <p className="mt-4 max-w-[20ch] text-[0.92rem] leading-relaxed text-[var(--fg-muted)]">
                  {result.label}
                </p>
              </div>
            ))}
          </Reveal>

          {item.liveUrl && (
            <Reveal className="mt-14" y={18}>
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base border border-[var(--line)] text-[var(--fg)] transition-colors hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
              >
                {labels.visit}
                <span aria-hidden>↗</span>
              </a>
            </Reveal>
          )}
        </div>
      </Section>

      {/* Progetto successivo */}
      <Section theme="paper" pad={false} className="py-[clamp(4rem,9vh,7rem)]">
        <div className="shell">
          <p className="eyebrow mb-7 text-[var(--fg-muted)]">{labels.next}</p>
          <Link href={path(locale, 'work', next.slug)} className="group grid gap-7 md:grid-cols-12 md:items-center">
            <CaseVisual
              accent={next.accent}
              client={next.client}
              image={next.cover}
              index={index + 1}
              className="aspect-[16/9] w-full md:col-span-5"
            />
            <div className="md:col-span-7">
              <p className="eyebrow text-[var(--fg-muted)]">
                {next.client} · {next.year}
              </p>
              <h2 className="display-md mt-3 max-w-[20ch] transition-opacity duration-500 group-hover:opacity-60">
                {next.title}
              </h2>
            </div>
          </Link>
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
