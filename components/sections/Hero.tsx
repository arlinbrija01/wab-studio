'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { path, type Locale } from '@/lib/routes';
import type { SiteDict } from '@/content';
import Aurora from '@/components/reactbits/Aurora';
import ShinyText from '@/components/reactbits/ShinyText';
import Button from '@/components/ui/Button';
import Marquee from '@/components/ui/Marquee';

export default function Hero({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  const root = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');

      if (prefersReducedMotion()) {
        gsap.set('[data-anim="hidden"]', { autoAlpha: 1, clearProps: 'all' });
        gsap.set(lines, { yPercent: 0 });
        return;
      }

      /* Prima si rende visibile ciò che il CSS teneva nascosto: le tween
         .from() leggono lo stato attuale come punto di arrivo, quindi se
         restasse a opacità 0 animerebbero da invisibile a invisibile. */
      gsap.set('[data-anim="hidden"]', { autoAlpha: 1 });

      /* Ingresso: le righe del titolo salgono da dietro la loro maschera,
         poi arrivano occhiello, testo e pulsanti. Una sola timeline, così
         i tempi restano coerenti anche cambiando una durata. */
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });

      tl.from('[data-hero-eyebrow]', { autoAlpha: 0, y: 18, duration: 0.9 })
        .from(
          lines,
          { yPercent: 115, duration: 1.25, stagger: 0.085 },
          '-=0.6'
        )
        .from(
          '[data-hero-lead]',
          { autoAlpha: 0, y: 24, filter: 'blur(8px)', duration: 1 },
          '-=0.8'
        )
        .from('[data-hero-cta]', { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.08 }, '-=0.75')
        .from('[data-hero-tail]', { autoAlpha: 0, duration: 1 }, '-=0.6');

      /* Uscita legata allo scorrimento: il contenuto si allontana
         mentre la sezione successiva sale. */
      gsap.to(contentRef.current, {
        y: -90,
        autoAlpha: 0,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom 35%',
          scrub: 0.6,
        },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-theme="dark"
      data-nav="dark"
      className="themed relative flex min-h-[100svh] flex-col justify-between overflow-hidden"
    >
      {/* Sfondo: aurora WebGL di React Bits, tenuta volutamente bassa */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Aurora
          className="absolute inset-x-0 top-0 h-[78vh]"
          colorStops={['#1b3fa8', '#2f6bff', '#7aa2ff']}
          amplitude={0.9}
          blend={0.6}
          speed={0.4}
          opacity={0.42}
        />
        <div className="grid-lines absolute inset-0 opacity-[0.35]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-ink)]" />
      </div>

      <div ref={contentRef} className="shell relative z-10 flex flex-1 flex-col justify-center pt-32 pb-10">
        <div data-hero-eyebrow data-anim="hidden" className="mb-7 flex items-center gap-3">
          <span className="h-px w-8 bg-[var(--color-accent)]" />
          <ShinyText
            text={dict.hero.eyebrow}
            className="eyebrow"
            color="#9a9aa8"
            shineColor="#ffffff"
            speed={4}
          />
        </div>

        <h1 className="display-xl max-w-[15ch]">
          {dict.hero.titleLines.map((line, i) => (
            <span key={i} className="line-mask">
              <span data-hero-line className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-hero-lead
          data-anim="hidden"
          className="lead mt-9 max-w-xl text-[var(--fg-muted)]"
        >
          {dict.hero.lead}
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-3">
          <span data-hero-cta data-anim="hidden" className="inline-flex">
            <Button href={path(locale, 'contact')} variant="accent" arrow>
              {dict.hero.ctaPrimary}
            </Button>
          </span>
          <span data-hero-cta data-anim="hidden" className="inline-flex">
            <Button href={path(locale, 'work')} variant="outline">
              {dict.hero.ctaSecondary}
            </Button>
          </span>
        </div>
      </div>

      {/* Coda: nastro dei servizi e invito a scorrere */}
      <div data-hero-tail data-anim="hidden" className="relative z-10">
        <div className="shell mb-6 flex items-center gap-3 text-[var(--fg-muted)]">
          <span className="eyebrow">{dict.hero.scrollHint}</span>
          <span className="relative block h-9 w-px overflow-hidden bg-[var(--line)]">
            <span className="absolute inset-x-0 top-0 h-3 animate-[heroScroll_2.2s_ease-in-out_infinite] bg-[var(--color-accent)]" />
          </span>
        </div>

        <div className="border-y border-[var(--line)] py-4">
          <Marquee
            items={dict.hero.marquee}
            speed={34}
            itemClassName="text-[0.95rem] tracking-[-0.01em] text-[var(--fg-muted)]"
          />
        </div>
      </div>

      <style>{`
        @keyframes heroScroll {
          0%   { transform: translateY(-100%); }
          55%  { transform: translateY(300%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  );
}
