'use client';

import { useCallback, useMemo, useState } from 'react';
import type { SaveState } from './SaveBar';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Tiene la bozza di una schermata del pannello.
 * Confronta la bozza con l'ultima versione salvata per capire se c'è
 * qualcosa da salvare, e aggiorna lo stato del pulsante.
 */
export function useEditor<T>(initial: T, save: (value: T) => Promise<ActionResult>) {
  const [value, setValue] = useState<T>(initial);
  const [baseline, setBaseline] = useState<T>(initial);
  const [state, setState] = useState<SaveState>('idle');
  const [error, setError] = useState<string | undefined>();

  const dirty = useMemo(
    () => JSON.stringify(value) !== JSON.stringify(baseline),
    [value, baseline]
  );

  const commit = useCallback(async () => {
    setState('saving');
    setError(undefined);
    try {
      const result = await save(value);
      if (!result.ok) {
        setError(result.error);
        setState('error');
        return false;
      }
      setBaseline(value);
      setState('saved');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore imprevisto.');
      setState('error');
      return false;
    }
  }, [save, value]);

  const reset = useCallback(() => {
    setValue(baseline);
    setState('idle');
    setError(undefined);
  }, [baseline]);

  /** Aggiorna una sola chiave di primo livello. */
  const patch = useCallback((changes: Partial<T>) => {
    setValue((current) => ({ ...current, ...changes }));
  }, []);

  return { value, setValue, patch, dirty, state, error, save: commit, reset };
}

/** Sposta un elemento di un array di una posizione. */
export function move<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

/** Riassegna il campo `order` seguendo la posizione nell'array. */
export function reorder<T extends { order: number }>(list: T[]): T[] {
  return list.map((item, index) => ({ ...item, order: index }));
}

/** Identificatore semplice e leggibile. */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Trasforma un titolo in uno slug per gli indirizzi. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
