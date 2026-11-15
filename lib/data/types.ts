/**
 * MODELLO DEI DATI DEL SITO
 * -------------------------
 * Tutto ciò che si modifica dal pannello vive qui dentro e finisce
 * in data/site.json. Le etichette fisse dell'interfaccia (voci del menù,
 * nomi dei campi del modulo, messaggi di errore) restano invece nei file
 * content/it.ts e content/de.ts: non sono contenuti, sono vocabolario.
 */

/** Testo in due lingue. Il tedesco è facoltativo: se manca si usa l'italiano. */
export interface L {
  it: string;
  de?: string;
}

export interface MediaItem {
  id: string;
  /** Nome del file su disco, dentro public/uploads */
  filename: string;
  /** Percorso pubblico, es. /uploads/2026-hotel.jpg */
  url: string;
  alt: L;
  width?: number;
  height?: number;
  /** Byte */
  size: number;
  mime: string;
  uploadedAt: string;
}

export interface Service {
  id: string;
  slug: string;
  num: string;
  title: L;
  short: L;
  desc: L;
  bullets: L[];
  order: number;
  published: boolean;
}

export interface ProcessStep {
  id: string;
  num: string;
  title: L;
  desc: L;
  order: number;
}

export interface ProjectResult {
  value: string;
  label: L;
}

export interface Project {
  id: string;
  slug: string;
  client: string;
  title: L;
  year: string;
  sector: L;
  services: L[];
  excerpt: L;
  challenge: L;
  solution: L;
  results: ProjectResult[];
  /** Colore usato per la copertina astratta quando non c'è una foto */
  accent: string;
  /** Percorso di un'immagine caricata, es. /uploads/hotel.jpg */
  cover?: string;
  gallery: string[];
  /** Indirizzo del sito del cliente, mostrato come link */
  liveUrl?: string;
  featured: boolean;
  published: boolean;
  order: number;
  updatedAt: string;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  decimals: number;
  label: L;
  order: number;
}

export interface Testimonial {
  id: string;
  quote: L;
  author: string;
  role: L;
  order: number;
  published: boolean;
}

export interface FaqItem {
  id: string;
  q: L;
  a: L;
  order: number;
  published: boolean;
}

export interface Settings {
  name: string;
  legalName: string;
  /** Dominio di produzione, senza barra finale */
  url: string;
  email: string;
  phone: string;
  phoneHref: string;
  address: {
    street: string;
    zip: string;
    city: string;
    region: string;
    country: string;
    countryCode: string;
  };
  vat: string;
  hours: L;
  socials: { name: string; url: string }[];
  founded: string;
}

export type SeoPageKey = 'home' | 'services' | 'work' | 'studio' | 'contact';

export interface SeoPage {
  title: L;
  description: L;
  /** Immagine di anteprima social specifica per questa pagina */
  ogImage?: string;
  noindex?: boolean;
}

export interface Seo {
  /** Usato quando la pagina non ha un titolo proprio */
  defaultTitle: L;
  defaultDescription: L;
  keywords: L;
  ogImage?: string;
  /** Codice di verifica Google Search Console */
  googleVerification?: string;
  /** ID di misurazione Google Analytics (G-XXXXXXX). Vuoto = nessun tracciamento. */
  analyticsId?: string;
  pages: Record<SeoPageKey, SeoPage>;
}

export interface HomeContent {
  hero: {
    eyebrow: L;
    titleLines: L[];
    lead: L;
    ctaPrimary: L;
    ctaSecondary: L;
    marquee: L[];
  };
  manifesto: { eyebrow: L; text: L };
  /** Sezioni da mostrare o nascondere in home */
  show: {
    manifesto: boolean;
    services: boolean;
    work: boolean;
    process: boolean;
    stats: boolean;
    testimonials: boolean;
    faq: boolean;
  };
}

export interface StudioContent {
  title: L;
  lead: L;
  body: L[];
  valuesTitle: L;
  values: { title: L; desc: L }[];
}

export interface SiteData {
  /** Versione dello schema: serve per le migrazioni future */
  version: number;
  updatedAt: string;

  settings: Settings;
  seo: Seo;
  home: HomeContent;
  studio: StudioContent;
  cta: { title: L; lead: L; button: L };
  contact: { title: L; lead: L };
  footerTagline: L;

  services: Service[];
  process: ProcessStep[];
  projects: Project[];
  stats: Stat[];
  stack: string[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  media: MediaItem[];
}

/** Sceglie la lingua giusta, con ripiego sull'italiano. */
export function pick(value: L | undefined, locale: 'it' | 'de'): string {
  if (!value) return '';
  if (locale === 'de') return value.de?.trim() ? value.de : value.it;
  return value.it;
}

/** Costruisce un campo bilingue da due stringhe. */
export function loc(it: string, de?: string): L {
  return de === undefined ? { it } : { it, de };
}
