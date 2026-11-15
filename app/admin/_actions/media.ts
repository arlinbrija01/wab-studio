'use server';

import { promises as fs } from 'node:fs';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/admin/auth';
import { readSite, updateSite } from '@/lib/data/store';
import type { L, MediaItem } from '@/lib/data/types';

export interface MediaResult {
  ok: boolean;
  error?: string;
  item?: MediaItem;
}

/** Si può spostare con UPLOADS_DIR, ma deve restare servita su /uploads. */
const UPLOAD_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(process.cwd(), 'public', 'uploads');

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Formati ammessi. L'SVG è escluso di proposito: è un documento che può
 * contenere script, e servirlo dallo stesso dominio del sito aprirebbe
 * una porta che non vale la pena aprire per un'icona.
 */
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

/** Firme dei file: si controlla il contenuto, non solo l'etichetta. */
function sniff(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return 'image/png';
  if (buffer.subarray(0, 3).toString('ascii') === 'GIF') return 'image/gif';
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  )
    return 'image/webp';
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = buffer.subarray(8, 12).toString('ascii');
    if (brand.startsWith('avif') || brand.startsWith('avis')) return 'image/avif';
  }
  return null;
}

function cleanName(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'immagine'
  );
}

async function guard() {
  if (!(await getSession())) throw new Error('Sessione scaduta.');
}

export async function uploadMedia(formData: FormData): Promise<MediaResult> {
  try {
    await guard();

    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: 'Nessun file ricevuto.' };
    }
    if (file.size > MAX_BYTES) {
      return { ok: false, error: `Il file supera gli 8 MB (${Math.round(file.size / 1e6)} MB).` };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = sniff(buffer);
    if (!mime || !ALLOWED[mime]) {
      return {
        ok: false,
        error: 'Formato non ammesso. Usa JPG, PNG, WebP, AVIF o GIF.',
      };
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const filename = `${cleanName(file.name)}-${randomBytes(3).toString('hex')}.${ALLOWED[mime]}`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    const item: MediaItem = {
      id: `med-${Date.now().toString(36)}${randomBytes(2).toString('hex')}`,
      filename,
      url: `/uploads/${filename}`,
      alt: { it: '' },
      size: buffer.length,
      mime,
      uploadedAt: new Date().toISOString(),
    };

    await updateSite((data) => {
      data.media.unshift(item);
    });

    revalidatePath('/', 'layout');
    return { ok: true, item };
  } catch (error) {
    console.error('[upload]', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Caricamento fallito.' };
  }
}

export async function deleteMedia(id: string): Promise<MediaResult> {
  try {
    await guard();

    const data = await readSite();
    const item = data.media.find((m) => m.id === id);
    if (!item) return { ok: false, error: 'Immagine non trovata.' };

    // Un'immagine usata da un progetto non si cancella per sbaglio.
    const used = data.projects.find(
      (p) => p.cover === item.url || p.gallery.includes(item.url)
    );
    if (used) {
      return {
        ok: false,
        error: `Immagine usata dal progetto "${used.client}". Toglila da lì prima di eliminarla.`,
      };
    }

    await fs.unlink(path.join(UPLOAD_DIR, item.filename)).catch(() => {});
    await updateSite((draft) => {
      draft.media = draft.media.filter((m) => m.id !== id);
    });

    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (error) {
    console.error('[media]', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Eliminazione fallita.' };
  }
}

export async function updateMediaAlt(id: string, alt: L): Promise<MediaResult> {
  try {
    await guard();
    await updateSite((data) => {
      const item = data.media.find((m) => m.id === id);
      if (item) {
        const de = typeof alt.de === 'string' ? alt.de.trim() : '';
        item.alt = de ? { it: String(alt.it ?? ''), de } : { it: String(alt.it ?? '') };
      }
    });
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Salvataggio fallito.' };
  }
}
