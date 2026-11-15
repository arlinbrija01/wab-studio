import Link from 'next/link';
import { path, type Locale } from '@/lib/routes';
import { getDict } from '@/lib/data/content';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import CaseVisual from '@/components/ui/CaseVisual';
import PageHero from '@/components/sections/PageHero';
import CtaBand from '@/components/sections/CtaBand';

export default async function WorkPage({ locale }: { locale: Locale }) {
  const dict = await getDict(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.work.eyebrow}
        title={dict.work.pageTitle}
        lead={dict.work.pageLead}
      />

      <Section theme="paper">
        <div className="shell">
          <div className="grid gap-x-7 gap-y-16 md:grid-cols-2">
            {dict.work.items.map((item, i) => (
              <Reveal
                key={item.slug}
                y={46}
                delay={(i % 2) * 0.08}
                className={i % 3 === 0 ? 'md:col-span-2' : ''}
              >
                <Link href={path(locale, 'work', item.slug)} className="group block">
                  <CaseVisual
                    accent={item.accent}
                    client={item.client}
                    image={item.cover}
                    index={i}
                    className={i % 3 === 0 ? 'aspect-[16/9] w-full' : 'aspect-[4/3] w-full'}
                  />

                  <div className="mt-6 flex items-start justify-between gap-6">
                    <div>
                      <p className="eyebrow text-[var(--fg-muted)]">
                        {item.client} · {item.sector} · {item.year}
                      </p>
                      <h2
                        className={`mt-3 max-w-[24ch] transition-opacity duration-500 group-hover:opacity-60 ${
                          i % 3 === 0 ? 'display-md' : 'display-sm'
                        }`}
                      >
                        {item.title}
                      </h2>
                      <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-[var(--fg-muted)]">
                        {item.excerpt}
                      </p>
                    </div>

                    <span
                      aria-hidden
                      className="mt-2 shrink-0 text-[var(--fg-muted)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-[var(--fg)]"
                    >
                      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M5 15 15 5M7 5h8v8"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.services.map((service) => (
                      <li
                        key={service}
                        className="rounded-full border border-[var(--line)] px-3 py-1 text-[0.72rem] tracking-[0.02em] text-[var(--fg-muted)]"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </Link>
              </Reveal>
            ))}
          </div>

        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
