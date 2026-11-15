'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { path, type Locale } from '@/lib/routes';
import type { SiteDict } from '@/content';
import Section from '@/components/ui/Section';
import Heading from '@/components/ui/Heading';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import CaseVisual from '@/components/ui/CaseVisual';

/**
 * Galleria dei lavori che scorre in orizzontale mentre la pagina
 * scorre in verticale. Schema ufficiale di GSAP ScrollTrigger:
 * si blocca la sezione (pin) e si anima la striscia interna con ease "none",
 * così scorrimento e spostamento restano allineati uno a uno.
 * Sotto i 1024px il blocco diventa una fila scorrevole normale.
 */
export default function WorkShowcase({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  const section = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const el = track.current;
        const box = viewport.current;
        if (!el || !box) return;

        const distance = () => Math.max(0, el.scrollWidth - box.clientWidth);

        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: box,
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress.current) {
                progress.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
      });

      return () => mm.revert();
    },
    { scope: section }
  );

  const items = dict.work.items.slice(0, 5);

  return (
    <Section theme="light" pad={false} className="overflow-hidden">
      <div ref={section}>
        <div className="shell pt-[clamp(5rem,12vh,10rem)] pb-14">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Reveal className="mb-6 flex items-center gap-3" y={14}>
                <span className="h-px w-8 bg-[var(--color-accent)]" />
                <span className="eyebrow text-[var(--fg-muted)]">{dict.work.eyebrow}</span>
              </Reveal>
              <Heading text={dict.work.title} className="display-lg" />
            </div>
            <div className="md:col-span-5">
              <Reveal>
                <p className="max-w-md text-[0.98rem] leading-relaxed text-[var(--fg-muted)]">
                  {dict.work.lead}
                </p>
                <div className="mt-7">
                  <Button href={path(locale, 'work')} variant="outline" arrow>
                    {dict.work.cta}
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div
          ref={viewport}
          className="relative flex min-h-[72vh] items-center overflow-x-auto pb-16 lg:h-screen lg:min-h-0 lg:overflow-hidden lg:pb-0"
          style={{ scrollbarWidth: 'none' }}
        >
          <div
            ref={track}
            className="flex w-max items-stretch gap-5 px-[1.25rem] will-change-transform md:gap-7 md:px-10 xl:px-16"
          >
            {items.map((item, i) => (
              <Link
                key={item.slug}
                href={path(locale, 'work', item.slug)}
                className="group relative flex w-[78vw] shrink-0 flex-col sm:w-[58vw] lg:w-[36vw] xl:w-[31vw]"
              >
                <CaseVisual
                  accent={item.accent}
                  client={item.client}
                  image={item.cover}
                  index={i}
                  className="aspect-[4/3] w-full"
                />

                <div className="flex items-start justify-between gap-5 pt-5">
                  <div>
                    <p className="eyebrow text-[var(--fg-muted)]">
                      {item.client} · {item.year}
                    </p>
                    <h3 className="display-sm mt-2 max-w-[22ch] transition-opacity duration-500 group-hover:opacity-65">
                      {item.title}
                    </h3>
                  </div>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-[var(--fg-muted)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-[var(--fg)]"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M5 15 15 5M7 5h8v8"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.services.map((service) => (
                    <li
                      key={service}
                      className="rounded-full border border-[var(--line)] px-3 py-1 text-[0.72rem] tracking-[0.02em] text-[var(--fg-muted)]"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}

            {/* Ultima scheda: invito ad andare all'elenco completo */}
            <Link
              href={path(locale, 'work')}
              className="group flex w-[60vw] shrink-0 items-center justify-center rounded-2xl border border-dashed border-[var(--line)] px-10 sm:w-[40vw] lg:w-[22vw]"
            >
              <span className="display-sm text-center transition-opacity duration-500 group-hover:opacity-60">
                {dict.work.cta}
              </span>
            </Link>
          </div>

          {/* Barra di avanzamento, ferma in basso mentre la sezione è bloccata */}
          <div className="absolute inset-x-0 bottom-14 hidden px-10 lg:block xl:px-16">
            <div className="h-px w-full bg-[var(--line)]">
              <span
                ref={progress}
                className="block h-px origin-left scale-x-0 bg-[var(--color-accent)]"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
