#!/usr/bin/env node
/**
 * Avvia il server di sviluppo con la cartella di lavoro giusta.
 *
 * Serve quando il server viene lanciato da fuori (per esempio dal
 * pannello di anteprima dell'editor): Next accetta la cartella come
 * argomento ma non cambia la working directory, e l'archivio dei
 * contenuti finirebbe nel posto sbagliato.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT ?? process.argv[2] ?? '3000';

const child = spawn(
  process.execPath,
  [path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'dev', '-p', port],
  { cwd: root, stdio: 'inherit', env: process.env }
);

child.on('exit', (code) => process.exit(code ?? 0));
