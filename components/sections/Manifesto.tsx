'use client';

import type { SiteDict } from '@/content';
import Section from '@/components/ui/Section';
import ScrollReveal from '@/components/reactbits/ScrollReveal';
import Reveal from '@/components/ui/Reveal';

/**
 * Primo passaggio dal nero al bianco.
 * Il testo si accende parola per parola mentre si scorre: componente
 * ScrollReveal di React Bits, che sotto usa GSAP ScrollTrigger.
 */
export default function Manifesto({ dict }: { dict: SiteDict }) {
  return (
    <Section theme="paper" className="overflow-hidden">
      <div className="shell">
        <Reveal className="mb-12 flex items-center gap-3">
          <span className="h-px w-8 bg-[var(--color-accent)]" />
          <span className="eyebrow text-[var(--fg-muted)]">{dict.manifesto.eyebrow}</span>
        </Reveal>

        <ScrollReveal
          containerClassName="max-w-5xl"
          textClassName="display-md !leading-[1.22] text-[var(--fg)]"
          baseOpacity={0.12}
          baseRotation={1.5}
          blurStrength={5}
          enableBlur
          stagger={0.035}
          splitBy="words"
          effect="fade"
          mode="scrub"
          wordAnimationEnd="center 58%"
          rotationEnd="center 72%"
        >
          {dict.manifesto.text}
        </ScrollReveal>

        <Reveal className="mt-14 flex items-center gap-4" y={16}>
          <span className="hairline max-w-28" />
          <span className="eyebrow text-[var(--fg-muted)]">{dict.manifesto.signature}</span>
        </Reveal>
      </div>
    </Section>
  );
}
