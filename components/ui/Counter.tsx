'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

/**
 * Numero che sale quando entra nel viewport.
 * Scritto con GSAP invece che con una libreria dedicata, così il sito
 * non aggiunge dipendenze solo per contare fino a cento.
 */
export default function Counter({
  value,
  suffix = '',
  decimals = 0,
  duration = 1.8,
  locale = 'it-IT',
  className = '',
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  locale?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    n.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        el.textContent = format(value) + suffix;
        return;
      }

      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(counter.n) + suffix;
        },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={className}>
      {format(0)}
      {suffix}
    </span>
  );
}
