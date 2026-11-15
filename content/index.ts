import { it, type Dict } from './it';
import { de } from './de';
import type { Locale } from '@/lib/routes';

/**
 * I testi del sito vengono dall'archivio modificabile dal pannello
 * (vedi lib/data/). Questi dizionari statici restano come vocabolario
 * fisso dell'interfaccia e come dati iniziali al primo avvio.
 *
 * Nei componenti server usa `getDict(locale)` da '@/lib/data/content'.
 */

export const dictionaries: Record<Locale, Dict> = { it, de };

/** Dizionario statico, senza passare dall'archivio. Usato come ripiego. */
export function getStaticDict(locale: Locale): Dict {
  return dictionaries[locale] ?? it;
}

export type { Dict };
export type { SiteDict, ResolvedSettings } from '@/lib/data/resolve';
