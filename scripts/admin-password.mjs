#!/usr/bin/env node
/**
 * Genera le credenziali del pannello.
 *
 *   npm run admin:password -- "la-mia-password"
 *
 * Stampa le righe da incollare in .env.local. La password in chiaro non
 * viene salvata da nessuna parte: resta solo la sua impronta scrypt.
 */

import { randomBytes, scryptSync } from 'node:crypto';

const password = process.argv[2];

if (!password) {
  console.error('\nUso:  npm run admin:password -- "la-tua-password"\n');
  process.exit(1);
}

if (password.length < 10) {
  console.error('\nLa password deve essere lunga almeno 10 caratteri.\n');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const key = scryptSync(password.normalize('NFKC'), salt, 64).toString('hex');

const hash = `scrypt:${salt}:${key}`;
const secret = randomBytes(32).toString('base64url');
const path = `pannello-${randomBytes(4).toString('hex')}`;

console.log(`
Incolla queste righe in .env.local (cambia l'email con la tua):

ADMIN_EMAIL=info@wabstudio.it
ADMIN_PASSWORD_HASH=${hash}
ADMIN_SESSION_SECRET=${secret}
ADMIN_PATH=${path}

Il pannello sarà raggiungibile su:  /${path}

Tieni questo indirizzo per te: non è collegato da nessuna pagina,
non finisce nella sitemap ed è escluso dai motori di ricerca.
`);
