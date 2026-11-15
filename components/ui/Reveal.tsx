'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Spostamento verticale iniziale, in pixel. */
  y?: number;
  delay?: number;
  duration?: number;
  /** Se i figli diretti devono entrare in sequenza invece che insieme. */
  stagger?: number;
  /** Punto di partenza ScrollTrigger (default: quando entra per 85% nel viewport). */
  start?: string;
  blur?: number;
}

/**
 * Rivelazione all'ingresso nel viewport.
 * Un solo ScrollTrigger per blocco, pulito automaticamente da useGSAP.
 */
export default function Reveal({
  children,
  className = '',
  y = 28,
  delay = 0,
  duration = 1,
  stagger,
  start = 'top 85%',
  blur = 6,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(ref.current, { autoAlpha: 1, clearProps: 'all' });
        return;
      }

      const targets =
        stagger !== undefined && ref.current ? Array.from(ref.current.children) : ref.current;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y, filter: blur ? `blur(${blur}px)` : 'none' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start, once: true },
        }
      );
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
