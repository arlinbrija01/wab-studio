'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { logoutAction } from '../_actions/auth';

const items = [
  { href: '', label: 'Riepilogo' },
  { href: 'progetti', label: 'Progetti' },
  { href: 'contenuti', label: 'Contenuti' },
  { href: 'media', label: 'Immagini' },
  { href: 'seo', label: 'SEO' },
  { href: 'impostazioni', label: 'Impostazioni' },
];

export default function AdminShell({
  base,
  email,
  updatedAt,
  children,
}: {
  base: string;
  email: string;
  updatedAt: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    const full = href ? `${base}/${href}` : base;
    if (!href) return pathname === base || pathname === `${base}/`;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  const nav = (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href || 'home'}
          href={item.href ? `${base}/${item.href}` : base}
          data-active={isActive(item.href)}
          onClick={() => setOpen(false)}
          className="admin-nav-item"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Barra laterale */}
      <aside className="sticky top-0 z-30 border-b border-zinc-200 bg-white lg:h-screen lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 p-4 lg:block">
          <Link href={base} className="flex items-baseline gap-[0.3em] leading-none">
            <span className="text-base font-semibold tracking-[-0.04em]">WAB</span>
            <span className="mb-[0.15em] h-[0.26em] w-[0.26em] rounded-full bg-[#2f6bff]" />
            <span className="font-mono text-[0.6rem] tracking-[0.18em] text-zinc-500 uppercase">
              Pannello
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="admin-btn admin-btn-ghost admin-btn-sm lg:hidden"
            aria-expanded={open}
          >
            {open ? 'Chiudi' : 'Menu'}
          </button>
        </div>

        <div className={`${open ? 'block' : 'hidden'} px-3 pb-4 lg:block`}>
          {nav}

          <div className="mt-6 space-y-3 border-t border-zinc-200 px-1 pt-5">
            <p className="text-[0.7rem] break-all text-zinc-500">{email}</p>
            <p className="text-[0.7rem] text-zinc-400">
              Ultima modifica{' '}
              {new Date(updatedAt).toLocaleString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            <a
              href="/it"
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-ghost admin-btn-sm w-full"
            >
              Vedi il sito ↗
            </a>

            <form action={logoutAction}>
              <button type="submit" className="admin-btn admin-btn-ghost admin-btn-sm w-full">
                Esci
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
