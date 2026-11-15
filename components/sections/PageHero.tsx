'use client';

import type { ReactNode } from 'react';
import Section from '@/components/ui/Section';
import Heading from '@/components/ui/Heading';
import Reveal from '@/components/ui/Reveal';
import Aurora from '@/components/reactbits/Aurora';

/** Testata delle pagine interne: scura, compatta, con l'aurora appena accennata. */
export default function PageHero({
  eyebrow,
  title,
  lead,
  children,
  aurora = true,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  aurora?: boolean;
}) {
  return (
    <Section theme="dark" pad={false} className="overflow-hidden pt-[9.5rem] pb-20 md:pt-[12rem] md:pb-28">
      {aurora && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Aurora
            className="absolute inset-x-0 top-0 h-[55vh]"
            colorStops={['#1b3fa8', '#2f6bff', '#7aa2ff']}
            amplitude={0.8}
            blend={0.6}
            speed={0.35}
            opacity={0.45}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-ink)]" />
        </div>
      )}

      <div className="shell relative">
        <Reveal className="mb-7 flex items-center gap-3" y={14}>
          <span className="h-px w-8 bg-[var(--color-accent)]" />
          <span className="eyebrow text-[var(--fg-muted)]">{eyebrow}</span>
        </Reveal>

        <Heading text={title} tag="h1" className="display-xl max-w-[13ch]" />

        {lead && (
          <Reveal delay={0.15}>
            <p className="lead mt-9 max-w-2xl text-[var(--fg-muted)]">{lead}</p>
          </Reveal>
        )}

        {children}
      </div>
    </Section>
  );
}
