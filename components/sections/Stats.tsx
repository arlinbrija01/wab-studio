'use client';

import type { SiteDict } from '@/content';
import type { Locale } from '@/lib/routes';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import Marquee from '@/components/ui/Marquee';

export default function Stats({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  return (
    <Section theme="paper">
      <div className="shell">
        <Reveal className="mb-12 flex items-center gap-3" y={14}>
          <span className="h-px w-8 bg-[var(--color-accent)]" />
          <span className="eyebrow text-[var(--fg-muted)]">{dict.stats.eyebrow}</span>
        </Reveal>

        <Reveal
          className="grid gap-x-8 gap-y-12 border-t border-[var(--line)] pt-12 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.09}
          y={34}
        >
          {dict.stats.items.map((stat) => (
            <div key={stat.label}>
              <p className="display-lg tabular-nums">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  locale={locale === 'de' ? 'de-DE' : 'it-IT'}
                />
              </p>
              <p className="mt-4 max-w-[18ch] text-[0.92rem] leading-relaxed text-[var(--fg-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>

      <div className="mt-20 border-y border-[var(--line)] py-5">
        <Marquee
          items={dict.stack.items}
          speed={42}
          reverse
          separator="·"
          itemClassName="display-sm !font-medium text-[var(--fg-muted)]"
        />
      </div>
    </Section>
  );
}
