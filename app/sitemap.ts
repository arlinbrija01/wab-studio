import type { MetadataRoute } from 'next';
import { locales, routes, path, type RouteKey } from '@/lib/routes';
import { getSiteData } from '@/lib/data/content';

const pages: RouteKey[] = ['home', 'services', 'work', 'studio', 'contact'];

const seoKeyOf: Partial<Record<RouteKey, 'home' | 'services' | 'work' | 'studio' | 'contact'>> = {
  home: 'home',
  services: 'services',
  work: 'work',
  studio: 'studio',
  contact: 'contact',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSiteData();
  const base = data.settings.url.replace(/\/$/, '');
  const entries: MetadataRoute.Sitemap = [];

  const updated = new Date(data.updatedAt);

  for (const locale of locales) {
    for (const key of pages) {
      const seoKey = seoKeyOf[key];
      // Le pagine escluse dai motori non entrano nella sitemap.
      if (seoKey && data.seo.pages[seoKey]?.noindex) continue;

      entries.push({
        url: `${base}${path(locale, key)}`,
        lastModified: updated,
        changeFrequency: key === 'home' || key === 'work' ? 'monthly' : 'yearly',
        priority: key === 'home' ? 1 : key === 'work' || key === 'services' ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${base}${path(l, key)}`])),
        },
      });
    }

    for (const project of data.projects.filter((p) => p.published)) {
      entries.push({
        url: `${base}${path(locale, 'work', project.slug)}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${base}/${l}/${routes.work[l]}/${project.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
