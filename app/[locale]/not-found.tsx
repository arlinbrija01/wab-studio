import Link from 'next/link';
import { defaultLocale, path } from '@/lib/routes';
import { getStaticDict } from '@/content';

export default function NotFound() {
  // La pagina 404 non riceve i parametri della rotta: usiamo l'italiano.
  const dict = getStaticDict(defaultLocale);

  return (
    <section
      data-theme="dark"
      data-nav="dark"
      className="themed flex min-h-[80svh] items-center justify-center text-center"
    >
      <div className="shell">
        <p className="eyebrow mb-7 text-[var(--color-accent)]">404</p>
        <h1 className="display-lg mx-auto max-w-[14ch]">{dict.notFound.title}</h1>
        <p className="lead mx-auto mt-7 max-w-md text-[var(--fg-muted)]">{dict.notFound.lead}</p>
        <Link
          href={path(defaultLocale, 'home')}
          className="btn-base mt-10 bg-[var(--color-accent)] text-white transition-colors hover:bg-[var(--color-accent-deep)]"
        >
          {dict.notFound.cta}
        </Link>
      </div>
    </section>
  );
}
