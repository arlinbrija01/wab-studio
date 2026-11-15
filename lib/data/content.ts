import 'server-only';

import { cache } from 'react';
import type { Locale } from '@/lib/routes';
import { readSite } from './store';
import { resolveDict, resolveSettings, type SiteDict } from './resolve';
import type { SiteData } from './types';

/**
 * Punto d'ingresso per i componenti server.
 * `cache()` di React tiene un solo risultato per richiesta: anche se
 * dieci componenti chiedono i testi, il file viene letto una volta.
 */

export const getSiteData = cache(async (): Promise<SiteData> => readSite());

export const getDict = cache(async (locale: Locale): Promise<SiteDict> => {
  const data = await getSiteData();
  return resolveDict(data, locale);
});

export const getSettings = cache(async (locale: Locale) => {
  const data = await getSiteData();
  return resolveSettings(data, locale);
});

/** Progetti pubblicati, in ordine: serve a sitemap e generateStaticParams. */
export async function getPublishedProjects() {
  const data = await getSiteData();
  return data.projects.filter((p) => p.published).sort((a, b) => a.order - b.order);
}

export type { SiteDict };
