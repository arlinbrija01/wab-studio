import { redirect } from 'next/navigation';
import { adminUrl, getAdminConfig, isLoggedIn } from '@/lib/admin/auth';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  if (await isLoggedIn()) redirect(adminUrl());

  const { configured } = getAdminConfig();

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex items-baseline justify-center gap-[0.3em] leading-none">
          <span className="text-xl font-semibold tracking-[-0.04em]">WAB</span>
          <span className="mb-[0.15em] h-[0.26em] w-[0.26em] rounded-full bg-[#2f6bff]" />
          <span className="font-mono text-[0.65rem] tracking-[0.18em] text-zinc-500 uppercase">
            Pannello
          </span>
        </div>

        <div className="admin-card p-7">
          <h1 className="text-lg font-semibold tracking-[-0.02em]">Accedi</h1>
          <p className="mt-1.5 mb-7 text-sm text-zinc-500">
            Area riservata per la gestione dei contenuti.
          </p>

          <LoginForm />
        </div>

        {!configured && (
          <div className="admin-card mt-5 border-amber-200 bg-amber-50 p-5 text-[0.8rem] leading-relaxed text-amber-900">
            <p className="mb-2 font-semibold">Primo avvio</p>
            <p>
              Genera le credenziali con{' '}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[0.75rem]">
                npm run admin:password -- &quot;la-tua-password&quot;
              </code>{' '}
              e incolla le righe stampate nel file <code>.env.local</code>, poi riavvia il server.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
