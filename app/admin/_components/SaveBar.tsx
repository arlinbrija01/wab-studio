'use client';

import { useEffect, useState } from 'react';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Barra di salvataggio appiccicata in basso.
 * Compare solo quando c'è qualcosa di non salvato, così non copre
 * la pagina mentre si legge.
 */
export default function SaveBar({
  dirty,
  state,
  onSave,
  onReset,
  error,
}: {
  dirty: boolean;
  state: SaveState;
  onSave: () => void;
  onReset?: () => void;
  error?: string;
}) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (state !== 'saved') return;
    setShowSaved(true);
    const id = window.setTimeout(() => setShowSaved(false), 2600);
    return () => window.clearTimeout(id);
  }, [state]);

  // Avvisa se si sta per chiudere la pagina con modifiche non salvate.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  // Ctrl/Cmd + S salva
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (dirty && state !== 'saving') onSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dirty, state, onSave]);

  const visible = dirty || state === 'saving' || showSaved || state === 'error';
  if (!visible) return null;

  return (
    <div className="sticky bottom-4 z-40 mt-8">
      <div className="admin-card flex flex-wrap items-center justify-between gap-4 p-3.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)]">
        <p className="pl-1 text-[0.82rem] text-zinc-600">
          {state === 'saving' && 'Salvataggio…'}
          {state === 'error' && (
            <span className="text-red-600">{error || 'Salvataggio non riuscito.'}</span>
          )}
          {state !== 'saving' && state !== 'error' && showSaved && (
            <span className="text-green-700">Salvato. Il sito è già aggiornato.</span>
          )}
          {state !== 'saving' && state !== 'error' && !showSaved && dirty && 'Modifiche non salvate'}
        </p>

        <div className="flex gap-2">
          {onReset && dirty && state !== 'saving' && (
            <button type="button" onClick={onReset} className="admin-btn admin-btn-ghost">
              Annulla
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty || state === 'saving'}
            className="admin-btn admin-btn-primary"
          >
            {state === 'saving' ? 'Salvataggio…' : 'Salva'}
          </button>
        </div>
      </div>
    </div>
  );
}
