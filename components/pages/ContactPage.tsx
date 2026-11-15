import type { Locale } from '@/lib/routes';
import { getDict } from '@/lib/data/content';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/sections/PageHero';
import Faq from '@/components/sections/Faq';
import ContactForm from '@/components/ContactForm';

export default async function ContactPage({ locale }: { locale: Locale }) {
  const dict = await getDict(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        lead={dict.contact.lead}
      />

      <Section theme="paper">
        <div className="shell grid gap-14 md:grid-cols-12 md:gap-10">
          {/* Contatti diretti */}
          <div className="md:col-span-4">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                </span>
                <span className="eyebrow text-[var(--fg-muted)]">
                  {dict.contact.responseTime}
                </span>
              </span>

              <h2 className="display-sm mt-9">{dict.contact.directTitle}</h2>

              <ul className="mt-7 space-y-5 text-[0.95rem]">
                <li>
                  <a
                    href={`mailto:${dict.site.email}`}
                    className="group inline-flex items-center gap-2 transition-opacity duration-300 hover:opacity-60"
                  >
                    {dict.site.email}
                    <span
                      aria-hidden
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${dict.site.phoneHref}`}
                    className="transition-opacity duration-300 hover:opacity-60"
                  >
                    {dict.site.phone}
                  </a>
                </li>
              </ul>

              <div className="mt-10 space-y-2 border-t border-[var(--line)] pt-8 text-[0.9rem] text-[var(--fg-muted)]">
                <p>{dict.site.fullAddress}</p>
                <p>{dict.site.hours}</p>
                <p>P. IVA {dict.site.vat}</p>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.9rem]">
                {dict.site.socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity duration-300 hover:opacity-60"
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Modulo */}
          <div className="md:col-span-7 md:col-start-6">
            <Reveal y={34}>
              <ContactForm locale={locale} dict={dict} />
            </Reveal>
          </div>
        </div>
      </Section>

      <Faq dict={dict} />
    </>
  );
}
