import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/routes';
import { getDict, getSiteData } from '@/lib/data/content';
import { faqSchema } from '@/lib/seo';

import Hero from '@/components/sections/Hero';
import Manifesto from '@/components/sections/Manifesto';
import Services from '@/components/sections/Services';
import WorkShowcase from '@/components/sections/WorkShowcase';
import Process from '@/components/sections/Process';
import Stats from '@/components/sections/Stats';
import Testimonials from '@/components/sections/Testimonials';
import Faq from '@/components/sections/Faq';
import CtaBand from '@/components/sections/CtaBand';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typed = locale as Locale;
  const [data, dict] = await Promise.all([getSiteData(), getDict(typed)]);
  const show = data.home.show;

  // Solo i progetti messi "in evidenza" entrano nella galleria della home.
  const featuredSlugs = new Set(
    data.projects.filter((p) => p.published && p.featured).map((p) => p.slug)
  );
  const homeDict = {
    ...dict,
    work: {
      ...dict.work,
      items: dict.work.items.filter((item) => featuredSlugs.has(item.slug)),
    },
  };

  const faq = show.faq ? faqSchema(data, typed) : null;

  return (
    <>
      {faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
        />
      )}

      <Hero locale={typed} dict={dict} />
      {show.manifesto && <Manifesto dict={dict} />}
      {show.services && dict.services.items.length > 0 && (
        <Services locale={typed} dict={dict} />
      )}
      {show.work && homeDict.work.items.length > 0 && (
        <WorkShowcase locale={typed} dict={homeDict} />
      )}
      {show.process && dict.process.steps.length > 0 && <Process dict={dict} />}
      {show.stats && dict.stats.items.length > 0 && <Stats locale={typed} dict={dict} />}
      {show.testimonials && dict.testimonials.items.length > 0 && <Testimonials dict={dict} />}
      {show.faq && dict.faq.items.length > 0 && <Faq dict={dict} />}
      <CtaBand locale={typed} dict={dict} />
    </>
  );
}
