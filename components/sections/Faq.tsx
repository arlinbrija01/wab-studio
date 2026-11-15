'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import type { SiteDict } from '@/content';
import Section from '@/components/ui/Section';
import Heading from '@/components/ui/Heading';
import Reveal from '@/components/ui/Reveal';

/**
 * Domande frequenti. L'apertura è animata con GSAP sull'altezza "auto",
 * che GSAP sa misurare da solo, e resta accessibile da tastiera.
 */
export default function Faq({ dict }: { dict: SiteDict }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section theme="light">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal className="mb-6 flex items-center gap-3" y={14}>
              <span className="h-px w-8 bg-[var(--color-accent)]" />
              <span className="eyebrow text-[var(--fg-muted)]">{dict.faq.eyebrow}</span>
            </Reveal>
            <Heading text={dict.faq.title} className="display-md max-w-[12ch]" />
          </div>

          <div className="md:col-span-8">
            <ul className="border-t border-[var(--line)]">
              {dict.faq.items.map((item, i) => (
                <FaqRow
                  key={item.q}
                  question={item.q}
                  answer={item.a}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? null : i)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FaqRow({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const body = useRef<HTMLDivElement>(null);
  const icon = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const duration = prefersReducedMotion() ? 0 : 0.55;

      gsap.to(body.current, {
        height: open ? 'auto' : 0,
        autoAlpha: open ? 1 : 0,
        duration,
        ease: 'power3.inOut',
        // L'altezza della pagina è cambiata: i trigger vanno ricalcolati.
        onComplete: () => ScrollTrigger.refresh(),
      });

      gsap.to(icon.current, { rotate: open ? 45 : 0, duration, ease: 'power3.inOut' });
    },
    { dependencies: [open] }
  );

  return (
    <li className="border-b border-[var(--line)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 text-left transition-opacity duration-300 hover:opacity-60"
      >
        <span className="display-sm max-w-[32ch]">{question}</span>
        <span ref={icon} aria-hidden className="shrink-0 text-[var(--color-accent)]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div ref={body} className="h-0 overflow-hidden opacity-0">
        <p className="max-w-[62ch] pb-7 text-[1rem] leading-relaxed text-[var(--fg-muted)]">
          {answer}
        </p>
      </div>
    </li>
  );
}
