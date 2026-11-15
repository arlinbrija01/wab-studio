import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { buildSeed } from './seed';
import type { SiteData } from './types';

/**
 * ARCHIVIO DEI CONTENUTI
 * ----------------------
 * Un unico file, data/site.json, letto in memoria e riscritto in modo
 * atomico: si scrive prima un file temporaneo e poi lo si rinomina, così
 * un'interruzione a metà non lascia mai un file rotto. A ogni salvataggio
 * viene tenuta una copia in data/backups (le ultime 20).
 *
 * Per il volume di questo sito — qualche decina di progetti e un solo
 * redattore — è più solido e più semplice da salvare di un database:
 * il backup è una copia della cartella data/ e del contenuto di
 * public/uploads.
 */

/**
 * Dove stanno i contenuti.
 * Di norma è la cartella `data` dentro al progetto. Si può spostare con
 * la variabile DATA_DIR: utile per tenere i contenuti su un disco
 * separato dal codice, così un aggiornamento del sito non li tocca.
 */
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data');

const DATA_FILE = path.join(DATA_DIR, 'site.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const MAX_BACKUPS = 20;

type Cache = { data: SiteData; mtimeMs: number } | null;

// La cache vive nel processo. In sviluppo Next ricarica i moduli a ogni
// modifica, quindi la teniamo sul globale per non perderla continuamente.
const globalCache = globalThis as unknown as { __wabCache?: Cache };

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(BACKUP_DIR, { recursive: true });
}

/** Legge i contenuti del sito. Al primo avvio crea il file dai dati iniziali. */
export async function readSite(): Promise<SiteData> {
  await ensureDirs();

  let stat;
  try {
    stat = await fs.stat(DATA_FILE);
  } catch {
    const seed = buildSeed();
    await writeSite(seed, { backup: false });
    return seed;
  }

  const cached = globalCache.__wabCache;
  if (cached && cached.mtimeMs === stat.mtimeMs) return cached.data;

  const raw = await fs.readFile(DATA_FILE, 'utf8');
  let data: SiteData;
  try {
    data = JSON.parse(raw) as SiteData;
  } catch {
    // File illeggibile: non si sovrascrive niente, si torna ai dati iniziali
    // e si lascia il file rotto sul disco da ispezionare.
    console.error('[store] data/site.json non è un JSON valido — uso i dati iniziali');
    return buildSeed();
  }

  globalCache.__wabCache = { data, mtimeMs: stat.mtimeMs };
  return data;
}

interface WriteOptions {
  backup?: boolean;
}

/** Salva i contenuti in modo atomico. */
export async function writeSite(data: SiteData, options: WriteOptions = {}): Promise<SiteData> {
  const { backup = true } = options;
  await ensureDirs();

  const next: SiteData = { ...data, updatedAt: new Date().toISOString() };
  const payload = JSON.stringify(next, null, 2);

  if (backup) await makeBackup();

  const temp = path.join(DATA_DIR, `.site.${process.pid}.${Date.now()}.tmp`);
  await fs.writeFile(temp, payload, 'utf8');
  await fs.rename(temp, DATA_FILE);

  const stat = await fs.stat(DATA_FILE);
  globalCache.__wabCache = { data: next, mtimeMs: stat.mtimeMs };

  return next;
}

/**
 * Legge, modifica e salva in un colpo solo.
 * Tutte le azioni del pannello passano da qui.
 */
export async function updateSite(
  mutate: (draft: SiteData) => void | Promise<void>
): Promise<SiteData> {
  const current = await readSite();
  // Copia profonda: la funzione può modificare liberamente senza toccare
  // l'oggetto in cache finché il salvataggio non è andato a buon fine.
  const draft = structuredClone(current);
  await mutate(draft);
  return writeSite(draft);
}

async function makeBackup() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    await fs.writeFile(path.join(BACKUP_DIR, `site-${stamp}.json`), raw, 'utf8');

    const files = (await fs.readdir(BACKUP_DIR))
      .filter((name) => name.startsWith('site-') && name.endsWith('.json'))
      .sort();

    for (const old of files.slice(0, Math.max(0, files.length - MAX_BACKUPS))) {
      await fs.unlink(path.join(BACKUP_DIR, old)).catch(() => {});
    }
  } catch {
    // Nessun file da copiare: è il primo salvataggio.
  }
}

/** Svuota la cache: usata dopo un ripristino manuale del file. */
export function clearSiteCache() {
  globalCache.__wabCache = null;
}

export const paths = { DATA_DIR, DATA_FILE, BACKUP_DIR };
