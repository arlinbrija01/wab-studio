'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import type { SiteDict } from '@/content';
import type { Locale } from '@/lib/routes';
import Button from '@/components/ui/Button';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'message' | 'privacy', string>>;

export default function ContactForm({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  const t = dict.contact.form;
  const root = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [privacy, setPrivacy] = useState(false);

  const toggleService = (value: string) =>
    setServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );

  // Animazione del passaggio modulo → conferma
  useGSAP(
    () => {
      if (status !== 'sent' || prefersReducedMotion()) return;
      gsap.from('[data-success]', { autoAlpha: 0, y: 24, duration: 0.8, ease: 'power3.out' });
    },
    { dependencies: [status], scope: root }
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      company: String(data.get('company') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      // Campo trappola: i robot lo riempiono, le persone no.
      website: String(data.get('website') ?? ''),
      services,
      budget,
      locale,
    };

    const next: Errors = {};
    if (payload.name.length < 2) next.name = t.errors.name;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(payload.email)) next.email = t.errors.email;
    if (payload.message.length < 20) next.message = t.errors.message;
    if (!privacy) next.privacy = t.errors.privacy;

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = root.current?.querySelector<HTMLElement>('[data-field-error]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  const fieldClass =
    'w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3.5 text-[0.95rem] outline-none transition-colors duration-300 placeholder:text-[var(--fg-muted)] focus:border-[var(--color-accent)]';

  if (status === 'sent') {
    return (
      <div ref={root}>
        <div
          data-success
          className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-10 text-center"
        >
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="m5 13 4.5 4.5L19 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="display-sm">{t.successTitle}</h3>
          <p className="mx-auto mt-4 max-w-sm text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
            {t.successBody}
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              magnetic={false}
              onClick={() => {
                setStatus('idle');
                setServices([]);
                setBudget('');
                setPrivacy(false);
              }}
            >
              {t.successAgain}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={root}>
      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        {/* Campo trappola antispam, nascosto alle persone */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.name} error={errors.name}>
            <input
              name="name"
              autoComplete="name"
              placeholder={t.namePlaceholder}
              className={fieldClass}
            />
          </Field>

          <Field label={t.email} error={errors.email}>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              className={fieldClass}
            />
          </Field>

          <Field label={t.company}>
            <input
              name="company"
              autoComplete="organization"
              placeholder={t.companyPlaceholder}
              className={fieldClass}
            />
          </Field>

          <Field label={t.phone}>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={t.phonePlaceholder}
              className={fieldClass}
            />
          </Field>
        </div>

        <fieldset>
          <legend className="eyebrow mb-4 text-[var(--fg-muted)]">{t.servicesLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {dict.services.items.map((service) => {
              const active = services.includes(service.title);
              return (
                <button
                  key={service.slug}
                  type="button"
                  onClick={() => toggleService(service.title)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-[0.875rem] transition-all duration-300 ${
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                      : 'border-[var(--line)] text-[var(--fg-muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]'
                  }`}
                >
                  {service.title}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow mb-4 text-[var(--fg-muted)]">{t.budgetLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {t.budgets.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBudget(budget === option ? '' : option)}
                aria-pressed={budget === option}
                className={`rounded-full border px-4 py-2 text-[0.875rem] transition-all duration-300 ${
                  budget === option
                    ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]'
                    : 'border-[var(--line)] text-[var(--fg-muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <Field label={t.message} error={errors.message}>
          <textarea
            name="message"
            rows={6}
            placeholder={t.messagePlaceholder}
            className={`${fieldClass} resize-none`}
          />
        </Field>

        <div data-field-error={errors.privacy ? '' : undefined}>
          <label className="flex cursor-pointer items-start gap-3 text-[0.875rem] leading-relaxed text-[var(--fg-muted)]">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
            />
            <span>{t.privacy}</span>
          </label>
          {errors.privacy && (
            <p className="mt-2 text-[0.8125rem] text-[#e5484d]">{errors.privacy}</p>
          )}
        </div>

        {status === 'error' && (
          <div className="rounded-xl border border-[#e5484d]/40 bg-[#e5484d]/10 p-5">
            <p className="text-[0.95rem] font-medium">{t.errorTitle}</p>
            <p className="mt-1 text-[0.875rem] text-[var(--fg-muted)]">{t.errorBody}</p>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="accent"
            arrow
            disabled={status === 'sending'}
            magnetic={false}
          >
            {status === 'sending' ? t.submitting : t.submit}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" data-field-error={error ? '' : undefined}>
      <span className="eyebrow mb-2.5 block text-[var(--fg-muted)]">{label}</span>
      {children}
      {error && <span className="mt-2 block text-[0.8125rem] text-[#e5484d]">{error}</span>}
    </label>
  );
}
