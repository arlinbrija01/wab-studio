/**
 * DA DATI A TESTI DI PAGINA
 * -------------------------
 * Prende i contenuti salvati e la lingua richiesta e restituisce lo stesso
 * oggetto che i componenti del sito già si aspettano. In questo modo il
 * pannello può cambiare qualunque testo senza che nessun componente della
 * parte pubblica debba sapere dell'esistenza di un archivio.
 *
 * Le etichette fisse (voci del menù, campi del modulo, messaggi di errore)
 * arrivano dai dizionari statici; i contenuti veri li sovrascrivono.
 */

import { it } from '@/content/it';
import { de } from '@/content/de';
import type { Locale } from '@/lib/routes';
import type { Dict } from '@/content/it';
import { pick, type SiteData } from './types';

/** I dati dello studio già risolti nella lingua corrente. */
export interface ResolvedSettings {
  name: string;
  legalName: string;
  url: string;
  email: string;
  phone: string;
  phoneHref: string;
  address: SiteData['settings']['address'];
  fullAddress: string;
  vat: string;
  hours: string;
  socials: { name: string; url: string }[];
  founded: string;
}

/** Il dizionario così come lo vede il sito, con i campi aggiunti dal pannello. */
export type SiteDict = Omit<Dict, 'work'> & {
  work: Omit<Dict['work'], 'items'> & {
    items: (Dict['work']['items'][number] & {
      cover?: string;
      liveUrl?: string;
      gallery: string[];
    })[];
  };
  /** Contatti e dati dello studio, modificabili dal pannello */
  site: ResolvedSettings;
};

export function resolveSettings(data: SiteData, locale: Locale): ResolvedSettings {
  const s = data.settings;
  return {
    name: s.name,
    legalName: s.legalName,
    url: s.url.replace(/\/$/, ''),
    email: s.email,
    phone: s.phone,
    phoneHref: s.phoneHref,
    address: s.address,
    fullAddress: `${s.address.street}, ${s.address.zip} ${s.address.city} (${s.address.region}), ${s.address.country}`,
    vat: s.vat,
    hours: pick(s.hours, locale),
    socials: s.socials.filter((social) => social.name && social.url),
    founded: s.founded,
  };
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;
const isPublished = <T extends { published: boolean }>(item: T) => item.published;

export function resolveDict(data: SiteData, locale: Locale): SiteDict {
  const base = locale === 'de' ? de : it;
  const t = (value: Parameters<typeof pick>[0]) => pick(value, locale);

  const seoHome = data.seo.pages.home;

  return {
    ...base,

    site: resolveSettings(data, locale),

    meta: {
      ...base.meta,
      title: t(seoHome.title) || base.meta.title,
      description: t(seoHome.description) || base.meta.description,
      keywords: t(data.seo.keywords)
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    },

    hero: {
      ...base.hero,
      eyebrow: t(data.home.hero.eyebrow),
      titleLines: data.home.hero.titleLines.map(t),
      lead: t(data.home.hero.lead),
      ctaPrimary: t(data.home.hero.ctaPrimary),
      ctaSecondary: t(data.home.hero.ctaSecondary),
      marquee: data.home.hero.marquee.map(t),
    },

    manifesto: {
      ...base.manifesto,
      eyebrow: t(data.home.manifesto.eyebrow),
      text: t(data.home.manifesto.text),
    },

    services: {
      ...base.services,
      pageTitle: t(data.seo.pages.services.title) || base.services.pageTitle,
      pageLead: t(data.seo.pages.services.description) || base.services.pageLead,
      items: data.services
        .filter(isPublished)
        .sort(byOrder)
        .map((service) => ({
          num: service.num,
          slug: service.slug,
          title: t(service.title),
          short: t(service.short),
          desc: t(service.desc),
          bullets: service.bullets.map(t).filter(Boolean),
        })),
    },

    process: {
      ...base.process,
      steps: [...data.process].sort(byOrder).map((step) => ({
        num: step.num,
        title: t(step.title),
        desc: t(step.desc),
      })),
    },

    work: {
      ...base.work,
      pageTitle: t(data.seo.pages.work.title) || base.work.pageTitle,
      pageLead: t(data.seo.pages.work.description) || base.work.pageLead,
      items: data.projects
        .filter(isPublished)
        .sort(byOrder)
        .map((project) => ({
          slug: project.slug,
          client: project.client,
          title: t(project.title),
          year: project.year,
          sector: t(project.sector),
          services: project.services.map(t).filter(Boolean),
          excerpt: t(project.excerpt),
          challenge: t(project.challenge),
          solution: t(project.solution),
          results: project.results.map((result) => ({
            value: result.value,
            label: t(result.label),
          })),
          accent: project.accent,
          cover: project.cover || undefined,
          liveUrl: project.liveUrl || undefined,
          gallery: project.gallery ?? [],
        })),
    },

    stats: {
      ...base.stats,
      items: [...data.stats].sort(byOrder).map((stat) => ({
        value: stat.value,
        suffix: stat.suffix,
        decimals: stat.decimals,
        label: t(stat.label),
      })),
    },

    stack: { ...base.stack, items: [...data.stack] },

    testimonials: {
      ...base.testimonials,
      items: data.testimonials
        .filter(isPublished)
        .sort(byOrder)
        .map((item) => ({
          quote: t(item.quote),
          author: item.author,
          role: t(item.role),
        })),
    },

    faq: {
      ...base.faq,
      items: data.faq
        .filter(isPublished)
        .sort(byOrder)
        .map((item) => ({ q: t(item.q), a: t(item.a) })),
    },

    studio: {
      ...base.studio,
      title: t(data.studio.title),
      lead: t(data.studio.lead),
      body: data.studio.body.map(t).filter(Boolean),
      valuesTitle: t(data.studio.valuesTitle),
      values: data.studio.values.map((value) => ({
        title: t(value.title),
        desc: t(value.desc),
      })),
    },

    contact: {
      ...base.contact,
      title: t(data.contact.title),
      lead: t(data.contact.lead),
    },

    cta: {
      ...base.cta,
      title: t(data.cta.title),
      lead: t(data.cta.lead),
      button: t(data.cta.button),
    },

    footer: { ...base.footer, tagline: t(data.footerTagline) },
  };
}

/** Quali sezioni mostrare in home. */
export function homeSections(data: SiteData) {
  return data.home.show;
}
