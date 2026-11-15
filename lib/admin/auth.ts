import 'server-only';

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * ACCESSO AL PANNELLO
 * -------------------
 * Un solo utente, con credenziali nelle variabili d'ambiente.
 * La password non è mai salvata in chiaro: nel file .env.local sta
 * un'impronta scrypt, generata con `npm run admin:password`.
 *
 * La sessione è un cookie firmato con HMAC-SHA256: il contenuto è
 * leggibile ma non modificabile senza conoscere ADMIN_SESSION_SECRET.
 */

const COOKIE = 'wab_admin';
const SESSION_HOURS = 12;

/* ------------------------------------------------------------------ */
/* Password                                                            */
/* ------------------------------------------------------------------ */

/**
 * Genera l'impronta da mettere in ADMIN_PASSWORD_HASH.
 * I pezzi sono separati da ":" e non da "$": il lettore dei file .env
 * tratta il dollaro come inizio di una variabile e svuoterebbe il valore.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const key = scryptSync(password.normalize('NFKC'), salt, 64).toString('hex');
  return `scrypt:${salt}:${key}`;
}

/** Confronto a tempo costante: non rivela nulla dalla durata della verifica. */
export function verifyPassword(password: string, stored: string): boolean {
  // Si accetta anche il vecchio separatore, per non rompere nulla.
  const parts = stored.includes(':') ? stored.split(':') : stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;

  const [, salt, expected] = parts;
  let actual: Buffer;
  try {
    actual = scryptSync(password.normalize('NFKC'), salt, 64);
  } catch {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, 'hex');
  if (expectedBuffer.length !== actual.length) return false;
  return timingSafeEqual(expectedBuffer, actual);
}

/* ------------------------------------------------------------------ */
/* Configurazione                                                      */
/* ------------------------------------------------------------------ */

export interface AdminConfig {
  email: string;
  passwordHash: string;
  secret: string;
  /** Segmento segreto dell'indirizzo, es. "pannello-7fa23c" */
  path: string;
  configured: boolean;
}

export function getAdminConfig(): AdminConfig {
  const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const passwordHash = (process.env.ADMIN_PASSWORD_HASH ?? '').trim();
  const secret = (process.env.ADMIN_SESSION_SECRET ?? '').trim();
  const path = (process.env.ADMIN_PATH ?? 'pannello').trim().replace(/^\/+|\/+$/g, '');

  return {
    email,
    passwordHash,
    secret,
    path,
    configured: Boolean(email && passwordHash && secret.length >= 24),
  };
}

/** Indirizzo di base del pannello, es. /pannello-7fa23c */
export function adminBase(): string {
  return `/${getAdminConfig().path}`;
}

export function adminUrl(sub = ''): string {
  const base = adminBase();
  return sub ? `${base}/${sub.replace(/^\/+/, '')}` : base;
}

/* ------------------------------------------------------------------ */
/* Sessione                                                            */
/* ------------------------------------------------------------------ */

interface SessionPayload {
  sub: string;
  exp: number;
}

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64url');

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function createToken(email: string, secret: string): string {
  const payload: SessionPayload = {
    sub: email,
    exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body, secret)}`;
}

function readToken(token: string, secret: string): SessionPayload | null {
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = sign(body, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function startSession(email: string) {
  const { secret } = getAdminConfig();
  const store = await cookies();

  store.set(COOKIE, createToken(email, secret), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Restituisce l'email di chi è collegato, o null. */
export async function getSession(): Promise<string | null> {
  const config = getAdminConfig();
  if (!config.configured) return null;

  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const payload = readToken(token, config.secret);
  if (!payload) return null;
  if (payload.sub.toLowerCase() !== config.email) return null;

  return payload.sub;
}

export async function isLoggedIn(): Promise<boolean> {
  return (await getSession()) !== null;
}

/* ------------------------------------------------------------------ */
/* Freno ai tentativi ripetuti                                         */
/* ------------------------------------------------------------------ */

interface Attempt {
  count: number;
  until: number;
}

const globalAttempts = globalThis as unknown as { __wabAttempts?: Map<string, Attempt> };
const attempts = (globalAttempts.__wabAttempts ??= new Map<string, Attempt>());

const MAX_ATTEMPTS = 6;
const LOCK_MINUTES = 15;

export function attemptStatus(key: string): { blocked: boolean; minutesLeft: number } {
  const entry = attempts.get(key);
  if (!entry) return { blocked: false, minutesLeft: 0 };
  if (entry.until > Date.now()) {
    return { blocked: true, minutesLeft: Math.ceil((entry.until - Date.now()) / 60000) };
  }
  attempts.delete(key);
  return { blocked: false, minutesLeft: 0 };
}

export function registerFailure(key: string) {
  const entry = attempts.get(key) ?? { count: 0, until: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.until = Date.now() + LOCK_MINUTES * 60 * 1000;
    entry.count = 0;
  }
  attempts.set(key, entry);
}

export function clearFailures(key: string) {
  attempts.delete(key);
}
