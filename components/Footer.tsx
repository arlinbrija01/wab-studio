'use client';

import Link from 'next/link';
import { path, type Locale } from '@/lib/routes';
import type { SiteDict } from '@/content';
import Reveal from '@/components/ui/Reveal';

export default function Footer({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="dark" data-nav="dark" className="themed relative overflow-hidden">
      <div className="shell pt-20 pb-10 md:pt-28">
        <div className="grid gap-12 border-b border-[var(--line)] pb-16 md:grid-cols-12 md:gap-8">
          {/* Marchio e frase */}
          <div className="md:col-span-5">
            <div className="flex items-baseline gap-[0.3em] leading-none">
              <span className="text-2xl font-semibold tracking-[-0.045em]">WAB</span>
              <span className="mb-[0.15em] h-[0.26em] w-[0.26em] rounded-full bg-[var(--color-accent)]" />
              <span className="eyebrow opacity-60">Studio</span>
            </div>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Navigazione */}
          <nav className="md:col-span-2" aria-label={dict.footer.navTitle}>
            <h2 className="eyebrow mb-5 text-[var(--fg-muted)]">{dict.footer.navTitle}</h2>
            <ul className="space-y-3 text-[0.95rem]">
              {dict.nav.items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={path(locale, item.key)}
                    className="transition-opacity duration-300 hover:opacity-55"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Servizi */}
          <div className="md:col-span-2">
            <h2 className="eyebrow mb-5 text-[var(--fg-muted)]">{dict.footer.servicesTitle}</h2>
            <ul className="space-y-3 text-[0.95rem]">
              {dict.services.items.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`${path(locale, 'services')}#${service.slug}`}
                    className="transition-opacity duration-300 hover:opacity-55"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div className="md:col-span-3">
            <h2 className="eyebrow mb-5 text-[var(--fg-muted)]">{dict.footer.contactTitle}</h2>
            <ul className="space-y-3 text-[0.95rem]">
              <li>
                <a
                  href={`mailto:${dict.site.email}`}
                  className="transition-opacity duration-300 hover:opacity-55"
                >
                  {dict.site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${dict.site.phoneHref}`}
                  className="transition-opacity duration-300 hover:opacity-55"
                >
                  {dict.site.phone}
                </a>
              </li>
              <li className="pt-1 text-[var(--fg-muted)]">{dict.site.fullAddress}</li>
              <li className="text-[var(--fg-muted)]">{dict.site.hours}</li>
            </ul>

            <h2 className="eyebrow mt-8 mb-4 text-[var(--fg-muted)]">{dict.footer.socialTitle}</h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem]">
              {dict.site.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity duration-300 hover:opacity-55"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Riga legale */}
        <div className="flex flex-col gap-4 py-8 text-[0.8125rem] text-[var(--fg-muted)] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {dict.site.legalName} — P. IVA {dict.site.vat}. {dict.footer.rights}
          </p>
          <ul className="flex flex-wrap gap-5">
            {dict.footer.legal.map((label) => (
              <li key={label}>
                <span className="cursor-default transition-opacity duration-300 hover:opacity-70">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Firma tipografica tagliata dal bordo inferiore */}
      <Reveal y={40} blur={0} className="pointer-events-none select-none px-[1.25rem] md:px-10">
        <p
          aria-hidden
          className="translate-y-[22%] text-center font-semibold whitespace-nowrap tracking-[-0.055em] text-transparent"
          style={{
            fontSize: 'clamp(2.25rem, 12.5vw, 12rem)',
            lineHeight: 0.8,
            WebkitTextStroke: '1px var(--line)',
          }}
        >
          WAB STUDIO
        </p>
      </Reveal>
    </footer>
  );
}
