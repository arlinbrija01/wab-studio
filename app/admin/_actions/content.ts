'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/admin/auth';
import { updateSite } from '@/lib/data/store';
import type {
  FaqItem,
  HomeContent,
  ProcessStep,
  Project,
  Seo,
  Service,
  Settings,
  Stat,
  StudioContent,
  Testimonial,
  L,
} from '@/lib/data/types';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/** Nessuna azione passa senza una sessione valida. */
async function guard() {
  const email = await getSession();
  if (!email) throw new Error('Sessione scaduta. Ricarica la pagina e accedi di nuovo.');
}

/** Rigenera le pagine pubbliche dopo una modifica. */
function refresh() {
  revalidatePath('/', 'layout');
}

async function run(mutate: Parameters<typeof updateSite>[0]): Promise<ActionResult> {
  try {
    await guard();
    await updateSite(mutate);
    refresh();
    return { ok: true };
  } catch (error) {
    console.error('[admin]', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Errore imprevisto.' };
  }
}

/* ------------------------------------------------------------------ */
/* Pulizia dei dati in arrivo                                          */
/* ------------------------------------------------------------------ */

const str = (value: unknown): string => (typeof value === 'string' ? value : '');

const text = (value: unknown): L => {
  const v = value as L | undefined;
  const de = str(v?.de).trim();
  return de ? { it: str(v?.it), de } : { it: str(v?.it) };
};

const slugify = (input: string): string =>
  input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

/** Accetta solo indirizzi http/https: niente javascript: nei link. */
const safeUrl = (value: unknown): string => {
  const raw = str(value).trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
};

/** Percorso interno di un'immagine caricata. */
const safeAsset = (value: unknown): string => {
  const raw = str(value).trim();
  return /^\/uploads\/[A-Za-z0-9._-]+$/.test(raw) ? raw : '';
};

const color = (value: unknown): string => {
  const raw = str(value).trim();
  return /^#[0-9a-fA-F]{6}$/.test(raw) ? raw : '#2f6bff';
};

/* ------------------------------------------------------------------ */
/* Home, studio, chiusure                                              */
/* ------------------------------------------------------------------ */

export async function saveHome(home: HomeContent): Promise<ActionResult> {
  return run((data) => {
    data.home = {
      hero: {
        eyebrow: text(home.hero.eyebrow),
        titleLines: (home.hero.titleLines ?? []).map(text).filter((l) => l.it.trim()),
        lead: text(home.hero.lead),
        ctaPrimary: text(home.hero.ctaPrimary),
        ctaSecondary: text(home.hero.ctaSecondary),
        marquee: (home.hero.marquee ?? []).map(text).filter((l) => l.it.trim()),
      },
      manifesto: {
        eyebrow: text(home.manifesto.eyebrow),
        text: text(home.manifesto.text),
      },
      show: {
        manifesto: Boolean(home.show?.manifesto),
        services: Boolean(home.show?.services),
        work: Boolean(home.show?.work),
        process: Boolean(home.show?.process),
        stats: Boolean(home.show?.stats),
        testimonials: Boolean(home.show?.testimonials),
        faq: Boolean(home.show?.faq),
      },
    };
  });
}

export async function saveStudio(studio: StudioContent): Promise<ActionResult> {
  return run((data) => {
    data.studio = {
      title: text(studio.title),
      lead: text(studio.lead),
      body: (studio.body ?? []).map(text).filter((l) => l.it.trim()),
      valuesTitle: text(studio.valuesTitle),
      values: (studio.values ?? []).map((v) => ({ title: text(v.title), desc: text(v.desc) })),
    };
  });
}

export async function saveClosings(payload: {
  cta: { title: L; lead: L; button: L };
  contact: { title: L; lead: L };
  footerTagline: L;
}): Promise<ActionResult> {
  return run((data) => {
    data.cta = {
      title: text(payload.cta.title),
      lead: text(payload.cta.lead),
      button: text(payload.cta.button),
    };
    data.contact = { title: text(payload.contact.title), lead: text(payload.contact.lead) };
    data.footerTagline = text(payload.footerTagline);
  });
}

/* ------------------------------------------------------------------ */
/* Liste di contenuti                                                  */
/* ------------------------------------------------------------------ */

export async function saveServices(services: Service[]): Promise<ActionResult> {
  return run((data) => {
    data.services = services.map((service, index) => ({
      id: str(service.id) || `srv-${index}`,
      slug: slugify(str(service.slug) || str(service.title?.it)) || `servizio-${index + 1}`,
      num: str(service.num) || String(index + 1).padStart(2, '0'),
      title: text(service.title),
      short: text(service.short),
      desc: text(service.desc),
      bullets: (service.bullets ?? []).map(text).filter((l) => l.it.trim()),
      order: index,
      published: service.published !== false,
    }));
  });
}

export async function saveProcess(steps: ProcessStep[]): Promise<ActionResult> {
  return run((data) => {
    data.process = steps.map((step, index) => ({
      id: str(step.id) || `step-${index}`,
      num: str(step.num) || String(index + 1).padStart(2, '0'),
      title: text(step.title),
      desc: text(step.desc),
      order: index,
    }));
  });
}

export async function saveStats(stats: Stat[]): Promise<ActionResult> {
  return run((data) => {
    data.stats = stats.map((stat, index) => ({
      id: str(stat.id) || `stat-${index}`,
      value: Number.isFinite(Number(stat.value)) ? Number(stat.value) : 0,
      suffix: str(stat.suffix),
      decimals: Math.min(2, Math.max(0, Number(stat.decimals) || 0)),
      label: text(stat.label),
      order: index,
    }));
  });
}

export async function saveStack(stack: string[]): Promise<ActionResult> {
  return run((data) => {
    data.stack = (stack ?? []).map(str).map((s) => s.trim()).filter(Boolean);
  });
}

export async function saveTestimonials(items: Testimonial[]): Promise<ActionResult> {
  return run((data) => {
    data.testimonials = items.map((item, index) => ({
      id: str(item.id) || `tst-${index}`,
      quote: text(item.quote),
      author: str(item.author),
      role: text(item.role),
      order: index,
      published: item.published !== false,
    }));
  });
}

export async function saveFaq(items: FaqItem[]): Promise<ActionResult> {
  return run((data) => {
    data.faq = items.map((item, index) => ({
      id: str(item.id) || `faq-${index}`,
      q: text(item.q),
      a: text(item.a),
      order: index,
      published: item.published !== false,
    }));
  });
}

/**
 * Salva in un colpo solo tutta la schermata "Contenuti".
 * Una sola scrittura, una sola copia di sicurezza: se qualcosa va storto
 * non resta mezza pagina salvata e mezza no.
 */
export interface ContentBundle {
  home: HomeContent;
  studio: StudioContent;
  closings: {
    cta: { title: L; lead: L; button: L };
    contact: { title: L; lead: L };
    footerTagline: L;
  };
  services: Service[];
  process: ProcessStep[];
  stats: Stat[];
  stack: string[];
  testimonials: Testimonial[];
  faq: FaqItem[];
}

export async function saveContentBundle(bundle: ContentBundle): Promise<ActionResult> {
  return run((data) => {
    data.home = {
      hero: {
        eyebrow: text(bundle.home.hero.eyebrow),
        titleLines: (bundle.home.hero.titleLines ?? []).map(text).filter((l) => l.it.trim()),
        lead: text(bundle.home.hero.lead),
        ctaPrimary: text(bundle.home.hero.ctaPrimary),
        ctaSecondary: text(bundle.home.hero.ctaSecondary),
        marquee: (bundle.home.hero.marquee ?? []).map(text).filter((l) => l.it.trim()),
      },
      manifesto: {
        eyebrow: text(bundle.home.manifesto.eyebrow),
        text: text(bundle.home.manifesto.text),
      },
      show: {
        manifesto: Boolean(bundle.home.show?.manifesto),
        services: Boolean(bundle.home.show?.services),
        work: Boolean(bundle.home.show?.work),
        process: Boolean(bundle.home.show?.process),
        stats: Boolean(bundle.home.show?.stats),
        testimonials: Boolean(bundle.home.show?.testimonials),
        faq: Boolean(bundle.home.show?.faq),
      },
    };

    data.studio = {
      title: text(bundle.studio.title),
      lead: text(bundle.studio.lead),
      body: (bundle.studio.body ?? []).map(text).filter((l) => l.it.trim()),
      valuesTitle: text(bundle.studio.valuesTitle),
      values: (bundle.studio.values ?? []).map((v) => ({
        title: text(v.title),
        desc: text(v.desc),
      })),
    };

    data.cta = {
      title: text(bundle.closings.cta.title),
      lead: text(bundle.closings.cta.lead),
      button: text(bundle.closings.cta.button),
    };
    data.contact = {
      title: text(bundle.closings.contact.title),
      lead: text(bundle.closings.contact.lead),
    };
    data.footerTagline = text(bundle.closings.footerTagline);

    data.services = (bundle.services ?? []).map((service, index) => ({
      id: str(service.id) || `srv-${index}`,
      slug: slugify(str(service.slug) || str(service.title?.it)) || `servizio-${index + 1}`,
      num: str(service.num) || String(index + 1).padStart(2, '0'),
      title: text(service.title),
      short: text(service.short),
      desc: text(service.desc),
      bullets: (service.bullets ?? []).map(text).filter((l) => l.it.trim()),
      order: index,
      published: service.published !== false,
    }));

    data.process = (bundle.process ?? []).map((step, index) => ({
      id: str(step.id) || `step-${index}`,
      num: str(step.num) || String(index + 1).padStart(2, '0'),
      title: text(step.title),
      desc: text(step.desc),
      order: index,
    }));

    data.stats = (bundle.stats ?? []).map((stat, index) => ({
      id: str(stat.id) || `stat-${index}`,
      value: Number.isFinite(Number(stat.value)) ? Number(stat.value) : 0,
      suffix: str(stat.suffix),
      decimals: Math.min(2, Math.max(0, Number(stat.decimals) || 0)),
      label: text(stat.label),
      order: index,
    }));

    data.stack = (bundle.stack ?? []).map(str).map((s) => s.trim()).filter(Boolean);

    data.testimonials = (bundle.testimonials ?? []).map((item, index) => ({
      id: str(item.id) || `tst-${index}`,
      quote: text(item.quote),
      author: str(item.author),
      role: text(item.role),
      order: index,
      published: item.published !== false,
    }));

    data.faq = (bundle.faq ?? []).map((item, index) => ({
      id: str(item.id) || `faq-${index}`,
      q: text(item.q),
      a: text(item.a),
      order: index,
      published: item.published !== false,
    }));
  });
}

/* ------------------------------------------------------------------ */
/* Progetti                                                            */
/* ------------------------------------------------------------------ */

function cleanProject(project: Project, fallbackOrder: number): Project {
  return {
    id: str(project.id) || `prj-${Date.now()}`,
    slug: slugify(str(project.slug) || str(project.client)) || `progetto-${fallbackOrder + 1}`,
    client: str(project.client).trim(),
    title: text(project.title),
    year: str(project.year).trim(),
    sector: text(project.sector),
    services: (project.services ?? []).map(text).filter((l) => l.it.trim()),
    excerpt: text(project.excerpt),
    challenge: text(project.challenge),
    solution: text(project.solution),
    results: (project.results ?? [])
      .map((r) => ({ value: str(r.value).trim(), label: text(r.label) }))
      .filter((r) => r.value || r.label.it),
    accent: color(project.accent),
    cover: safeAsset(project.cover) || undefined,
    gallery: (project.gallery ?? []).map(safeAsset).filter(Boolean),
    liveUrl: safeUrl(project.liveUrl) || undefined,
    featured: Boolean(project.featured),
    published: project.published !== false,
    order: fallbackOrder,
    updatedAt: new Date().toISOString(),
  };
}

/** Salva un singolo progetto, nuovo o esistente. */
export async function saveProject(project: Project): Promise<ActionResult> {
  return run((data) => {
    const index = data.projects.findIndex((p) => p.id === project.id);

    // Lo slug deve restare unico: è l'indirizzo della pagina.
    const base = slugify(str(project.slug) || str(project.client)) || 'progetto';
    let slug = base;
    let n = 2;
    while (data.projects.some((p) => p.slug === slug && p.id !== project.id)) {
      slug = `${base}-${n++}`;
    }

    const cleaned = cleanProject(
      { ...project, slug },
      index >= 0 ? data.projects[index].order : data.projects.length
    );

    if (index >= 0) data.projects[index] = cleaned;
    else data.projects.push(cleaned);
  });
}

export async function deleteProject(id: string): Promise<ActionResult> {
  return run((data) => {
    data.projects = data.projects
      .filter((p) => p.id !== id)
      .map((p, index) => ({ ...p, order: index }));
  });
}

export async function duplicateProject(id: string): Promise<ActionResult> {
  return run((data) => {
    const source = data.projects.find((p) => p.id === id);
    if (!source) throw new Error('Progetto non trovato.');

    let slug = `${source.slug}-copia`;
    let n = 2;
    while (data.projects.some((p) => p.slug === slug)) slug = `${source.slug}-copia-${n++}`;

    data.projects.push({
      ...structuredClone(source),
      id: `prj-${Date.now().toString(36)}`,
      slug,
      client: `${source.client} (copia)`,
      published: false,
      featured: false,
      order: data.projects.length,
      updatedAt: new Date().toISOString(),
    });
  });
}

/** Riordina e aggiorna pubblicazione/evidenza dalla schermata elenco. */
export async function saveProjectList(
  items: { id: string; order: number; published: boolean; featured: boolean }[]
): Promise<ActionResult> {
  return run((data) => {
    const map = new Map(items.map((item) => [item.id, item]));
    data.projects = data.projects
      .map((project) => {
        const patch = map.get(project.id);
        return patch
          ? {
              ...project,
              order: patch.order,
              published: Boolean(patch.published),
              featured: Boolean(patch.featured),
            }
          : project;
      })
      .sort((a, b) => a.order - b.order);
  });
}

/* ------------------------------------------------------------------ */
/* Impostazioni e SEO                                                  */
/* ------------------------------------------------------------------ */

export async function saveSettings(settings: Settings): Promise<ActionResult> {
  return run((data) => {
    data.settings = {
      name: str(settings.name).trim() || 'WAB Studio',
      legalName: str(settings.legalName).trim(),
      url: str(settings.url).trim().replace(/\/+$/, ''),
      email: str(settings.email).trim(),
      phone: str(settings.phone).trim(),
      phoneHref: str(settings.phoneHref).trim().replace(/\s+/g, ''),
      address: {
        street: str(settings.address?.street),
        zip: str(settings.address?.zip),
        city: str(settings.address?.city),
        region: str(settings.address?.region),
        country: str(settings.address?.country),
        countryCode: str(settings.address?.countryCode).toUpperCase().slice(0, 2) || 'IT',
      },
      vat: str(settings.vat).trim(),
      hours: text(settings.hours),
      socials: (settings.socials ?? [])
        .map((s) => ({ name: str(s.name).trim(), url: safeUrl(s.url) }))
        .filter((s) => s.name && s.url),
      founded: str(settings.founded).trim(),
    };
  });
}

export async function saveSeo(seo: Seo): Promise<ActionResult> {
  return run((data) => {
    const page = (key: keyof Seo['pages']) => {
      const source = seo.pages?.[key];
      return {
        title: text(source?.title),
        description: text(source?.description),
        ogImage: safeAsset(source?.ogImage) || undefined,
        noindex: Boolean(source?.noindex),
      };
    };

    data.seo = {
      defaultTitle: text(seo.defaultTitle),
      defaultDescription: text(seo.defaultDescription),
      keywords: text(seo.keywords),
      ogImage: safeAsset(seo.ogImage) || undefined,
      googleVerification: str(seo.googleVerification).trim(),
      analyticsId: /^G-[A-Z0-9]+$/i.test(str(seo.analyticsId).trim())
        ? str(seo.analyticsId).trim()
        : '',
      pages: {
        home: page('home'),
        services: page('services'),
        work: page('work'),
        studio: page('studio'),
        contact: page('contact'),
      },
    };
  });
}
