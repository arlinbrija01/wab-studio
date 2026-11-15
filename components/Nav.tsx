'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { path, translatePath, otherLocale, type Locale } from '@/lib/routes';
import type { SiteDict } from '@/content';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';

export default function Nav({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  const root = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navTheme, setNavTheme] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();
  const lenis = useLenis();

  const other = otherLocale(locale);
  const otherHref = translatePath(pathname, locale, other);

  /* La barra cambia colore in base alla sezione che le passa sotto.
     Un ScrollTrigger per sezione, ricostruiti a ogni cambio pagina. */
  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>('[data-nav]');
      if (!sections.length) return;

      const apply = (el: HTMLElement) =>
        setNavTheme(el.dataset.nav === 'light' ? 'light' : 'dark');

      sections.forEach((section, i) =>
        ScrollTrigger.create({
          trigger: section,
          start: 'top top+=44',
          end: 'bottom top+=44',
          refreshPriority: i,
          onEnter: () => apply(section),
          onEnterBack: () => apply(section),
        })
      );

      // Fondo opaco appena si lascia la cima della pagina.
      ScrollTrigger.create({
        start: 12,
        end: 'max',
        onToggle: (self) => setScrolled(self.isActive),
      });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  /* Apertura del menù su mobile: ingresso scaglionato delle voci. */
  useGSAP(
    () => {
      if (!open || !menuRef.current) return;
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline();
      tl.fromTo(
        menuRef.current,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut' }
      ).fromTo(
        menuRef.current.querySelectorAll('[data-menu-item]'),
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' },
        '-=0.35'
      );
    },
    { dependencies: [open], revertOnUpdate: true }
  );

  // Blocca lo scorrimento della pagina quando il menù è aperto.
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [open, lenis]);

  // Chiude il menù quando si cambia pagina.
  useEffect(() => setOpen(false), [pathname]);

  const light = navTheme === 'light';
  const fg = light ? 'text-[#0a0a0c]' : 'text-[#f7f7f9]';

  return (
    <>
      <header
        ref={root}
        data-theme={light ? 'light' : 'dark'}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-[var(--ease-out-expo)] ${fg} ${
          scrolled && !open
            ? 'border-b border-[var(--line)] backdrop-blur-xl ' +
              (light ? 'bg-white/70' : 'bg-[#050507]/65')
            : 'border-b border-transparent'
        }`}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <Logo locale={locale} />

          <nav aria-label="Principale" className="hidden items-center gap-9 lg:flex">
            {dict.nav.items.map((item) => {
              const href = path(locale, item.key);
              const active = pathname.startsWith(href) && href !== path(locale, 'home');
              return (
                <Link
                  key={item.key}
                  href={href}
                  className="group relative py-1 text-[0.9375rem] tracking-[-0.01em] transition-opacity duration-300 hover:opacity-60"
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-current transition-all duration-500 ease-[var(--ease-out-expo)] ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={otherHref}
              hrefLang={other}
              aria-label={`${dict.nav.langLabel}: ${other.toUpperCase()}`}
              className="eyebrow hidden rounded-full border border-[var(--line)] px-3 py-1.5 transition-colors duration-300 hover:border-current md:inline-block"
            >
              {other.toUpperCase()}
            </Link>

            <div className="hidden lg:block">
              <Button href={path(locale, 'contact')} variant="solid" arrow className="!px-5 !py-2.5">
                {dict.nav.cta}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? dict.nav.close : dict.nav.menu}
              className="relative z-50 -mr-1 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                    open ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menù a tutto schermo su mobile e tablet */}
      {open && (
        <div
          ref={menuRef}
          data-theme="dark"
          className="themed fixed inset-0 z-40 flex flex-col justify-between pt-[72px] lg:hidden"
        >
          <nav className="shell flex flex-col gap-1 pt-12" aria-label="Menù mobile">
            {dict.nav.items.map((item) => (
              <Link
                key={item.key}
                data-menu-item
                href={path(locale, item.key)}
                onClick={() => setOpen(false)}
                className="display-md border-b border-[var(--line)] py-5 transition-opacity duration-300 hover:opacity-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="shell flex items-center justify-between gap-4 pb-12" data-menu-item>
            <Link
              href={otherHref}
              hrefLang={other}
              onClick={() => setOpen(false)}
              className="eyebrow rounded-full border border-[var(--line)] px-4 py-2"
            >
              {dict.nav.langLabel}: {other.toUpperCase()}
            </Link>
            <Button
              href={path(locale, 'contact')}
              variant="accent"
              arrow
              magnetic={false}
              onClick={() => setOpen(false)}
            >
              {dict.nav.cta}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
