'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  adminUrl,
  attemptStatus,
  clearFailures,
  endSession,
  getAdminConfig,
  registerFailure,
  startSession,
  verifyPassword,
} from '@/lib/admin/auth';

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const config = getAdminConfig();

  if (!config.configured) {
    return {
      error:
        'Il pannello non è ancora configurato. Esegui  npm run admin:password  e incolla le righe in .env.local.',
    };
  }

  // Chiave del freno antitentativi: l'indirizzo di chi prova.
  const headerList = await headers();
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip') ||
    'locale';

  const status = attemptStatus(ip);
  if (status.blocked) {
    return { error: `Troppi tentativi. Riprova fra ${status.minutesLeft} minuti.` };
  }

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');

  // Si verificano entrambi comunque, per non far capire dalla velocità
  // di risposta quale dei due fosse sbagliato.
  const emailOk = email === config.email;
  const passwordOk = verifyPassword(password, config.passwordHash);

  if (!emailOk || !passwordOk) {
    registerFailure(ip);
    return { error: 'Email o password non corrette.' };
  }

  clearFailures(ip);
  await startSession(email);
  redirect(adminUrl());
}

export async function logoutAction() {
  await endSession();
  redirect(adminUrl('accedi'));
}
