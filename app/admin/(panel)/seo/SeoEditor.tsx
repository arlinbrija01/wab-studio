'use client';

import type { MediaItem, Seo, SeoPageKey } from '@/lib/data/types';
import { LocArea, LocText, PageTitle, Panel, Text, Toggle } from '../../_components/Fields';
import MediaPicker from '../../_components/MediaPicker';
import SaveBar from '../../_components/SaveBar';
import { useEditor } from '../../_components/useEditor';
import { saveSeo } from '../../_actions/content';

const pages: { key: SeoPageKey; label: string; url: string }[] = [
  { key: 'home', label: 'Home', url: '/it' },
  { key: 'services', label: 'Servizi', url: '/it/servizi' },
  { key: 'work', label: 'Lavori', url: '/it/lavori' },
  { key: 'studio', label: 'Studio', url: '/it/studio' },
  { key: 'contact', label: 'Contatti', url: '/it/contatti' },
];

export default function SeoEditor({
  seo,
  media,
  siteUrl,
}: {
  seo: Seo;
  media: MediaItem[];
  siteUrl: string;
}) {
  const editor = useEditor(seo, saveSeo);
  const v = editor.value;
  const set = editor.patch;

  const setPage = (key: SeoPageKey, patch: Partial<Seo['pages'][SeoPageKey]>) =>
    set({ pages: { ...v.pages, [key]: { ...v.pages[key], ...patch } } });

  return (
    <>
      <PageTitle
        title="SEO"
        description="Titoli e descrizioni mostrati nei risultati di ricerca e nelle anteprime social."
      />

      {pages.map((page) => {
        const value = v.pages[page.key];
        return (
          <Panel
            key={page.key}
            title={page.label}
            description={`${siteUrl}${page.url}`}
            aside={
              value.noindex ? (
                <span className="admin-chip admin-chip-warn">esclusa da Google</span>
              ) : null
            }
          >
            <LocText
              label="Titolo nei risultati"
              value={value.title}
              onChange={(title) => setPage(page.key, { title })}
              counter={{ ideal: 60, max: 70 }}
              hint="Oltre i 60 caratteri Google taglia. Metta davanti la parola che conta."
            />
            <LocArea
              label="Descrizione"
              value={value.description}
              onChange={(description) => setPage(page.key, { description })}
              rows={3}
              counter={{ ideal: 155, max: 170 }}
              hint="Non è un fattore di posizionamento, ma decide quante persone cliccano."
            />

            <Preview
              title={value.title.it}
              description={value.description.it}
              url={`${siteUrl}${page.url}`}
            />

            <MediaPicker
              label="Anteprima social"
              value={value.ogImage}
              media={media}
              onChange={(ogImage) => setPage(page.key, { ogImage })}
              hint="1200×630 px. Se la lasci vuota viene generata automaticamente dal titolo."
            />

            <Toggle
              label="Escludi questa pagina dai motori di ricerca"
              checked={Boolean(value.noindex)}
              onChange={(noindex) => setPage(page.key, { noindex })}
              hint="Da usare solo per pagine che non devono essere trovate."
            />
          </Panel>
        );
      })}

      <Panel
        title="Impostazioni generali"
        description="Valori usati quando una pagina non ha i suoi."
      >
        <LocText
          label="Titolo predefinito"
          value={v.defaultTitle}
          onChange={(defaultTitle) => set({ defaultTitle })}
          counter={{ ideal: 60, max: 70 }}
        />
        <LocArea
          label="Descrizione predefinita"
          value={v.defaultDescription}
          onChange={(defaultDescription) => set({ defaultDescription })}
          rows={2}
          counter={{ ideal: 155, max: 170 }}
        />
        <LocText
          label="Parole chiave"
          value={v.keywords}
          onChange={(keywords) => set({ keywords })}
          hint="Separate da virgola. Google le ignora da anni, ma restano utili come promemoria."
        />
        <MediaPicker
          label="Anteprima social predefinita"
          value={v.ogImage}
          media={media}
          onChange={(ogImage) => set({ ogImage })}
          hint="1200×630 px."
        />
      </Panel>

      <Panel title="Verifica e statistiche">
        <Text
          label="Codice di verifica Google Search Console"
          value={v.googleVerification ?? ''}
          onChange={(googleVerification) => set({ googleVerification })}
          mono
          placeholder="abc123..."
          hint="Solo il valore del meta tag google-site-verification, non il tag intero."
        />
        <Text
          label="ID Google Analytics"
          value={v.analyticsId ?? ''}
          onChange={(analyticsId) => set({ analyticsId })}
          mono
          placeholder="G-XXXXXXXXXX"
          hint="Lascia vuoto per non caricare alcuno script di tracciamento. Se lo attivi serve un banner cookie."
        />
      </Panel>

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

/** Come apparirà il risultato su Google. */
function Preview({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  const cut = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="mb-2.5 font-mono text-[0.65rem] tracking-[0.12em] text-zinc-400 uppercase">
        Anteprima
      </p>
      <p className="text-[0.75rem] text-zinc-600">{url.replace(/^https?:\/\//, '')}</p>
      <p className="mt-0.5 text-[1.05rem] leading-snug text-[#1a0dab]">
        {cut(title || 'Titolo mancante', 60)}
      </p>
      <p className="mt-1 text-[0.82rem] leading-relaxed text-zinc-600">
        {cut(description || 'Descrizione mancante', 160)}
      </p>
    </div>
  );
}
