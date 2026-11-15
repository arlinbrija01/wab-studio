import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import '../globals.css';

import { locales, isLocale, type Locale } from '@/lib/routes';
import { getDict, getSiteData } from '@/lib/data/content';
import { buildMetadata, organizationSchema, websiteSchema } from '@/lib/seo';
import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

/**
 * Font ospitati sul nostro server, non su Google.
 * I file stanno in /public/fonts: il browser di chi visita il sito non
 * contatta mai fonts.google.com, quindi niente richieste a terzi da
 * dichiarare nel cookie banner e una cosa in meno da caricare.
 * Entrambi i caratteri sono a licenza aperta (SIL Open Font License).
 */
const inter = localFont({
  src: '../../public/fonts/inter-variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
  style: 'normal',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

const mono = localFont({
  src: '../../public/fonts/jetbrains-mono-variable.woff2',
  variable: '--font-mono-face',
  display: 'swap',
  weight: '100 800',
  style: 'normal',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#050507',
  colorScheme: 'dark',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const data = await getSiteData();
  const base = buildMetadata({ data, locale, seoKey: 'home' });

  return {
    ...base,
    metadataBase: new URL(data.settings.url),
    title: {
      default: String(base.title ?? data.settings.name),
      template: `%s — ${data.settings.name}`,
    },
    applicationName: data.settings.name,
    authors: [{ name: data.settings.name, url: data.settings.url }],
    creator: data.settings.name,
    publisher: data.settings.legalName || data.settings.name,
    formatDetection: { telephone: false, address: false, email: false },
    verification: data.seo.googleVerification
      ? { google: data.seo.googleVerification }
      : undefined,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const [data, dict] = await Promise.all([getSiteData(), getDict(typedLocale)]);

  // Dati strutturati: dicono a Google di chi è il sito e cosa offre.
  const schemas = [organizationSchema(data, typedLocale), websiteSchema(data, typedLocale)];

  return (
    /* suppressHydrationWarning: lo script qui sotto aggiunge un attributo
       all'elemento <html> prima dell'idratazione, ed è voluto. */
    <html
      lang={typedLocale}
      className={`${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marca la pagina come "con JavaScript" prima del primo disegno,
            così gli elementi animati partono nascosti senza sfarfallii. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-js','')`,
          }}
        />
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-black"
        >
          {typedLocale === 'de' ? 'Zum Inhalt springen' : 'Vai al contenuto'}
        </a>

        <SmoothScroll>
          <Nav locale={typedLocale} dict={dict} />
          <main id="main">{children}</main>
          <Footer locale={typedLocale} dict={dict} />
        </SmoothScroll>

        {/* Statistiche: caricate solo se hai indicato un ID in SEO → pannello */}
        {data.seo.analyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${data.seo.analyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${data.seo.analyticsId}',{anonymize_ip:true});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
