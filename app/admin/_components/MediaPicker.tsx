'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import type { MediaItem } from '@/lib/data/types';
import { uploadMedia } from '../_actions/media';

/** Riquadro di scelta immagine, con caricamento diretto. */
export default function MediaPicker({
  label,
  value,
  media,
  onChange,
  hint,
  aspect = 'aspect-[16/10]',
}: {
  label: string;
  value?: string;
  media: MediaItem[];
  onChange: (url: string | undefined) => void;
  hint?: string;
  aspect?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <span className="admin-label">{label}</span>

      <div className="flex items-start gap-4">
        <div
          className={`${aspect} w-40 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[0.7rem] text-zinc-400">
              nessuna
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            {value ? 'Cambia' : 'Scegli immagine'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              Togli
            </button>
          )}
          {hint && <p className="max-w-xs text-[0.72rem] leading-relaxed text-zinc-500">{hint}</p>}
        </div>
      </div>

      {open && (
        <MediaDialog
          media={media}
          onClose={() => setOpen(false)}
          onPick={(url) => {
            onChange(url);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

/** Scelta multipla, per le gallerie. */
export function MediaMultiPicker({
  label,
  values,
  media,
  onChange,
  hint,
}: {
  label: string;
  values: string[];
  media: MediaItem[];
  onChange: (urls: string[]) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="admin-label">{label}</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="admin-btn admin-btn-ghost admin-btn-sm mb-1.5"
        >
          + Aggiungi
        </button>
      </div>

      {values.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-[0.78rem] text-zinc-400">
          Nessuna immagine
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {values.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-20 w-28 rounded-lg border border-zinc-200 object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                aria-label="Togli"
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs shadow-sm hover:border-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {hint && <p className="mt-2 text-[0.72rem] text-zinc-500">{hint}</p>}

      {open && (
        <MediaDialog
          media={media}
          onClose={() => setOpen(false)}
          onPick={(url) => {
            if (!values.includes(url)) onChange([...values, url]);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function MediaDialog({
  media,
  onPick,
  onClose,
}: {
  media: MediaItem[];
  onPick: (url: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState(media);

  const upload = (file: File) => {
    setError(null);
    const body = new FormData();
    body.set('file', file);

    startTransition(async () => {
      const result = await uploadMedia(body);
      if (!result.ok || !result.item) {
        setError(result.error ?? 'Caricamento fallito.');
        return;
      }
      setItems((current) => [result.item!, ...current]);
      router.refresh();
      onPick(result.item.url);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="admin-card flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 p-4">
          <h2 className="text-[0.95rem] font-semibold">Immagini</h2>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload(file);
                event.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={pending}
              className="admin-btn admin-btn-primary admin-btn-sm"
            >
              {pending ? 'Carico…' : '+ Carica'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              Chiudi
            </button>
          </div>
        </div>

        {error && (
          <p className="border-b border-red-200 bg-red-50 px-4 py-2.5 text-[0.8rem] text-red-700">
            {error}
          </p>
        )}

        <div className="min-h-40 flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-[0.85rem] text-zinc-500">
              Nessuna immagine caricata. Usa “Carica”: JPG, PNG, WebP, AVIF o GIF, fino a 8 MB.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPick(item.url)}
                  className="group overflow-hidden rounded-lg border border-zinc-200 text-left transition-colors hover:border-[#2f6bff]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt.it}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="block truncate px-2 py-1.5 text-[0.7rem] text-zinc-600">
                    {item.filename}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
