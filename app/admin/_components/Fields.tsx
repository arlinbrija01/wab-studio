'use client';

import type { ReactNode } from 'react';
import type { L } from '@/lib/data/types';

/* ------------------------------------------------------------------ */
/* Campi semplici                                                      */
/* ------------------------------------------------------------------ */

export function Text({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = 'text',
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`admin-input ${mono ? 'font-mono text-[0.82rem]' : ''}`}
      />
      {hint && <span className="mt-1.5 block text-[0.72rem] text-zinc-500">{hint}</span>}
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="admin-input"
      />
      {hint && <span className="mt-1.5 block text-[0.72rem] text-zinc-500">{hint}</span>}
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#2f6bff]"
      />
      <span>
        <span className="block text-sm text-zinc-800">{label}</span>
        {hint && <span className="mt-0.5 block text-[0.72rem] text-zinc-500">{hint}</span>}
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Campi bilingui                                                      */
/* ------------------------------------------------------------------ */

function LangBadge({ code, filled }: { code: string; filled: boolean }) {
  return (
    <span
      className={`w-7 shrink-0 pt-2.5 font-mono text-[0.62rem] tracking-[0.12em] uppercase ${
        filled ? 'text-zinc-400' : 'text-amber-500'
      }`}
    >
      {code}
    </span>
  );
}

/**
 * Due caselle, italiano e tedesco.
 * Il tedesco può restare vuoto: in quel caso il sito mostra l'italiano.
 */
export function LocText({
  label,
  value,
  onChange,
  placeholder,
  hint,
  counter,
}: {
  label: string;
  value: L;
  onChange: (value: L) => void;
  placeholder?: string;
  hint?: string;
  /** Lunghezza consigliata: mostra un contatore con avviso */
  counter?: { ideal: number; max: number };
}) {
  const length = value.it.length;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="admin-label">{label}</span>
        {counter && (
          <span
            className={`mb-1.5 font-mono text-[0.68rem] ${
              length > counter.max
                ? 'text-red-600'
                : length > counter.ideal
                  ? 'text-amber-600'
                  : 'text-zinc-400'
            }`}
          >
            {length}/{counter.max}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex gap-2">
          <LangBadge code="it" filled={Boolean(value.it.trim())} />
          <input
            value={value.it}
            onChange={(e) => onChange({ ...value, it: e.target.value })}
            placeholder={placeholder}
            className="admin-input"
          />
        </div>
        <div className="flex gap-2">
          <LangBadge code="de" filled={Boolean(value.de?.trim())} />
          <input
            value={value.de ?? ''}
            onChange={(e) => onChange({ ...value, de: e.target.value })}
            placeholder="Vuoto = mostra l'italiano"
            className="admin-input"
          />
        </div>
      </div>

      {hint && <p className="mt-1.5 text-[0.72rem] text-zinc-500">{hint}</p>}
    </div>
  );
}

export function LocArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
  counter,
}: {
  label: string;
  value: L;
  onChange: (value: L) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
  counter?: { ideal: number; max: number };
}) {
  const length = value.it.length;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="admin-label">{label}</span>
        {counter && (
          <span
            className={`mb-1.5 font-mono text-[0.68rem] ${
              length > counter.max
                ? 'text-red-600'
                : length > counter.ideal
                  ? 'text-amber-600'
                  : 'text-zinc-400'
            }`}
          >
            {length}/{counter.max}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex gap-2">
          <LangBadge code="it" filled={Boolean(value.it.trim())} />
          <textarea
            rows={rows}
            value={value.it}
            onChange={(e) => onChange({ ...value, it: e.target.value })}
            placeholder={placeholder}
            className="admin-input"
          />
        </div>
        <div className="flex gap-2">
          <LangBadge code="de" filled={Boolean(value.de?.trim())} />
          <textarea
            rows={rows}
            value={value.de ?? ''}
            onChange={(e) => onChange({ ...value, de: e.target.value })}
            placeholder="Vuoto = mostra l'italiano"
            className="admin-input"
          />
        </div>
      </div>

      {hint && <p className="mt-1.5 text-[0.72rem] text-zinc-500">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Struttura                                                           */
/* ------------------------------------------------------------------ */

export function Panel({
  title,
  description,
  children,
  aside,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="admin-card mb-5 p-6 md:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em]">{title}</h2>
          {description && (
            <p className="mt-1 max-w-xl text-[0.8rem] leading-relaxed text-zinc-500">
              {description}
            </p>
          )}
        </div>
        {aside}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.025em]">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[0.875rem] leading-relaxed text-zinc-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}
