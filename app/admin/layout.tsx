import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './admin.css';

/**
 * Radice del pannello. È separata da quella del sito pubblico:
 * niente scorrimento morbido, niente animazioni, niente barra di
 * navigazione del sito — solo un'interfaccia di lavoro.
 */

const inter = localFont({
  src: '../../public/fonts/inter-variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

const mono = localFont({
  src: '../../public/fonts/jetbrains-mono-variable.woff2',
  variable: '--font-mono-face',
  display: 'swap',
  weight: '100 800',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

export const metadata: Metadata = {
  title: 'Pannello — WAB Studio',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Nessuna pagina del pannello va messa in cache né generata in anticipo:
 * dipendono dal cookie di sessione e dai contenuti del momento.
 * Vale per tutte le rotte annidate sotto questo layout.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
