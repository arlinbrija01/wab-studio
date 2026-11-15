'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

/**
 * Nastro scorrevole infinito, animato con GSAP.
 * Duplica la lista una volta e sposta il contenitore di -50%:
 * quando arriva a metà riparte da zero e l'occhio non se ne accorge.
 */
export default function Marquee({
  items,
  speed = 28,
  reverse = false,
  separator = '—',
  className = '',
  itemClassName = '',
}: {
  items: readonly string[];
  /** Secondi per completare un giro: più alto = più lento. */
  speed?: number;
  reverse?: boolean;
  separator?: string;
  className?: string;
  itemClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !trackRef.current) return;

      // Il nastro contiene la lista due volte: -50% e 0% sono visivamente
      // identici, quindi il ciclo si richiude senza salti.
      if (reverse) gsap.set(trackRef.current, { xPercent: -50 });

      const tween = gsap.to(trackRef.current, {
        xPercent: reverse ? 0 : -50,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });

      // Rallenta quando il nastro non è a schermo: niente lavoro inutile.
      const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? tween.play() : tween.pause()),
        { rootMargin: '120px' }
      );
      if (ref.current) observer.observe(ref.current);

      return () => observer.disconnect();
    },
    { scope: ref }
  );

  const row = (
    <div className="flex shrink-0 items-center" aria-hidden={false}>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className={`flex shrink-0 items-center ${itemClassName}`}>
          {item}
          <span className="mx-[0.6em] opacity-30 select-none" aria-hidden>
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {row}
        <div aria-hidden>{row}</div>
      </div>
    </div>
  );
}
