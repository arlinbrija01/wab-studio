'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import type { MediaItem } from '@/lib/data/types';
import { PageTitle } from '../../_components/Fields';
import { deleteMedia, updateMediaAlt, uploadMedia } from '../../_actions/media';

const kb = (bytes: number) =>
  bytes > 900_000 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.round(bytes / 1000)} kB`;

export default function MediaLibrary({
  media,
  usage,
}: {
  media: MediaItem[];
  usage: Record<string, string[]>;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [drag, setDrag] = useState(false);

  const uploadFiles = (files: FileList | File[]) => {
    setMessage(null);
    startTransition(async () => {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.set('file', file);
        const result = await uploadMedia(body);
        if (!result.ok) {
          setMessage({ kind: 'error', text: `${file.name}: ${result.error}` });
          break;
        }
      }
      router.refresh();
    });
  };

  const remove = (item: MediaItem) => {
    if (!window.confirm(`Eliminare "${item.filename}"? Il file viene rimosso dal server.`)) return;
    setMessage(null);
    startTransition(async () => {
      const result = await deleteMedia(item.id);
      if (!result.ok) setMessage({ kind: 'error', text: result.error ?? 'Non riuscito.' });
      router.refresh();
    });
  };

  return (
    <>
      <PageTitle
        title="Immagini"
        description="Le foto caricate qui si possono usare nei progetti e come anteprima social."
        action={
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="admin-btn admin-btn-primary"
          >
            {pending ? 'Carico…' : '+ Carica immagini'}
          </button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        hidden
        onChange={(event) => {
          if (event.target.files?.length) uploadFiles(event.target.files);
          event.target.value = '';
        }}
      />

      {message && (
        <p
          className={`mb-5 rounded-lg border px-4 py-3 text-[0.82rem] ${
            message.kind === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Area di trascinamento */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`mb-7 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          drag ? 'border-[#2f6bff] bg-blue-50' : 'border-zinc-300 bg-white'
        }`}
      >
        <p className="text-[0.86rem] text-zinc-600">
          Trascina qui le immagini, oppure usa il pulsante in alto.
        </p>
        <p className="mt-1 text-[0.75rem] text-zinc-400">
          JPG, PNG, WebP, AVIF o GIF — fino a 8 MB l&apos;una. Per le copertine dei progetti
          servono almeno 1600 px di larghezza.
        </p>
      </div>

      {media.length === 0 ? (
        <div className="admin-card p-10 text-center">
          <p className="text-sm text-zinc-500">Nessuna immagine caricata.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              usedBy={usage[item.url] ?? []}
              onDelete={() => remove(item)}
              busy={pending}
            />
          ))}
        </div>
      )}
    </>
  );
}

function MediaCard({
  item,
  usedBy,
  onDelete,
  busy,
}: {
  item: MediaItem;
  usedBy: string[];
  onDelete: () => void;
  busy: boolean;
}) {
  const [alt, setAlt] = useState(item.alt);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = alt.it !== item.alt.it || (alt.de ?? '') !== (item.alt.de ?? '');

  const save = () =>
    startTransition(async () => {
      const result = await updateMediaAlt(item.id, alt);
      if (result.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
      }
    });

  return (
    <div className="admin-card overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt={item.alt.it}
        className="aspect-[4/3] w-full bg-zinc-100 object-cover"
        loading="lazy"
      />

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 flex-1 truncate font-mono text-[0.72rem] text-zinc-500">
            {item.filename}
          </p>
          <span className="shrink-0 text-[0.7rem] text-zinc-400">{kb(item.size)}</span>
        </div>

        <div className="space-y-1.5">
          <label className="admin-label mb-0">Testo alternativo</label>
          <input
            value={alt.it}
            onChange={(e) => setAlt({ ...alt, it: e.target.value })}
            placeholder="Cosa si vede nella foto"
            className="admin-input"
          />
          <input
            value={alt.de ?? ''}
            onChange={(e) => setAlt({ ...alt, de: e.target.value })}
            placeholder="Deutsch (facoltativo)"
            className="admin-input"
          />
          <p className="text-[0.7rem] text-zinc-500">
            Lo leggono i lettori per non vedenti e Google. Descrivi la scena, non ripetere il nome
            del file.
          </p>
        </div>

        {usedBy.length > 0 && (
          <p className="text-[0.72rem] text-zinc-500">
            Usata in: <span className="text-zinc-700">{usedBy.join(', ')}</span>
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={save}
            disabled={!dirty || pending}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            {pending ? 'Salvo…' : saved ? 'Salvato' : 'Salva testo'}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            Apri ↗
          </a>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy || usedBy.length > 0}
            title={usedBy.length > 0 ? 'Prima togli l’immagine da dove è usata' : undefined}
            className="admin-btn admin-btn-danger admin-btn-sm ml-auto"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
