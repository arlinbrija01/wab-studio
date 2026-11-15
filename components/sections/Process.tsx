'use client';

import type { SiteDict } from '@/content';
import Section from '@/components/ui/Section';
import Heading from '@/components/ui/Heading';
import Reveal from '@/components/ui/Reveal';
import ScrollStack, { ScrollStackItem } from '@/components/reactbits/ScrollStack';

/**
 * I cinque passi del metodo, come schede che si impilano una sull'altra
 * mentre si scorre. Componente ScrollStack di React Bits, agganciato
 * allo scorrimento della finestra (lo smorzamento lo fa già Lenis).
 */
export default function Process({ dict }: { dict: SiteDict }) {
  return (
    <Section theme="dark" pad={false} className="pt-[clamp(5rem,12vh,10rem)] pb-10">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal className="mb-6 flex items-center gap-3" y={14}>
              <span className="h-px w-8 bg-[var(--color-accent)]" />
              <span className="eyebrow text-[var(--fg-muted)]">{dict.process.eyebrow}</span>
            </Reveal>
            <Heading text={dict.process.title} className="display-lg" />
          </div>
          <div className="md:col-span-5">
            <Reveal>
              <p className="max-w-md text-[0.98rem] leading-relaxed text-[var(--fg-muted)]">
                {dict.process.lead}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <ScrollStack
        useWindowScroll
        smoothScroll={false}
        className="mt-4"
        itemDistance={90}
        itemStackDistance={22}
        stackPosition="22%"
        itemScale={0.035}
        baseScale={0.86}
        dimAmount={0.28}
        rotationAmount={0}
        holdDistance={160}
      >
        {dict.process.steps.map((step) => (
          <ScrollStackItem
            key={step.num}
            itemClassName="mx-auto max-w-5xl rounded-3xl border border-[var(--line)] p-8 md:p-14"
            // Inline perché il componente porta già un fondo chiaro di default:
            // qui lo riportiamo ai colori della sezione e lasciamo crescere l'altezza.
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--fg)',
              height: 'auto',
              minHeight: '18rem',
              boxShadow: '0 30px 80px -40px rgba(0,0,0,0.9)',
            }}
          >
            <div className="grid gap-6 md:grid-cols-[6rem_minmax(0,1fr)] md:gap-10">
              <span className="eyebrow text-[var(--color-accent)]">{step.num}</span>
              <div>
                <h3 className="display-md">{step.title}</h3>
                <p className="lead mt-5 max-w-2xl text-[var(--fg-muted)]">{step.desc}</p>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </Section>
  );
}
