'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { Project } from '@/lib/data/types';
import { PageTitle } from '../../_components/Fields';
import SaveBar from '../../_components/SaveBar';
import { useEditor, move, reorder } from '../../_components/useEditor';
import { deleteProject, duplicateProject, saveProjectList } from '../../_actions/content';

export default function ProjectsList({ base, projects }: { base: string; projects: Project[] }) {
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);

  const editor = useEditor(projects, (list) =>
    saveProjectList(
      list.map((p, index) => ({
        id: p.id,
        order: index,
        published: p.published,
        featured: p.featured,
      }))
    )
  );

  const list = editor.value;

  const update = (id: string, patch: Partial<Project>) =>
    editor.setValue(list.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const shift = (index: number, direction: -1 | 1) =>
    editor.setValue(reorder(move(list, index, direction)));

  const onDelete = (project: Project) => {
    const ok = window.confirm(
      `Eliminare definitivamente "${project.client} — ${project.title.it}"?\n\nLa pagina del progetto sparirà dal sito. L'operazione non si annulla, ma una copia dei contenuti resta in data/backups.`
    );
    if (!ok) return;

    setNotice(null);
    startTransition(async () => {
      const result = await deleteProject(project.id);
      if (!result.ok) setNotice(result.error ?? 'Eliminazione non riuscita.');
      else router.refresh();
    });
  };

  const onDuplicate = (project: Project) => {
    setNotice(null);
    startTransition(async () => {
      const result = await duplicateProject(project.id);
      if (!result.ok) setNotice(result.error ?? 'Copia non riuscita.');
      else router.refresh();
    });
  };

  return (
    <>
      <PageTitle
        title="Progetti"
        description="Ordine, pubblicazione ed evidenza si cambiano da qui. Per i testi apri il progetto."
        action={
          <Link href={`${base}/progetti/nuovo`} className="admin-btn admin-btn-primary">
            + Nuovo progetto
          </Link>
        }
      />

      {notice && (
        <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.82rem] text-red-700">
          {notice}
        </p>
      )}

      {list.length === 0 ? (
        <div className="admin-card p-10 text-center">
          <p className="text-sm text-zinc-500">
            Nessun progetto. Creane uno con il pulsante qui sopra.
          </p>
        </div>
      ) : (
        <div className="admin-card divide-y divide-zinc-200">
          {list.map((project, index) => {
            const missingDe = !project.title.de?.trim();
            return (
              <div
                key={project.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4 md:flex-nowrap"
              >
                {/* Ordine */}
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    onClick={() => shift(index, -1)}
                    disabled={index === 0}
                    aria-label="Sposta su"
                    className="px-1.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-25"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => shift(index, 1)}
                    disabled={index === list.length - 1}
                    aria-label="Sposta giù"
                    className="px-1.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-25"
                  >
                    ▼
                  </button>
                </div>

                {/* Anteprima */}
                <div
                  className="h-11 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-200"
                  style={{ background: project.accent }}
                >
                  {project.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.cover}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Testo */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`${base}/progetti/${project.id}`}
                    className="block truncate text-[0.95rem] font-medium hover:text-[#2f6bff]"
                  >
                    {project.client || 'Senza cliente'}
                  </Link>
                  <p className="truncate text-[0.8rem] text-zinc-500">
                    {project.title.it || 'Senza titolo'}
                  </p>
                  <p className="mt-1 font-mono text-[0.68rem] text-zinc-400">/{project.slug}</p>
                </div>

                {/* Stato */}
                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  {missingDe && <span className="admin-chip admin-chip-warn">manca DE</span>}
                  {!project.cover && <span className="admin-chip admin-chip-off">senza foto</span>}
                  <span className="admin-chip admin-chip-off">{project.year}</span>
                </div>

                {/* Interruttori */}
                <div className="flex shrink-0 items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-1.5 text-[0.78rem] text-zinc-600">
                    <input
                      type="checkbox"
                      checked={project.published}
                      onChange={(e) => update(project.id, { published: e.target.checked })}
                      className="h-3.5 w-3.5 accent-[#2f6bff]"
                    />
                    online
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5 text-[0.78rem] text-zinc-600">
                    <input
                      type="checkbox"
                      checked={project.featured}
                      onChange={(e) => update(project.id, { featured: e.target.checked })}
                      className="h-3.5 w-3.5 accent-[#2f6bff]"
                    />
                    in home
                  </label>
                </div>

                {/* Azioni */}
                <div className="flex shrink-0 gap-1.5">
                  <Link
                    href={`${base}/progetti/${project.id}`}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                  >
                    Apri
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDuplicate(project)}
                    disabled={busy}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                  >
                    Duplica
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(project)}
                    disabled={busy}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-5 text-[0.76rem] leading-relaxed text-zinc-500">
        <strong>in home</strong> decide quali progetti entrano nella galleria orizzontale della
        pagina iniziale (ne bastano quattro o cinque). <strong>online</strong> decide se il progetto
        esiste sul sito: toglilo e sparisce anche dalla sitemap.
      </p>

      <SaveBar
        dirty={editor.dirty}
        state={editor.state}
        error={editor.error}
        onSave={editor.save}
        onReset={editor.reset}
      />
    </>
  );
}
