import type { MetadataRoute } from 'next';
import { getSiteData } from '@/lib/data/content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const data = await getSiteData();
  const base = data.settings.url.replace(/\/$/, '');

  // Il percorso del pannello non va scritto qui: elencarlo in robots.txt
  // equivarrebbe a pubblicarlo. Resta escluso dai motori grazie
  // all'intestazione X-Robots-Tag impostata dal middleware.
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
