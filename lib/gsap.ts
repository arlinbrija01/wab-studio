'use client';

/**
 * Punto unico di registrazione dei plugin GSAP.
 * Importa sempre da qui (`@/lib/gsap`), mai direttamente da 'gsap',
 * così i plugin risultano registrati una sola volta e solo lato client.
 *
 * Tutti i plugin GSAP sono gratuiti, anche per uso commerciale,
 * dall'acquisizione di GSAP da parte di Webflow: nessuna licenza richiesta.
 */

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText);

  gsap.defaults({ duration: 0.8, ease: 'power3.out' });

  // Evita che ScrollTrigger ricalcoli a ogni pixel di resize su mobile
  // (la barra degli indirizzi che si apre e chiude conta come resize).
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** true quando l'utente ha chiesto meno animazioni a livello di sistema. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, useGSAP, ScrollTrigger, ScrollToPlugin, SplitText };
