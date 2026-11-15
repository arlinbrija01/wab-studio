'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, type LoginState } from '../_actions/auth';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn admin-btn-primary w-full" disabled={pending}>
      {pending ? 'Verifica…' : 'Entra'}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="admin-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="admin-input"
          placeholder="info@wabstudio.it"
        />
      </div>

      <div>
        <label className="admin-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="admin-input"
          placeholder="••••••••••"
        />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.8rem] leading-relaxed text-red-700">
          {state.error}
        </p>
      )}

      <div className="pt-1">
        <Submit />
      </div>
    </form>
  );
}
