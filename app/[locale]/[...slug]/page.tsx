import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, routes, isLocale, path, type Locale, type RouteKey } from '@/lib/routes';
import { getDict, getSiteData } from '@/lib/data/content';
import { pick, type SeoPageKey } from '@/lib/data/types';
import { breadcrumbSchema, buildMetadata, caseStudySchema, faqSchema } from '@/lib/seo';

import ServicesPage from '@/components/pages/ServicesPage';
import WorkPage from '@/components/pages/WorkPage';
import CaseStudyPage from '@/components/pages/CaseStudyPage';
import StudioPage from '@/components/pages/StudioPage';
import ContactPage from '@/components/pages/ContactPage';

/**
 * Una sola rotta per tutte le pagine interne.
 * Lo slug cambia con la lingua (/it/servizi, /de/leistungen) e qui viene
 * ritradotto nella chiave interna della pagina. Ogni combinazione valida
 * è generata in anticipo, quindi non esistono URL doppi.
 */

const pageKeys = ['services', 'work', 'studio', 'contact'] as const satisfies readonly RouteKey[];

function resolve(locale: Locale, slug: string[]) {
  const key = pageKeys.find((k) => routes[k][locale] === slug[0]);
  if (!key) return null;
  if (slug.length === 1) return { key, sub: undefined as string | undefined };
  if (key === 'work' && slug.length === 2) return { key, sub: slug[1] };
  return null;
}

export async function generateStaticParams() {
  const data = await getSiteData();
  const params: { locale: string; slug: string[] }[] = [];

  for (const locale of locales) {
    for (const key of pageKeys) {
      params.push({ locale, slug: [routes[key][locale]] });
    }
    for (const project of data.projects.filter((p) => p.published)) {
      params.push({ locale, slug: [routes.work[locale], project.slug] });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const resolved = resolve(locale, slug);
  if (!resolved) return { robots: { index: false, follow: false } };

  const data = await getSiteData();
  const { key, sub } = resolved;

  if (key === 'work' && sub) {
    const project = data.projects.find((p) => p.slug === sub);
    if (!project) return { robots: { index: false, follow: false } };

    return buildMetadata({
      data,
      locale,
      seoKey: 'work',
      sub,
      type: 'article',
      override: {
        title: `${project.client} — ${pick(project.title, locale)}`,
        description: pick(project.excerpt, locale),
        ogImage: project.cover,
        accent: project.accent,
      },
    });
  }

  return buildMetadata({ data, locale, seoKey: key as SeoPageKey });
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const resolved = resolve(locale, slug);
  if (!resolved) notFound();

  const typed = locale as Locale;
  const { key, sub } = resolved;
  const [data, dict] = await Promise.all([getSiteData(), getDict(typed)]);

  /* Briciole di pane: aiutano Google a capire la gerarchia del sito
     e compaiono nei risultati sotto il titolo. */
  const home = { name: data.settings.name, url: path(typed, 'home') };
  const section = {
    name:
      key === 'services'
        ? dict.services.pageTitle
        : key === 'work'
          ? dict.work.pageTitle
          : key === 'studio'
            ? dict.studio.title
            : dict.contact.title,
    url: path(typed, key),
  };

  const project = key === 'work' && sub ? data.projects.find((p) => p.slug === sub) : undefined;
  if (key === 'work' && sub && !project) notFound();

  const trail = project
    ? [home, section, { name: project.client, url: path(typed, 'work', project.slug) }]
    : [home, section];

  const schemas: object[] = [breadcrumbSchema(data, trail)];
  if (project) schemas.push(caseStudySchema(data, typed, project));
  if (key === 'services' || key === 'contact') {
    const faq = faqSchema(data, typed);
    if (faq) schemas.push(faq);
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {project ? (
        <CaseStudyPage locale={typed} slug={project.slug} />
      ) : key === 'services' ? (
        <ServicesPage locale={typed} />
      ) : key === 'work' ? (
        <WorkPage locale={typed} />
      ) : key === 'studio' ? (
        <StudioPage locale={typed} />
      ) : (
        <ContactPage locale={typed} />
      )}
    </>
  );
}
