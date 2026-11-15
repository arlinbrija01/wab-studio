import { getSiteData } from '@/lib/data/content';
import MediaLibrary from './MediaLibrary';

export default async function MediaPage() {
  const data = await getSiteData();

  // Per ogni immagine, dove viene usata.
  const usage: Record<string, string[]> = {};
  for (const project of data.projects) {
    for (const url of [project.cover, ...project.gallery]) {
      if (!url) continue;
      (usage[url] ??= []).push(project.client || project.slug);
    }
  }
  for (const [key, page] of Object.entries(data.seo.pages)) {
    if (page.ogImage) (usage[page.ogImage] ??= []).push(`SEO: ${key}`);
  }
  if (data.seo.ogImage) (usage[data.seo.ogImage] ??= []).push('SEO: anteprima social');

  return <MediaLibrary media={data.media} usage={usage} />;
}
