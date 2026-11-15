'use client';

import type { SiteDict } from '@/content';
import Section from '@/components/ui/Section';
import Heading from '@/components/ui/Heading';
import Reveal from '@/components/ui/Reveal';
import SpotlightCard from '@/components/reactbits/SpotlightCard';

export default function Testimonials({ dict }: { dict: SiteDict }) {
  return (
    <Section theme="dark">
      <div className="shell">
        <Reveal className="mb-6 flex items-center gap-3" y={14}>
          <span className="h-px w-8 bg-[var(--color-accent)]" />
          <span className="eyebrow text-[var(--fg-muted)]">{dict.testimonials.eyebrow}</span>
        </Reveal>

        <Heading text={dict.testimonials.title} className="display-lg max-w-[14ch]" />

        <Reveal className="mt-16 grid gap-5 md:grid-cols-3" stagger={0.1} y={36}>
          {dict.testimonials.items.map((item) => (
            <SpotlightCard
              key={item.author}
              theme="dark"
              spotlightColor="#2f6bff"
              intensity={0.5}
              borderGlow={0.6}
              ambient
              grain={0.05}
              className="flex h-full flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-7 md:p-9"
            >
              <svg
                aria-hidden
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                className="mb-7 text-[var(--color-accent)]"
              >
                <path
                  d="M11 7c-3.5 1.6-5.5 4.4-5.5 8.2V21H12v-5.8H8.9c0-2.4 1-4 3.1-5L11 7Zm11 0c-3.5 1.6-5.5 4.4-5.5 8.2V21H23v-5.8h-3.1c0-2.4 1-4 3.1-5L22 7Z"
                  fill="currentColor"
                />
              </svg>

              <p className="text-[1.0625rem] leading-relaxed">{item.quote}</p>

              <div className="mt-8 border-t border-[var(--line)] pt-5">
                <p className="text-[0.95rem] font-medium">{item.author}</p>
                <p className="mt-1 text-[0.85rem] text-[var(--fg-muted)]">{item.role}</p>
              </div>
            </SpotlightCard>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
