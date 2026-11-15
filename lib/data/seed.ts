/**
 * DATI INIZIALI
 * -------------
 * Al primo avvio data/site.json non esiste: viene costruito da qui,
 * unendo i testi italiani e tedeschi dei file content/ con i dati
 * dello studio di lib/site.ts. Da quel momento in poi comanda il file
 * JSON, e questi sorgenti restano solo come punto di partenza.
 */

import { it } from '@/content/it';
import { de } from '@/content/de';
import { site } from '@/lib/site';
import { loc, type SiteData, type L } from './types';

/** Accoppia due liste parallele italiano/tedesco in campi bilingui. */
function zip(itList: readonly string[], deList: readonly string[]): L[] {
  return itList.map((value, i) => loc(value, deList[i]));
}

export function buildSeed(): SiteData {
  const now = new Date().toISOString();

  return {
    version: 1,
    updatedAt: now,

    settings: {
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      email: site.email,
      phone: site.phone,
      phoneHref: site.phoneHref,
      address: { ...site.address },
      vat: site.vat,
      hours: loc(site.hours.it, site.hours.de),
      socials: site.socials.map((s) => ({ name: s.name, url: s.url })),
      founded: site.founded,
    },

    seo: {
      defaultTitle: loc(it.meta.title, de.meta.title),
      defaultDescription: loc(it.meta.description, de.meta.description),
      keywords: loc(it.meta.keywords.join(', '), de.meta.keywords.join(', ')),
      ogImage: '',
      googleVerification: '',
      analyticsId: '',
      pages: {
        home: {
          title: loc(it.meta.title, de.meta.title),
          description: loc(it.meta.description, de.meta.description),
        },
        services: {
          title: loc(it.services.pageTitle, de.services.pageTitle),
          description: loc(it.services.pageLead, de.services.pageLead),
        },
        work: {
          title: loc(it.work.pageTitle, de.work.pageTitle),
          description: loc(it.work.pageLead, de.work.pageLead),
        },
        studio: {
          title: loc(it.studio.title, de.studio.title),
          description: loc(it.studio.lead, de.studio.lead),
        },
        contact: {
          title: loc(it.contact.title, de.contact.title),
          description: loc(it.contact.lead, de.contact.lead),
        },
      },
    },

    home: {
      hero: {
        eyebrow: loc(it.hero.eyebrow, de.hero.eyebrow),
        titleLines: zip(it.hero.titleLines, de.hero.titleLines),
        lead: loc(it.hero.lead, de.hero.lead),
        ctaPrimary: loc(it.hero.ctaPrimary, de.hero.ctaPrimary),
        ctaSecondary: loc(it.hero.ctaSecondary, de.hero.ctaSecondary),
        marquee: zip(it.hero.marquee, de.hero.marquee),
      },
      manifesto: {
        eyebrow: loc(it.manifesto.eyebrow, de.manifesto.eyebrow),
        text: loc(it.manifesto.text, de.manifesto.text),
      },
      show: {
        manifesto: true,
        services: true,
        work: true,
        process: true,
        stats: true,
        testimonials: true,
        faq: true,
      },
    },

    studio: {
      title: loc(it.studio.title, de.studio.title),
      lead: loc(it.studio.lead, de.studio.lead),
      body: zip(it.studio.body, de.studio.body),
      valuesTitle: loc(it.studio.valuesTitle, de.studio.valuesTitle),
      values: it.studio.values.map((value, i) => ({
        title: loc(value.title, de.studio.values[i]?.title),
        desc: loc(value.desc, de.studio.values[i]?.desc),
      })),
    },

    cta: {
      title: loc(it.cta.title, de.cta.title),
      lead: loc(it.cta.lead, de.cta.lead),
      button: loc(it.cta.button, de.cta.button),
    },

    contact: {
      title: loc(it.contact.title, de.contact.title),
      lead: loc(it.contact.lead, de.contact.lead),
    },

    footerTagline: loc(it.footer.tagline, de.footer.tagline),

    services: it.services.items.map((service, i) => {
      const other = de.services.items[i];
      return {
        id: `srv-${service.slug}`,
        slug: service.slug,
        num: service.num,
        title: loc(service.title, other?.title),
        short: loc(service.short, other?.short),
        desc: loc(service.desc, other?.desc),
        bullets: zip(service.bullets, other?.bullets ?? []),
        order: i,
        published: true,
      };
    }),

    process: it.process.steps.map((step, i) => {
      const other = de.process.steps[i];
      return {
        id: `step-${step.num}`,
        num: step.num,
        title: loc(step.title, other?.title),
        desc: loc(step.desc, other?.desc),
        order: i,
      };
    }),

    projects: it.work.items.map((project, i) => {
      const other = de.work.items[i];
      return {
        id: `prj-${project.slug}`,
        slug: project.slug,
        client: project.client,
        title: loc(project.title, other?.title),
        year: project.year,
        sector: loc(project.sector, other?.sector),
        services: zip(project.services, other?.services ?? []),
        excerpt: loc(project.excerpt, other?.excerpt),
        challenge: loc(project.challenge, other?.challenge),
        solution: loc(project.solution, other?.solution),
        results: project.results.map((result, r) => ({
          value: result.value,
          label: loc(result.label, other?.results[r]?.label),
        })),
        accent: project.accent,
        cover: undefined,
        gallery: [],
        liveUrl: undefined,
        featured: i < 5,
        published: true,
        order: i,
        updatedAt: now,
      };
    }),

    stats: it.stats.items.map((stat, i) => ({
      id: `stat-${i}`,
      value: stat.value,
      suffix: stat.suffix,
      decimals: stat.decimals,
      label: loc(stat.label, de.stats.items[i]?.label),
      order: i,
    })),

    stack: [...it.stack.items],

    testimonials: it.testimonials.items.map((item, i) => ({
      id: `tst-${i}`,
      quote: loc(item.quote, de.testimonials.items[i]?.quote),
      author: item.author,
      role: loc(item.role, de.testimonials.items[i]?.role),
      order: i,
      published: true,
    })),

    faq: it.faq.items.map((item, i) => ({
      id: `faq-${i}`,
      q: loc(item.q, de.faq.items[i]?.q),
      a: loc(item.a, de.faq.items[i]?.a),
      order: i,
      published: true,
    })),

    media: [],
  };
}
