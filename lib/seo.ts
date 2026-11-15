import 'server-only';

import type { Metadata } from 'next';
import { locales, path, type Locale, type RouteKey } from '@/lib/routes';
import { pick, type SeoPageKey, type SiteData } from '@/lib/data/types';

/**
 * Metadati e dati strutturati, costruiti dai contenuti salvati.
 * Tutto ciò che Google e i social leggono di una pagina passa da qui.
 */

const routeOfSeoKey: Record<SeoPageKey, RouteKey> = {
  home: 'home',
  services: 'services',
  work: 'work',
  studio: 'studio',
  contact: 'contact',
};

/** Indirizzo assoluto, come lo vuole Google nei canonici. */
export function absolute(data: SiteData, pathname: string): string {
  return `${data.settings.url.replace(/\/$/, '')}${pathname}`;
}

/** Anteprima social: quella caricata, oppure una disegnata al volo. */
export function ogImage(
  data: SiteData,
  options: { custom?: string; title: string; kicker?: string; accent?: string }
): string {
  if (options.custom) return absolute(data, options.custom);
  if (data.seo.ogImage) return absolute(data, data.seo.ogImage);

  const params = new URLSearchParams({ title: options.title });
  if (options.kicker) params.set('kicker', options.kicker);
  if (options.accent) params.set('accent', options.accent);
  return absolute(data, `/og?${params.toString()}`);
}

/** Le versioni della stessa pagina nelle altre lingue, per gli hreflang. */
export function languageAlternates(key: RouteKey, sub?: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const locale of locales) out[locale] = path(locale, key, sub);
  out['x-default'] = path('it', key, sub);
  return out;
}

export interface PageMetaOptions {
  data: SiteData;
  locale: Locale;
  seoKey: SeoPageKey;
  /** Sovrascrive titolo e descrizione, per le schede progetto */
  override?: { title: string; description: string; ogImage?: string; accent?: string };
  sub?: string;
  type?: 'website' | 'article';
}

export function buildMetadata({
  data,
  locale,
  seoKey,
  override,
  sub,
  type = 'website',
}: PageMetaOptions): Metadata {
  const page = data.seo.pages[seoKey];
  const routeKey = routeOfSeoKey[seoKey];

  const title = override?.title || pick(page.title, locale) || pick(data.seo.defaultTitle, locale);
  const description =
    override?.description ||
    pick(page.description, locale) ||
    pick(data.seo.defaultDescription, locale);

  const url = path(locale, routeKey, sub);
  const kickers: Record<SeoPageKey, string> = {
    home: 'Studio digitale',
    services: locale === 'de' ? 'Leistungen' : 'Servizi',
    work: locale === 'de' ? 'Arbeiten' : 'Lavori',
    studio: 'Studio',
    contact: locale === 'de' ? 'Kontakt' : 'Contatti',
  };

  const image = ogImage(data, {
    custom: override?.ogImage ?? page.ogImage,
    title,
    kicker: kickers[seoKey],
    accent: override?.accent,
  });

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(routeKey, sub),
    },
    openGraph: {
      type,
      title,
      description,
      url: absolute(data, url),
      siteName: data.settings.name,
      locale: locale === 'de' ? 'de_DE' : 'it_IT',
      alternateLocale: locale === 'de' ? ['it_IT'] : ['de_DE'],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: page.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

/* ------------------------------------------------------------------ */
/* Dati strutturati                                                    */
/* ------------------------------------------------------------------ */

export function organizationSchema(data: SiteData, locale: Locale) {
  const s = data.settings;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${s.url}/#studio`,
    name: s.name,
    legalName: s.legalName || s.name,
    description: pick(data.seo.defaultDescription, locale),
    url: absolute(data, path(locale, 'home')),
    email: s.email,
    telephone: s.phone,
    foundingDate: s.founded,
    vatID: s.vat,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address.street,
      postalCode: s.address.zip,
      addressLocality: s.address.city,
      addressRegion: s.address.region,
      addressCountry: s.address.countryCode,
    },
    sameAs: s.socials.map((social) => social.url),
    areaServed: ['IT', 'DE', 'AT', 'CH'],
    knowsLanguage: ['it', 'de'],
    availableLanguage: ['it', 'de'],
    makesOffer: data.services
      .filter((service) => service.published)
      .map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: pick(service.title, locale),
          description: pick(service.desc, locale),
        },
      })),
  };
}

export function websiteSchema(data: SiteData, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${data.settings.url}/#sito`,
    name: data.settings.name,
    url: absolute(data, path(locale, 'home')),
    inLanguage: locale === 'de' ? 'de-DE' : 'it-IT',
    publisher: { '@id': `${data.settings.url}/#studio` },
  };
}

export function faqSchema(data: SiteData, locale: Locale) {
  const items = data.faq.filter((item) => item.published);
  if (items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: pick(item.q, locale),
      acceptedAnswer: { '@type': 'Answer', text: pick(item.a, locale) },
    })),
  };
}

export function breadcrumbSchema(
  data: SiteData,
  trail: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: absolute(data, step.url),
    })),
  };
}

export function caseStudySchema(
  data: SiteData,
  locale: Locale,
  project: SiteData['projects'][number]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: pick(project.title, locale),
    headline: pick(project.title, locale),
    description: pick(project.excerpt, locale),
    url: absolute(data, path(locale, 'work', project.slug)),
    dateModified: project.updatedAt,
    inLanguage: locale === 'de' ? 'de-DE' : 'it-IT',
    creator: { '@id': `${data.settings.url}/#studio` },
    about: pick(project.sector, locale),
    ...(project.cover ? { image: absolute(data, project.cover) } : {}),
  };
}

/** Blocco <script> con i dati strutturati. */
export function jsonLd(schema: object | null) {
  if (!schema) return null;
  return JSON.stringify(schema);
}
