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

/**
 * Elenco servizi in stile editoriale: una riga per servizio,
 * che si apre al passaggio del mouse.
 */
export default function Services({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const rows = gsap.utils.toArray<HTMLElement>('[data-service-row]');

      // Ingresso delle righe, raggruppate: tutte quelle che entrano
      // nello stesso momento partono insieme, in sequenza.
      gsap.from(rows, {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 72%', once: true },
      });

      // Al passaggio del mouse: numero e freccia si spostano.
      const cleanups = rows.map((row) => {
        const arrow = row.querySelector('[data-service-arrow]');
        const num = row.querySelector('[data-service-num]');
        const tween = gsap.to([arrow, num], {
          x: 8,
          duration: 0.5,
          ease: 'power3.out',
          paused: true,
        });
        const enter = () => tween.play();
        const leave = () => tween.reverse();
        row.addEventListener('mouseenter', enter);
        row.addEventListener('mouseleave', leave);
        return () => {
          row.removeEventListener('mouseenter', enter);
          row.removeEventListener('mouseleave', leave);
        };
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root }
  );

  return (
    <Section theme="dark" id="servizi">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal className="mb-6 flex items-center gap-3" y={14}>
              <span className="h-px w-8 bg-[var(--color-accent)]" />
              <span className="eyebrow text-[var(--fg-muted)]">{dict.services.eyebrow}</span>
            </Reveal>
            <Heading text={dict.services.title} className="display-lg max-w-[16ch]" />
          </div>
          <div className="md:col-span-5">
            <Reveal>
              <p className="max-w-md text-[0.98rem] leading-relaxed text-[var(--fg-muted)]">
                {dict.services.lead}
              </p>
              <div className="mt-7">
                <Button href={path(locale, 'services')} variant="outline" arrow>
                  {dict.services.cta}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        <div ref={root} className="mt-20 border-t border-[var(--line)]">
          {dict.services.items.map((service) => (
            <Link
              key={service.slug}
              data-service-row
              href={`${path(locale, 'services')}#${service.slug}`}
              className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 border-b border-[var(--line)] py-7 transition-colors duration-500 hover:bg-white/[0.025] md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,22rem)_3rem] md:gap-x-8 md:py-9"
            >
              <span
                data-service-num
                className="eyebrow text-[var(--color-accent)] md:self-center"
              >
                {service.num}
              </span>

              <h3 className="display-sm col-start-2 transition-opacity duration-500 group-hover:opacity-100 md:self-center">
                {service.title}
              </h3>

              <p className="col-span-2 col-start-2 max-w-md text-[0.9rem] leading-relaxed text-[var(--fg-muted)] md:col-span-1 md:col-start-3 md:self-center">
                {service.short}
              </p>

              <span
                data-service-arrow
                aria-hidden
                className="col-start-3 row-start-1 self-center justify-self-end text-[var(--fg-muted)] transition-colors duration-500 group-hover:text-[var(--fg)] md:col-start-4"
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
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
