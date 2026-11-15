import { getSiteData } from '@/lib/data/content';
import SeoEditor from './SeoEditor';

export default async function SeoPage() {
  const data = await getSiteData();
  return <SeoEditor seo={data.seo} media={data.media} siteUrl={data.settings.url} />;
}
