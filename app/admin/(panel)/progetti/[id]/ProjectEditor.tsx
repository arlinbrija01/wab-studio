'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MediaItem, Project } from '@/lib/data/types';
import { LocArea, LocText, PageTitle, Panel, Text, Toggle } from '../../../_components/Fields';
import MediaPicker, { MediaMultiPicker } from '../../../_components/MediaPicker';
import SaveBar from '../../../_components/SaveBar';
import { move, slugify, useEditor } from '../../../_components/useEditor';
import { saveProject } from '../../../_actions/content';

export default function ProjectEditor({
  base,
  project,
  media,
  isNew,
  siteUrl,
}: {
  base: string;
  project: Project;
  media: MediaItem[];
  isNew: boolean;
  siteUrl: string;
}) {
  const router = useRouter();

  const editor = useEditor(project, async (value) => {
    const result = await saveProject(value);
    if (result.ok && isNew) router.replace(`${base}/progetti/${value.id}`);
    else if (result.ok) router.refresh();
    return result;
  });

  const p = editor.value;
  const set = editor.patch;

  const slug = p.slug || slugify(p.client);

  return (
    <>
      <PageTitle
        title={isNew ? 'Nuovo progetto' : p.client || 'Progetto'}
        description={
          isNew
            ? 'Compila almeno cliente, titolo e descrizione, poi metti online quando sei pronto.'
            : `Indirizzo pubblico: ${siteUrl}/it/lavori/${slug}`
        }
        action={
          <div className="flex gap-2">
            <Link href={`${base}/progetti`} className="admin-btn admin-btn-ghost">
              ← Elenco
            </Link>
            {!isNew && p.published && (
              <a
                href={`/it/lavori/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-ghost"
              >
                Vedi ↗
              </a>
            )}
          </div>
        }
      />

      {/* -------------------------------------------------- Scheda */}
      <Panel
        title="Scheda"
        description="Le informazioni che compaiono nell'elenco dei lavori e in cima alla pagina."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Text
            label="Cliente"
            value={p.client}
            onChange={(client) =>
              set({ client, slug: p.slug || slugify(client) })
            }
            placeholder="Hotel Alpenblick"
          />
          <Text
            label="Indirizzo della pagina"
            value={p.slug}
            onChange={(value) => set({ slug: slugify(value) })}
            placeholder="hotel-alpenblick"
            mono
            hint={`/it/lavori/${slug || '…'}`}
          />
          <Text
            label="Anno"
            value={p.year}
            onChange={(year) => set({ year })}
            placeholder="2026"
          />
          <div>
            <span className="admin-label">Colore del progetto</span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={p.accent}
                onChange={(e) => set({ accent: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded-lg border border-zinc-300 bg-white p-1"
              />
              <input
                value={p.accent}
                onChange={(e) => set({ accent: e.target.value })}
                className="admin-input font-mono text-[0.82rem]"
              />
            </div>
            <p className="mt-1.5 text-[0.72rem] text-zinc-500">
              Usato per la copertina astratta quando non carichi una foto.
            </p>
          </div>
        </div>

        <LocText
          label="Titolo del progetto"
          value={p.title}
          onChange={(title) => set({ title })}
          placeholder="Un sito che riempie le camere in bassa stagione"
          hint="Il risultato ottenuto, non il tipo di lavoro. È il titolo H1 della pagina."
          counter={{ ideal: 65, max: 90 }}
        />

        <LocText
          label="Settore"
          value={p.sector}
          onChange={(sector) => set({ sector })}
          placeholder="Ospitalità"
        />

        <LocArea
          label="Riassunto"
          value={p.excerpt}
          onChange={(excerpt) => set({ excerpt })}
          rows={2}
          placeholder="Sito bilingue con prenotazione diretta."
          hint="Una riga, mostrata nell'elenco dei lavori e usata come descrizione per Google."
          counter={{ ideal: 155, max: 170 }}
        />
      </Panel>

      {/* -------------------------------------------------- Immagini */}
      <Panel title="Immagini" description="Se non carichi nulla viene disegnata una copertina con il colore del progetto.">
        <MediaPicker
          label="Copertina"
          value={p.cover}
          media={media}
          onChange={(cover) => set({ cover })}
          hint="Formato orizzontale, almeno 1600 px di larghezza. JPG o WebP."
        />
        <MediaMultiPicker
          label="Altre immagini"
          values={p.gallery}
          media={media}
          onChange={(gallery) => set({ gallery })}
          hint="Mostrate nella pagina del progetto, sotto il racconto."
        />
      </Panel>

      {/* -------------------------------------------------- Racconto */}
      <Panel title="Il racconto" description="Due blocchi: da dove si partiva e cosa avete fatto.">
        <LocArea
          label="La situazione"
          value={p.challenge}
          onChange={(challenge) => set({ challenge })}
          rows={4}
          placeholder="Il 90% delle prenotazioni arrivava dai portali…"
        />
        <LocArea
          label="Cosa abbiamo fatto"
          value={p.solution}
          onChange={(solution) => set({ solution })}
          rows={4}
          placeholder="Sito nuovo in italiano e tedesco, motore di prenotazione…"
        />
      </Panel>

      {/* -------------------------------------------------- Servizi */}
      <Panel
        title="Servizi coinvolti"
        description="Le etichette mostrate sotto il progetto."
        aside={
          <button
            type="button"
            onClick={() => set({ services: [...p.services, { it: '' }] })}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            + Aggiungi
          </button>
        }
      >
        {p.services.length === 0 && (
          <p className="text-[0.82rem] text-zinc-500">Nessun servizio indicato.</p>
        )}
        {p.services.map((service, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-1">
              <LocText
                label={`Servizio ${index + 1}`}
                value={service}
                onChange={(value) =>
                  set({ services: p.services.map((s, i) => (i === index ? value : s)) })
                }
                placeholder="Sito web"
              />
            </div>
            <button
              type="button"
              onClick={() => set({ services: p.services.filter((_, i) => i !== index) })}
              className="admin-btn admin-btn-danger admin-btn-sm mt-6"
            >
              Togli
            </button>
          </div>
        ))}
      </Panel>

      {/* -------------------------------------------------- Risultati */}
      <Panel
        title="Risultati"
        description="I numeri in fondo alla pagina. Tre funzionano bene; lascia vuoto per non mostrarne."
        aside={
          <button
            type="button"
            onClick={() => set({ results: [...p.results, { value: '', label: { it: '' } }] })}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            + Aggiungi
          </button>
        }
      >
        {p.results.map((result, index) => (
          <div key={index} className="rounded-xl border border-zinc-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[0.7rem] tracking-[0.12em] text-zinc-400 uppercase">
                Risultato {index + 1}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => set({ results: move(p.results, index, -1) })}
                  disabled={index === 0}
                  className="px-1.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-25"
                  aria-label="Su"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => set({ results: move(p.results, index, 1) })}
                  disabled={index === p.results.length - 1}
                  className="px-1.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-25"
                  aria-label="Giù"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => set({ results: p.results.filter((_, i) => i !== index) })}
                  className="admin-btn admin-btn-danger admin-btn-sm ml-2"
                >
                  Togli
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
              <Text
                label="Numero"
                value={result.value}
                onChange={(value) =>
                  set({
                    results: p.results.map((r, i) => (i === index ? { ...r, value } : r)),
                  })
                }
                placeholder="+64%"
              />
              <LocText
                label="Cosa misura"
                value={result.label}
                onChange={(label) =>
                  set({
                    results: p.results.map((r, i) => (i === index ? { ...r, label } : r)),
                  })
                }
                placeholder="prenotazioni dirette"
              />
            </div>
          </div>
        ))}
      </Panel>

      {/* -------------------------------------------------- Pubblicazione */}
      <Panel title="Pubblicazione">
        <Text
          label="Sito del cliente"
          value={p.liveUrl ?? ''}
          onChange={(liveUrl) => set({ liveUrl })}
          placeholder="https://www.hotelalpenblick.it"
          hint="Facoltativo. Se compilato compare un link alla fine della pagina."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Toggle
            label="Online"
            checked={p.published}
            onChange={(published) => set({ published })}
            hint="Se spento il progetto non esiste per i visitatori né per Google."
          />
          <Toggle
            label="In evidenza nella home"
            checked={p.featured}
            onChange={(featured) => set({ featured })}
            hint="Appare nella galleria orizzontale della pagina iniziale."
          />
        </div>
      </Panel>

      <SaveBar
        dirty={editor.dirty || isNew}
        state={editor.state}
        error={editor.error}
        onSave={editor.save}
        onReset={isNew ? undefined : editor.reset}
      />
    </>
  );
}
