import Link from 'next/link';
import { adminBase } from '@/lib/admin/auth';
import { getSiteData } from '@/lib/data/content';
import { pick } from '@/lib/data/types';

export default async function Dashboard() {
  const base = adminBase();
  const data = await getSiteData();

  const published = data.projects.filter((p) => p.published);
  const featured = published.filter((p) => p.featured);

  /* ---------------------------------------------------------------- */
  /* Controlli: cosa manca prima di andare online                      */
  /* ---------------------------------------------------------------- */

  type Check = { level: 'error' | 'warn'; text: string; href: string };
  const checks: Check[] = [];

  // Dati di esempio rimasti
  if (data.settings.vat.includes('00000000000'))
    checks.push({
      level: 'error',
      text: 'La partita IVA è ancora quella di esempio.',
      href: `${base}/impostazioni`,
    });
  if (data.settings.phoneHref.includes('0000000'))
    checks.push({
      level: 'error',
      text: 'Il numero di telefono è ancora quello di esempio.',
      href: `${base}/impostazioni`,
    });
  if (data.settings.address.street.toLowerCase().includes('esempio'))
    checks.push({
      level: 'error',
      text: "L'indirizzo della sede è ancora quello di esempio.",
      href: `${base}/impostazioni`,
    });

  // Progetti
  const noCover = published.filter((p) => !p.cover);
  if (noCover.length)
    checks.push({
      level: 'warn',
      text: `${noCover.length} progetti online senza foto di copertina: mostrano una copertina disegnata.`,
      href: `${base}/progetti`,
    });

  const noGerman = published.filter((p) => !p.title.de?.trim());
  if (noGerman.length)
    checks.push({
      level: 'warn',
      text: `${noGerman.length} progetti senza titolo in tedesco: la pagina /de mostra l'italiano.`,
      href: `${base}/progetti`,
    });

  if (published.length === 0)
    checks.push({
      level: 'error',
      text: 'Nessun progetto online: la pagina Lavori è vuota.',
      href: `${base}/progetti`,
    });

  if (featured.length === 0 && published.length > 0)
    checks.push({
      level: 'warn',
      text: 'Nessun progetto in evidenza: la galleria della home resta vuota.',
      href: `${base}/progetti`,
    });

  // SEO
  for (const [key, page] of Object.entries(data.seo.pages)) {
    const title = pick(page.title, 'it');
    const description = pick(page.description, 'it');
    if (!title)
      checks.push({ level: 'error', text: `Manca il titolo SEO di "${key}".`, href: `${base}/seo` });
    else if (title.length > 70)
      checks.push({
        level: 'warn',
        text: `Il titolo SEO di "${key}" è lungo ${title.length} caratteri: Google ne mostra circa 60.`,
        href: `${base}/seo`,
      });
    if (!description)
      checks.push({
        level: 'error',
        text: `Manca la descrizione SEO di "${key}".`,
        href: `${base}/seo`,
      });
    else if (description.length > 170)
      checks.push({
        level: 'warn',
        text: `La descrizione SEO di "${key}" è troppo lunga (${description.length}).`,
        href: `${base}/seo`,
      });
  }

  if (!data.seo.googleVerification)
    checks.push({
      level: 'warn',
      text: 'Search Console non è ancora collegata: senza non sai per cosa ti trovano.',
      href: `${base}/seo`,
    });

  // Immagini
  const noAlt = data.media.filter((m) => !m.alt.it.trim());
  if (noAlt.length)
    checks.push({
      level: 'warn',
      text: `${noAlt.length} immagini senza testo alternativo.`,
      href: `${base}/media`,
    });

  const errors = checks.filter((c) => c.level === 'error');
  const warnings = checks.filter((c) => c.level === 'warn');

  const cards = [
    { label: 'Progetti online', value: published.length, href: `${base}/progetti` },
    { label: 'In evidenza in home', value: featured.length, href: `${base}/progetti` },
    { label: 'Servizi', value: data.services.filter((s) => s.published).length, href: `${base}/contenuti` },
    { label: 'Immagini', value: data.media.length, href: `${base}/media` },
  ];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-[-0.025em]">Riepilogo</h1>
        <p className="mt-1.5 text-[0.875rem] text-zinc-500">
          Stato del sito e cosa conviene sistemare.
        </p>
      </header>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="admin-card p-5 hover:border-zinc-400">
            <p className="text-3xl font-semibold tracking-[-0.03em] tabular-nums">{card.value}</p>
            <p className="mt-1.5 text-[0.8rem] text-zinc-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <section className="admin-card mb-5 p-6">
        <h2 className="mb-1 text-[0.95rem] font-semibold">Da sistemare</h2>
        <p className="mb-5 text-[0.8rem] text-zinc-500">
          {checks.length === 0
            ? 'Niente da segnalare.'
            : `${errors.length} da correggere, ${warnings.length} da valutare.`}
        </p>

        {checks.length === 0 ? (
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[0.85rem] text-green-800">
            Tutto a posto: dati reali, progetti online e SEO compilata.
          </p>
        ) : (
          <ul className="space-y-2">
            {[...errors, ...warnings].map((check, index) => (
              <li key={index}>
                <Link
                  href={check.href}
                  className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-[0.85rem] leading-relaxed transition-colors ${
                    check.level === 'error'
                      ? 'border-red-200 bg-red-50 text-red-800 hover:border-red-400'
                      : 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400'
                  }`}
                >
                  <span aria-hidden className="mt-px shrink-0 font-semibold">
                    {check.level === 'error' ? '!' : '·'}
                  </span>
                  <span>{check.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-card p-6">
        <h2 className="mb-4 text-[0.95rem] font-semibold">Scorciatoie</h2>
        <div className="flex flex-wrap gap-2">
          <Link href={`${base}/progetti/nuovo`} className="admin-btn admin-btn-primary">
            + Nuovo progetto
          </Link>
          <Link href={`${base}/media`} className="admin-btn admin-btn-ghost">
            Carica immagini
          </Link>
          <Link href={`${base}/contenuti`} className="admin-btn admin-btn-ghost">
            Modifica i testi
          </Link>
          <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="admin-btn admin-btn-ghost">
            Sitemap ↗
          </a>
        </div>

        <p className="mt-5 text-[0.76rem] leading-relaxed text-zinc-500">
          Ogni salvataggio tiene una copia dei contenuti in <code>data/backups</code> (le ultime
          venti). Per un backup completo copia la cartella <code>data</code> e{' '}
          <code>public/uploads</code>.
        </p>
      </section>
    </>
  );
}
