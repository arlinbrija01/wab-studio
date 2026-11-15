'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { path, type Locale } from '@/lib/routes';
import type { SiteDict } from '@/content';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

/**
 * Chiusura della pagina: invito al contatto.
 * Il titolo si scopre riga per riga agganciato allo scorrimento.
 */
export default function CtaBand({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  const root = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        glow.current,
        { scale: 0.75, autoAlpha: 0.25 },
        {
          scale: 1.15,
          autoAlpha: 0.6,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        }
      );
    },
    { scope: root }
  );

  return (
    <Section theme="dark" className="overflow-hidden">
      <div ref={root} className="shell relative">
        <div
          ref={glow}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(47,107,255,0.55) 0%, rgba(47,107,255,0.12) 45%, transparent 70%)',
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          <Reveal y={26}>
            <h2 className="display-lg max-w-[16ch]">{dict.cta.title}</h2>
          </Reveal>

          <Reveal y={20} delay={0.1}>
            <p className="lead mt-7 max-w-xl text-[var(--fg-muted)]">{dict.cta.lead}</p>
          </Reveal>

          <Reveal className="mt-11 flex flex-wrap items-center justify-center gap-3" stagger={0.08}>
            <span className="inline-flex">
              <Button href={path(locale, 'contact')} variant="accent" arrow>
                {dict.cta.button}
              </Button>
            </span>
            <span className="inline-flex">
              <Button href={path(locale, 'services')} variant="outline">
                {dict.cta.secondary}
              </Button>
            </span>
          </Reveal>

          <Reveal className="mt-12" y={14} delay={0.2}>
            <a
              href={`mailto:${dict.site.email}`}
              className="display-sm !font-normal underline decoration-[var(--line)] underline-offset-[0.35em] transition-colors duration-500 hover:decoration-[var(--color-accent)]"
            >
              {dict.site.email}
            </a>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
