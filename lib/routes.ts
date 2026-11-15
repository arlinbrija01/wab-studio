/**
 * Rotte e lingue del sito.
 * Ogni pagina ha una chiave interna e uno slug diverso per lingua,
 * così gli URL restano leggibili in italiano e in tedesco.
 *   /it/servizi   ←→   /de/leistungen
 */

export const locales = ['it', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const routes = {
  home: { it: '', de: '' },
  services: { it: 'servizi', de: 'leistungen' },
  work: { it: 'lavori', de: 'arbeiten' },
  studio: { it: 'studio', de: 'studio' },
  contact: { it: 'contatti', de: 'kontakt' },
} as const;

export type RouteKey = keyof typeof routes;

/** Costruisce un percorso assoluto: path('de', 'work', 'hotel-alpenblick') → /de/arbeiten/hotel-alpenblick */
export function path(locale: Locale, key: RouteKey, sub?: string): string {
  const segment = routes[key][locale];
  const parts = [locale, segment, sub].filter((p): p is string => Boolean(p));
  return '/' + parts.join('/');
}

/** Dato un percorso nella lingua corrente, restituisce lo stesso percorso nell'altra lingua. */
export function translatePath(pathname: string, from: Locale, to: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  // parts[0] è la lingua
  const [, segment, ...rest] = parts;
  if (!segment) return `/${to}`;

  const key = (Object.keys(routes) as RouteKey[]).find((k) => routes[k][from] === segment);
  if (!key) return `/${to}`;

  return path(to, key, rest.join('/') || undefined);
}

/** Lingua alternativa rispetto a quella passata. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'it' ? 'de' : 'it';
}
