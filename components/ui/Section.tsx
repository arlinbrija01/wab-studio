import type { ReactNode } from 'react';

export type SectionTheme = 'dark' | 'light' | 'paper';

/**
 * Blocco di pagina con il proprio tema.
 * `data-theme` imposta le variabili di colore (vedi globals.css),
 * `data-nav` dice alla barra di navigazione se schiarirsi o scurirsi
 * quando passa sopra questa sezione.
 */
export default function Section({
  children,
  theme = 'dark',
  id,
  className = '',
  pad = true,
}: {
  children: ReactNode;
  theme?: SectionTheme;
  id?: string;
  className?: string;
  pad?: boolean;
}) {
  return (
    <section
      id={id}
      data-theme={theme}
      data-nav={theme === 'dark' ? 'dark' : 'light'}
      className={`themed relative ${pad ? 'section-pad' : ''} ${className}`}
    >
      {children}
    </section>
  );
}
