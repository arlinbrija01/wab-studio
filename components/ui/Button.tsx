'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import Magnet from '@/components/reactbits/Magnet';

type Variant = 'solid' | 'outline' | 'accent' | 'ghost';

const variants: Record<Variant, string> = {
  // Inverte il colore rispetto alla sezione: bianco su nero, nero su bianco.
  solid:
    'bg-[var(--btn-bg)] text-[var(--btn-fg)] hover:bg-[var(--color-accent)] hover:text-white',
  outline:
    'border border-[var(--line)] text-[var(--fg)] hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]',
  accent: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-deep)]',
  ghost: 'text-[var(--fg)] hover:text-[var(--color-accent)] px-0',
};

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  magnetic?: boolean;
  disabled?: boolean;
  className?: string;
  arrow?: boolean;
  external?: boolean;
}

/**
 * Pulsante con effetto magnetico: a mouse vicino il pulsante si sposta
 * leggermente verso il cursore. Componente Magnet di React Bits.
 */
export default function Button({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'solid',
  magnetic = true,
  disabled = false,
  className = '',
  arrow = false,
  external = false,
}: ButtonProps) {
  const classes = `btn-base ${variants[variant]} ${
    disabled ? 'pointer-events-none opacity-50' : ''
  } ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <svg
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1"
        >
          <path
            d="M1 7h11M7.5 2.5 12 7l-4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );

  const element = href ? (
    external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group/btn ${classes}`}
      >
        {inner}
      </a>
    ) : (
      <Link href={href} className={`group/btn ${classes}`} onClick={onClick}>
        {inner}
      </Link>
    )
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={`group/btn ${classes}`}>
      {inner}
    </button>
  );

  if (!magnetic || disabled) return element;

  return (
    <Magnet padding={70} magnetStrength={3} maxOffset={14} scale={1.02} wrapperClassName="inline-flex">
      {element}
    </Magnet>
  );
}
