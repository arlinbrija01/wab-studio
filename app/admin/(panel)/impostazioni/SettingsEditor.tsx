'use client';

import type { Settings } from '@/lib/data/types';
import { LocText, PageTitle, Panel, Text } from '../../_components/Fields';
import SaveBar from '../../_components/SaveBar';
import { useEditor } from '../../_components/useEditor';
import { saveSettings } from '../../_actions/content';

export default function SettingsEditor({ settings }: { settings: Settings }) {
  const editor = useEditor(settings, saveSettings);
  const v = editor.value;
  const set = editor.patch;

  const setAddress = (patch: Partial<Settings['address']>) =>
    set({ address: { ...v.address, ...patch } });

  return (
    <>
      <PageTitle
        title="Impostazioni"
        description="Contatti e dati dello studio. Compaiono nel piè di pagina, nella pagina Contatti e nei dati strutturati che legge Google."
      />

      <Panel title="Studio">
        <div className="grid gap-5 sm:grid-cols-2">
          <Text label="Nome" value={v.name} onChange={(name) => set({ name })} />
          <Text
            label="Ragione sociale"
            value={v.legalName}
            onChange={(legalName) => set({ legalName })}
            hint="Mostrata nella riga del copyright."
          />
          <Text
            label="Indirizzo del sito"
            value={v.url}
            onChange={(url) => set({ url })}
            mono
            placeholder="https://www.wabstudio.it"
            hint="Serve per indirizzi canonici, sitemap e anteprime social. Senza barra finale."
          />
          <Text
            label="Anno di fondazione"
            value={v.founded}
            onChange={(founded) => set({ founded })}
          />
        </div>
      </Panel>

      <Panel title="Contatti">
        <div className="grid gap-5 sm:grid-cols-2">
          <Text
            label="Email"
            type="email"
            value={v.email}
            onChange={(email) => set({ email })}
            hint="Riceve anche le richieste dal modulo, se non ne imposti un'altra in .env.local."
          />
          <Text label="Partita IVA" value={v.vat} onChange={(vat) => set({ vat })} />
          <Text
            label="Telefono (come si legge)"
            value={v.phone}
            onChange={(phone) => set({ phone })}
            placeholder="+39 351 000 0000"
          />
          <Text
            label="Telefono (per il link)"
            value={v.phoneHref}
            onChange={(phoneHref) => set({ phoneHref })}
            mono
            placeholder="+393510000000"
            hint="Senza spazi: è quello che compone il telefono quando si tocca il numero."
          />
        </div>

        <LocText
          label="Orari"
          value={v.hours}
          onChange={(hours) => set({ hours })}
          placeholder="Lun – Ven, 9:00 – 18:00"
        />
      </Panel>

      <Panel title="Sede">
        <div className="grid gap-5 sm:grid-cols-2">
          <Text
            label="Via e numero"
            value={v.address.street}
            onChange={(street) => setAddress({ street })}
          />
          <Text label="CAP" value={v.address.zip} onChange={(zip) => setAddress({ zip })} />
          <Text label="Città" value={v.address.city} onChange={(city) => setAddress({ city })} />
          <Text
            label="Provincia"
            value={v.address.region}
            onChange={(region) => setAddress({ region })}
            placeholder="BZ"
          />
          <Text
            label="Paese"
            value={v.address.country}
            onChange={(country) => setAddress({ country })}
          />
          <Text
            label="Codice paese"
            value={v.address.countryCode}
            onChange={(countryCode) => setAddress({ countryCode })}
            mono
            placeholder="IT"
            hint="Due lettere. Usato nei dati strutturati."
          />
        </div>
      </Panel>

      <Panel
        title="Social"
        description="Compaiono nel piè di pagina e nella pagina Contatti, e dicono a Google che i profili sono vostri."
        aside={
          <button
            type="button"
            onClick={() => set({ socials: [...v.socials, { name: '', url: '' }] })}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            + Aggiungi
          </button>
        }
      >
        {v.socials.length === 0 && (
          <p className="text-[0.82rem] text-zinc-500">Nessun profilo indicato.</p>
        )}

        {v.socials.map((social, index) => (
          <div key={index} className="flex items-end gap-3">
            <div className="w-40 shrink-0">
              <Text
                label="Nome"
                value={social.name}
                onChange={(name) =>
                  set({
                    socials: v.socials.map((s, i) => (i === index ? { ...s, name } : s)),
                  })
                }
                placeholder="Instagram"
              />
            </div>
            <div className="flex-1">
              <Text
                label="Indirizzo"
                value={social.url}
                onChange={(url) =>
                  set({ socials: v.socials.map((s, i) => (i === index ? { ...s, url } : s)) })
                }
                mono
                placeholder="https://instagram.com/wabstudio"
              />
            </div>
            <button
              type="button"
              onClick={() => set({ socials: v.socials.filter((_, i) => i !== index) })}
              className="admin-btn admin-btn-danger admin-btn-sm"
            >
              Togli
            </button>
          </div>
        ))}
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
