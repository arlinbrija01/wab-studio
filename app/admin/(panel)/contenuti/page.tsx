import { getSiteData } from '@/lib/data/content';
import ContentEditor from './ContentEditor';

export default async function ContentPage() {
  const data = await getSiteData();

  return (
    <ContentEditor
      home={data.home}
      studio={data.studio}
      closings={{ cta: data.cta, contact: data.contact, footerTagline: data.footerTagline }}
      services={[...data.services].sort((a, b) => a.order - b.order)}
      process={[...data.process].sort((a, b) => a.order - b.order)}
      stats={[...data.stats].sort((a, b) => a.order - b.order)}
      stack={data.stack}
      testimonials={[...data.testimonials].sort((a, b) => a.order - b.order)}
      faq={[...data.faq].sort((a, b) => a.order - b.order)}
    />
  );
}
