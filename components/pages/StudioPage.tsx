import type { Locale } from '@/lib/routes';
import { getDict } from '@/lib/data/content';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/sections/PageHero';
import Stats from '@/components/sections/Stats';
import Testimonials from '@/components/sections/Testimonials';
import CtaBand from '@/components/sections/CtaBand';
import ScrollReveal from '@/components/reactbits/ScrollReveal';

export default async function StudioPage({ locale }: { locale: Locale }) {
  const dict = await getDict(locale);

  return (
    <>
      <PageHero eyebrow={dict.studio.eyebrow} title={dict.studio.title} lead={dict.studio.lead} />

      <Section theme="paper">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-6">
            <ScrollReveal
              textClassName="display-sm !font-normal !leading-[1.5] text-[var(--fg)]"
              baseOpacity={0.14}
              baseRotation={0}
              blurStrength={4}
              stagger={0.03}
              splitBy="words"
              effect="fade"
              mode="scrub"
              wordAnimationEnd="center 60%"
            >
              {dict.studio.body[0]}
            </ScrollReveal>

            <Reveal className="mt-10 space-y-7" stagger={0.1}>
              {dict.studio.body.slice(1).map((paragraph) => (
                <p key={paragraph} className="text-[1.0625rem] leading-relaxed text-[var(--fg-muted)]">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </Section>

      <Section theme="dark">
        <div className="shell">
          <Reveal className="mb-14 flex items-center gap-3" y={14}>
            <span className="h-px w-8 bg-[var(--color-accent)]" />
            <span className="eyebrow text-[var(--fg-muted)]">{dict.studio.valuesTitle}</span>
          </Reveal>

          <Reveal
            className="grid gap-x-8 gap-y-12 border-t border-[var(--line)] pt-12 md:grid-cols-3"
            stagger={0.1}
            y={34}
          >
            {dict.studio.values.map((value, i) => (
              <div key={value.title}>
                <span className="eyebrow text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="display-sm mt-5">{value.title}</h2>
                <p className="mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                  {value.desc}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      <Stats locale={locale} dict={dict} />
      <Testimonials dict={dict} />
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
