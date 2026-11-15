import type { Locale } from '@/lib/routes';
import { getDict } from '@/lib/data/content';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/sections/PageHero';
import Process from '@/components/sections/Process';
import Faq from '@/components/sections/Faq';
import CtaBand from '@/components/sections/CtaBand';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

export default async function ServicesPage({ locale }: { locale: Locale }) {
  const dict = await getDict(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.services.eyebrow}
        title={dict.services.pageTitle}
        lead={dict.services.pageLead}
      />

      <Section theme="paper">
        <div className="shell grid gap-5 md:grid-cols-2">
          {dict.services.items.map((service, i) => (
            <AnimatedContent
              key={service.slug}
              distance={46}
              duration={0.9}
              delay={(i % 2) * 0.08}
              threshold={0.15}
              blur={4}
              once
            >
              <SpotlightCard
                id={service.slug}
                theme="light"
                spotlightColor="#2f6bff"
                intensity={0.35}
                borderGlow={0.4}
                ambient
                className="flex h-full scroll-mt-28 flex-col rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-8 md:p-10"
              >
                <span className="eyebrow mb-7 block text-[var(--color-accent)]">{service.num}</span>

                <h2 className="display-sm max-w-[16ch]">{service.title}</h2>

                <p className="mt-4 max-w-[34ch] text-[1.0625rem] leading-snug tracking-[-0.015em]">
                  {service.short}
                </p>

                <p className="mt-5 text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                  {service.desc}
                </p>

                <ul className="mt-8 space-y-3 border-t border-[var(--line)] pt-7">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-[0.9rem] leading-relaxed">
                      <span
                        aria-hidden
                        className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>

        <div className="shell mt-16">
          <Reveal>
            <p className="max-w-xl text-[0.9rem] leading-relaxed text-[var(--fg-muted)]">
              {dict.services.lead}
            </p>
          </Reveal>
        </div>
      </Section>

      <Process dict={dict} />
      <Faq dict={dict} />
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
