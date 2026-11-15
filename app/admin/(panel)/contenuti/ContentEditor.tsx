'use client';

import { useState } from 'react';
import type {
  FaqItem,
  HomeContent,
  L,
  ProcessStep,
  Service,
  Stat,
  StudioContent,
  Testimonial,
} from '@/lib/data/types';
import { LocArea, LocText, PageTitle, Panel, Text, Toggle } from '../../_components/Fields';
import SaveBar from '../../_components/SaveBar';
import { move, newId, slugify, useEditor } from '../../_components/useEditor';
import { saveContentBundle, type ContentBundle } from '../../_actions/content';

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'servizi', label: 'Servizi' },
  { id: 'metodo', label: 'Metodo' },
  { id: 'numeri', label: 'Numeri' },
  { id: 'voci', label: 'Testimonianze' },
  { id: 'faq', label: 'FAQ' },
  { id: 'studio', label: 'Studio' },
  { id: 'chiusure', label: 'Chiusure' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function ContentEditor(initial: {
  home: HomeContent;
  studio: StudioContent;
  closings: ContentBundle['closings'];
  services: Service[];
  process: ProcessStep[];
  stats: Stat[];
  stack: string[];
  testimonials: Testimonial[];
  faq: FaqItem[];
}) {
  const [tab, setTab] = useState<TabId>('home');
  const editor = useEditor<ContentBundle>(initial, saveContentBundle);
  const v = editor.value;
  const set = editor.patch;

  /* Scorciatoie per modificare una delle liste dentro il pacchetto */
  type ListKey = 'services' | 'process' | 'stats' | 'testimonials' | 'faq';

  function listOps<K extends ListKey>(key: K) {
    type Item = ContentBundle[K][number];
    const list = v[key] as Item[];
    const write = (next: Item[]) => set({ [key]: next } as unknown as Partial<ContentBundle>);

    return {
      list,
      update: (index: number, patch: Partial<Item>) =>
        write(list.map((item, i) => (i === index ? { ...item, ...patch } : item))),
      remove: (index: number) => write(list.filter((_, i) => i !== index)),
      shift: (index: number, direction: -1 | 1) => write(move(list, index, direction)),
      add: (item: Item) => write([...list, item]),
    };
  }

  return (
    <>
      <PageTitle
        title="Contenuti"
        description="Tutti i testi del sito. Il tedesco lasciato vuoto viene sostituito dall'italiano."
      />

      {/* Linguette */}
      <div className="mb-7 flex flex-wrap gap-1.5">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-3.5 py-1.5 text-[0.82rem] transition-colors ${
              tab === item.id
                ? 'bg-zinc-900 text-white'
                : 'border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-900 hover:text-zinc-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------------- HOME */}
      {tab === 'home' && (
        <>
          <Panel title="Titolo di apertura" description="Le righe grandi della prima schermata, una per riga.">
            <LocText
              label="Occhiello"
              value={v.home.hero.eyebrow}
              onChange={(eyebrow) =>
                set({ home: { ...v.home, hero: { ...v.home.hero, eyebrow } } })
              }
              placeholder="Studio digitale"
            />

            {v.home.hero.titleLines.map((line, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1">
                  <LocText
                    label={`Riga ${index + 1}`}
                    value={line}
                    onChange={(value) =>
                      set({
                        home: {
                          ...v.home,
                          hero: {
                            ...v.home.hero,
                            titleLines: v.home.hero.titleLines.map((l, i) =>
                              i === index ? value : l
                            ),
                          },
                        },
                      })
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    set({
                      home: {
                        ...v.home,
                        hero: {
                          ...v.home.hero,
                          titleLines: v.home.hero.titleLines.filter((_, i) => i !== index),
                        },
                      },
                    })
                  }
                  className="admin-btn admin-btn-danger admin-btn-sm mt-6"
                >
                  Togli
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                set({
                  home: {
                    ...v.home,
                    hero: { ...v.home.hero, titleLines: [...v.home.hero.titleLines, { it: '' }] },
                  },
                })
              }
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              + Aggiungi riga
            </button>

            <LocArea
              label="Testo sotto il titolo"
              value={v.home.hero.lead}
              onChange={(lead) => set({ home: { ...v.home, hero: { ...v.home.hero, lead } } })}
              rows={3}
              counter={{ ideal: 180, max: 240 }}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <LocText
                label="Pulsante principale"
                value={v.home.hero.ctaPrimary}
                onChange={(ctaPrimary) =>
                  set({ home: { ...v.home, hero: { ...v.home.hero, ctaPrimary } } })
                }
              />
              <LocText
                label="Pulsante secondario"
                value={v.home.hero.ctaSecondary}
                onChange={(ctaSecondary) =>
                  set({ home: { ...v.home, hero: { ...v.home.hero, ctaSecondary } } })
                }
              />
            </div>
          </Panel>

          <Panel
            title="Nastro scorrevole"
            description="Le parole che scorrono in fondo alla prima schermata."
            aside={
              <button
                type="button"
                onClick={() =>
                  set({
                    home: {
                      ...v.home,
                      hero: { ...v.home.hero, marquee: [...v.home.hero.marquee, { it: '' }] },
                    },
                  })
                }
                className="admin-btn admin-btn-ghost admin-btn-sm"
              >
                + Aggiungi
              </button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {v.home.hero.marquee.map((word, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={word.it}
                    onChange={(e) =>
                      set({
                        home: {
                          ...v.home,
                          hero: {
                            ...v.home.hero,
                            marquee: v.home.hero.marquee.map((w, i) =>
                              i === index ? { ...w, it: e.target.value } : w
                            ),
                          },
                        },
                      })
                    }
                    className="admin-input"
                    placeholder="Siti web"
                  />
                  <input
                    value={word.de ?? ''}
                    onChange={(e) =>
                      set({
                        home: {
                          ...v.home,
                          hero: {
                            ...v.home.hero,
                            marquee: v.home.hero.marquee.map((w, i) =>
                              i === index ? { ...w, de: e.target.value } : w
                            ),
                          },
                        },
                      })
                    }
                    className="admin-input"
                    placeholder="DE"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set({
                        home: {
                          ...v.home,
                          hero: {
                            ...v.home.hero,
                            marquee: v.home.hero.marquee.filter((_, i) => i !== index),
                          },
                        },
                      })
                    }
                    aria-label="Togli"
                    className="shrink-0 px-2 text-zinc-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Manifesto" description="Il blocco bianco che si accende parola per parola.">
            <LocText
              label="Occhiello"
              value={v.home.manifesto.eyebrow}
              onChange={(eyebrow) =>
                set({ home: { ...v.home, manifesto: { ...v.home.manifesto, eyebrow } } })
              }
            />
            <LocArea
              label="Testo"
              value={v.home.manifesto.text}
              onChange={(value) =>
                set({ home: { ...v.home, manifesto: { ...v.home.manifesto, text: value } } })
              }
              rows={5}
              hint="Funziona meglio fra le 40 e le 70 parole: è pensato per essere letto scorrendo."
            />
          </Panel>

          <Panel title="Sezioni della home" description="Spegni quello che per ora non vuoi mostrare.">
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ['manifesto', 'Manifesto'],
                  ['services', 'Servizi'],
                  ['work', 'Lavori'],
                  ['process', 'Metodo'],
                  ['stats', 'Numeri e tecnologie'],
                  ['testimonials', 'Testimonianze'],
                  ['faq', 'Domande frequenti'],
                ] as const
              ).map(([key, label]) => (
                <Toggle
                  key={key}
                  label={label}
                  checked={v.home.show[key]}
                  onChange={(checked) =>
                    set({ home: { ...v.home, show: { ...v.home.show, [key]: checked } } })
                  }
                />
              ))}
            </div>
          </Panel>
        </>
      )}

      {/* ------------------------------------------------------ SERVIZI */}
      {tab === 'servizi' && (
        <ListSection
          title="Servizi"
          description="Mostrati in home come elenco e nella pagina Servizi come schede."
          onAdd={() =>
            listOps('services').add({
              id: newId('srv'),
              slug: '',
              num: String(v.services.length + 1).padStart(2, '0'),
              title: { it: '' },
              short: { it: '' },
              desc: { it: '' },
              bullets: [{ it: '' }],
              order: v.services.length,
              published: true,
            })
          }
          items={v.services}
          label={(item) => item.title.it || 'Nuovo servizio'}
          ops={listOps('services')}
          render={(service, index, ops) => (
            <>
              <div className="grid gap-5 sm:grid-cols-[7rem_1fr]">
                <Text
                  label="Numero"
                  value={service.num}
                  onChange={(num) => ops.update(index, { num })}
                  mono
                />
                <Text
                  label="Indirizzo (ancora)"
                  value={service.slug}
                  onChange={(slug) => ops.update(index, { slug: slugify(slug) })}
                  mono
                  hint="Usato nei link: /it/servizi#seo"
                />
              </div>
              <LocText
                label="Titolo"
                value={service.title}
                onChange={(title) => ops.update(index, { title })}
              />
              <LocText
                label="Riga di sintesi"
                value={service.short}
                onChange={(short) => ops.update(index, { short })}
                hint="Una frase breve, mostrata accanto al titolo nell'elenco."
              />
              <LocArea
                label="Descrizione"
                value={service.desc}
                onChange={(desc) => ops.update(index, { desc })}
                rows={3}
              />
              <BulletList
                bullets={service.bullets}
                onChange={(bullets) => ops.update(index, { bullets })}
              />
              <Toggle
                label="Mostra sul sito"
                checked={service.published}
                onChange={(published) => ops.update(index, { published })}
              />
            </>
          )}
        />
      )}

      {/* ------------------------------------------------------- METODO */}
      {tab === 'metodo' && (
        <ListSection
          title="Metodo"
          description="I passi mostrati come schede che si impilano."
          onAdd={() =>
            listOps('process').add({
              id: newId('step'),
              num: String(v.process.length + 1).padStart(2, '0'),
              title: { it: '' },
              desc: { it: '' },
              order: v.process.length,
            })
          }
          items={v.process}
          label={(item) => item.title.it || 'Nuovo passo'}
          ops={listOps('process')}
          render={(step, index, ops) => (
            <>
              <Text
                label="Numero"
                value={step.num}
                onChange={(num) => ops.update(index, { num })}
                mono
              />
              <LocText
                label="Titolo"
                value={step.title}
                onChange={(title) => ops.update(index, { title })}
              />
              <LocArea
                label="Descrizione"
                value={step.desc}
                onChange={(desc) => ops.update(index, { desc })}
                rows={3}
              />
            </>
          )}
        />
      )}

      {/* ------------------------------------------------------- NUMERI */}
      {tab === 'numeri' && (
        <>
          <ListSection
            title="Numeri"
            description="I contatori che salgono quando entrano nella schermata."
            onAdd={() =>
              listOps('stats').add({
                id: newId('stat'),
                value: 0,
                suffix: '',
                decimals: 0,
                label: { it: '' },
                order: v.stats.length,
              })
            }
            items={v.stats}
            label={(item) => `${item.value}${item.suffix} — ${item.label.it || '…'}`}
            ops={listOps('stats')}
            render={(stat, index, ops) => (
              <>
                <div className="grid gap-5 sm:grid-cols-3">
                  <Text
                    label="Valore"
                    type="number"
                    value={String(stat.value)}
                    onChange={(value) => ops.update(index, { value: Number(value) })}
                  />
                  <Text
                    label="Suffisso"
                    value={stat.suffix}
                    onChange={(suffix) => ops.update(index, { suffix })}
                    placeholder="%  +  s"
                  />
                  <Text
                    label="Decimali"
                    type="number"
                    value={String(stat.decimals)}
                    onChange={(decimals) => ops.update(index, { decimals: Number(decimals) })}
                  />
                </div>
                <LocText
                  label="Didascalia"
                  value={stat.label}
                  onChange={(label) => ops.update(index, { label })}
                />
              </>
            )}
          />

          <Panel
            title="Tecnologie"
            description="Il nastro scorrevole sotto i numeri. Un nome per riga."
          >
            <textarea
              rows={6}
              value={v.stack.join('\n')}
              onChange={(e) => set({ stack: e.target.value.split('\n') })}
              className="admin-input font-mono text-[0.82rem]"
            />
          </Panel>
        </>
      )}

      {/* -------------------------------------------------------- VOCI */}
      {tab === 'voci' && (
        <ListSection
          title="Testimonianze"
          description="Scrivile come le ha dette il cliente: le frasi lucidate si riconoscono."
          onAdd={() =>
            listOps('testimonials').add({
              id: newId('tst'),
              quote: { it: '' },
              author: '',
              role: { it: '' },
              order: v.testimonials.length,
              published: true,
            })
          }
          items={v.testimonials}
          label={(item) => item.author || 'Nuova testimonianza'}
          ops={listOps('testimonials')}
          render={(item, index, ops) => (
            <>
              <LocArea
                label="Frase"
                value={item.quote}
                onChange={(quote) => ops.update(index, { quote })}
                rows={3}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Text
                  label="Nome"
                  value={item.author}
                  onChange={(author) => ops.update(index, { author })}
                />
                <LocText
                  label="Ruolo e azienda"
                  value={item.role}
                  onChange={(role) => ops.update(index, { role })}
                />
              </div>
              <Toggle
                label="Mostra sul sito"
                checked={item.published}
                onChange={(published) => ops.update(index, { published })}
              />
            </>
          )}
        />
      )}

      {/* --------------------------------------------------------- FAQ */}
      {tab === 'faq' && (
        <ListSection
          title="Domande frequenti"
          description="Finiscono anche nei dati strutturati: Google può mostrarle sotto il risultato."
          onAdd={() =>
            listOps('faq').add({
              id: newId('faq'),
              q: { it: '' },
              a: { it: '' },
              order: v.faq.length,
              published: true,
            })
          }
          items={v.faq}
          label={(item) => item.q.it || 'Nuova domanda'}
          ops={listOps('faq')}
          render={(item, index, ops) => (
            <>
              <LocText
                label="Domanda"
                value={item.q}
                onChange={(q) => ops.update(index, { q })}
              />
              <LocArea
                label="Risposta"
                value={item.a}
                onChange={(a) => ops.update(index, { a })}
                rows={4}
              />
              <Toggle
                label="Mostra sul sito"
                checked={item.published}
                onChange={(published) => ops.update(index, { published })}
              />
            </>
          )}
        />
      )}

      {/* ------------------------------------------------------- STUDIO */}
      {tab === 'studio' && (
        <>
          <Panel title="Pagina Studio">
            <LocText
              label="Titolo"
              value={v.studio.title}
              onChange={(title) => set({ studio: { ...v.studio, title } })}
            />
            <LocArea
              label="Introduzione"
              value={v.studio.lead}
              onChange={(lead) => set({ studio: { ...v.studio, lead } })}
              rows={3}
            />

            {v.studio.body.map((paragraph, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1">
                  <LocArea
                    label={`Paragrafo ${index + 1}`}
                    value={paragraph}
                    onChange={(value) =>
                      set({
                        studio: {
                          ...v.studio,
                          body: v.studio.body.map((b, i) => (i === index ? value : b)),
                        },
                      })
                    }
                    rows={4}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    set({
                      studio: { ...v.studio, body: v.studio.body.filter((_, i) => i !== index) },
                    })
                  }
                  className="admin-btn admin-btn-danger admin-btn-sm mt-6"
                >
                  Togli
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => set({ studio: { ...v.studio, body: [...v.studio.body, { it: '' }] } })}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              + Aggiungi paragrafo
            </button>
          </Panel>

          <Panel
            title="Valori"
            description="I tre punti fermi mostrati sotto il racconto."
            aside={
              <button
                type="button"
                onClick={() =>
                  set({
                    studio: {
                      ...v.studio,
                      values: [...v.studio.values, { title: { it: '' }, desc: { it: '' } }],
                    },
                  })
                }
                className="admin-btn admin-btn-ghost admin-btn-sm"
              >
                + Aggiungi
              </button>
            }
          >
            {v.studio.values.map((value, index) => (
              <div key={index} className="space-y-4 rounded-xl border border-zinc-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.7rem] tracking-[0.12em] text-zinc-400 uppercase">
                    Valore {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      set({
                        studio: {
                          ...v.studio,
                          values: v.studio.values.filter((_, i) => i !== index),
                        },
                      })
                    }
                    className="admin-btn admin-btn-danger admin-btn-sm"
                  >
                    Togli
                  </button>
                </div>
                <LocText
                  label="Titolo"
                  value={value.title}
                  onChange={(title) =>
                    set({
                      studio: {
                        ...v.studio,
                        values: v.studio.values.map((x, i) => (i === index ? { ...x, title } : x)),
                      },
                    })
                  }
                />
                <LocArea
                  label="Descrizione"
                  value={value.desc}
                  onChange={(desc) =>
                    set({
                      studio: {
                        ...v.studio,
                        values: v.studio.values.map((x, i) => (i === index ? { ...x, desc } : x)),
                      },
                    })
                  }
                  rows={3}
                />
              </div>
            ))}
          </Panel>
        </>
      )}

      {/* ----------------------------------------------------- CHIUSURE */}
      {tab === 'chiusure' && (
        <>
          <Panel title="Invito al contatto" description="Il blocco scuro che chiude quasi tutte le pagine.">
            <LocText
              label="Titolo"
              value={v.closings.cta.title}
              onChange={(title) =>
                set({ closings: { ...v.closings, cta: { ...v.closings.cta, title } } })
              }
            />
            <LocArea
              label="Testo"
              value={v.closings.cta.lead}
              onChange={(lead) =>
                set({ closings: { ...v.closings, cta: { ...v.closings.cta, lead } } })
              }
              rows={2}
            />
            <LocText
              label="Pulsante"
              value={v.closings.cta.button}
              onChange={(button) =>
                set({ closings: { ...v.closings, cta: { ...v.closings.cta, button } } })
              }
            />
          </Panel>

          <Panel title="Pagina Contatti">
            <LocText
              label="Titolo"
              value={v.closings.contact.title}
              onChange={(title) =>
                set({ closings: { ...v.closings, contact: { ...v.closings.contact, title } } })
              }
            />
            <LocArea
              label="Introduzione"
              value={v.closings.contact.lead}
              onChange={(lead) =>
                set({ closings: { ...v.closings, contact: { ...v.closings.contact, lead } } })
              }
              rows={2}
            />
          </Panel>

          <Panel title="Piè di pagina">
            <LocArea
              label="Frase sotto il marchio"
              value={v.closings.footerTagline}
              onChange={(footerTagline) => set({ closings: { ...v.closings, footerTagline } })}
              rows={2}
            />
          </Panel>
        </>
      )}

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

/* ------------------------------------------------------------------ */
/* Pezzi riusati                                                       */
/* ------------------------------------------------------------------ */

function BulletList({
  bullets,
  onChange,
}: {
  bullets: L[];
  onChange: (bullets: L[]) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="admin-label">Punti elenco</span>
        <button
          type="button"
          onClick={() => onChange([...bullets, { it: '' }])}
          className="admin-btn admin-btn-ghost admin-btn-sm mb-1.5"
        >
          + Aggiungi
        </button>
      </div>
      <div className="space-y-2">
        {bullets.map((bullet, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={bullet.it}
              onChange={(e) =>
                onChange(bullets.map((b, i) => (i === index ? { ...b, it: e.target.value } : b)))
              }
              className="admin-input"
              placeholder="Italiano"
            />
            <input
              value={bullet.de ?? ''}
              onChange={(e) =>
                onChange(bullets.map((b, i) => (i === index ? { ...b, de: e.target.value } : b)))
              }
              className="admin-input"
              placeholder="Deutsch"
            />
            <button
              type="button"
              onClick={() => onChange(bullets.filter((_, i) => i !== index))}
              aria-label="Togli"
              className="shrink-0 px-2 text-zinc-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Ops<T> {
  update: (index: number, patch: Partial<T>) => void;
  remove: (index: number) => void;
  shift: (index: number, direction: -1 | 1) => void;
}

function ListSection<T>({
  title,
  description,
  items,
  label,
  ops,
  render,
  onAdd,
}: {
  title: string;
  description?: string;
  items: T[];
  label: (item: T) => string;
  ops: Ops<T>;
  render: (item: T, index: number, ops: Ops<T>) => React.ReactNode;
  onAdd: () => void;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Panel
      title={title}
      description={description}
      aside={
        <button type="button" onClick={onAdd} className="admin-btn admin-btn-ghost admin-btn-sm">
          + Aggiungi
        </button>
      }
    >
      {items.length === 0 && <p className="text-[0.82rem] text-zinc-500">Ancora niente.</p>}

      {items.map((item, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-zinc-200">
          <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2">
            <button
              type="button"
              onClick={() => setOpen(open === index ? null : index)}
              className="flex-1 truncate text-left text-[0.86rem] font-medium"
            >
              <span className="mr-2 text-zinc-400">{open === index ? '▾' : '▸'}</span>
              {label(item)}
            </button>

            <button
              type="button"
              onClick={() => ops.shift(index, -1)}
              disabled={index === 0}
              aria-label="Su"
              className="px-1.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-25"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => ops.shift(index, 1)}
              disabled={index === items.length - 1}
              aria-label="Giù"
              className="px-1.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-25"
            >
              ▼
            </button>
            <button
              type="button"
              onClick={() => ops.remove(index)}
              className="admin-btn admin-btn-danger admin-btn-sm"
            >
              Togli
            </button>
          </div>

          {open === index && <div className="space-y-5 p-4">{render(item, index, ops)}</div>}
        </div>
      ))}
    </Panel>
  );
}
