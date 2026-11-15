'use client';

/**
 * Scorrimento morbido con Lenis, sincronizzato con il ticker di GSAP.
 * È il modo consigliato dalla documentazione di Lenis: un solo loop
 * di animazione per tutto il sito, così Lenis e ScrollTrigger non
 * litigano su chi aggiorna per primo.
 */

import { ReactLenis, useLenis, type LenisRef } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

/** Avvisa ScrollTrigger a ogni passo di Lenis. Vive dentro il provider. */
function LenisScrollTriggerBridge() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Il riferimento può non essere ancora pronto al primo giro: lo leggiamo
    // a ogni frame invece di catturarlo una volta sola, altrimenti il loop
    // non parte e la pagina resta bloccata.
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // A ogni cambio pagina: torna in cima e ricalcola i trigger.
  useEffect(() => {
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // Immagini e font che finiscono di caricare cambiano l'altezza della pagina.
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        duration: 1.05,
        smoothWheel: !prefersReducedMotion(),
        syncTouch: false,
        touchMultiplier: 1.6,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
