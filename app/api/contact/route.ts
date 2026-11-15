import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { readSite } from '@/lib/data/store';

export const runtime = 'nodejs';

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  message?: string;
  website?: string;
  services?: string[];
  budget?: string;
  locale?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  // Campo trappola compilato: è un robot. Rispondiamo ok e buttiamo via.
  if (body.website) return NextResponse.json({ ok: true });

  if (name.length < 2 || message.length < 20 || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'validation' }, { status: 422 });
  }

  const settings = (await readSite()).settings;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? settings.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';

  if (!apiKey) {
    // In sviluppo, senza chiave, la richiesta finisce nel terminale
    // invece di fallire: così il modulo si può provare subito.
    console.warn(
      '[contact] RESEND_API_KEY non impostata — richiesta non inviata via email:',
      JSON.stringify({ name, email, company: body.company, message }, null, 2)
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  const rows: [string, string][] = [
    ['Nome', name],
    ['Email', email],
    ['Azienda', body.company || '—'],
    ['Telefono', body.phone || '—'],
    ['Servizi', body.services?.length ? body.services.join(', ') : '—'],
    ['Budget', body.budget || '—'],
    ['Lingua', (body.locale || 'it').toUpperCase()],
  ];

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;max-width:640px;color:#0a0a0c">
      <h2 style="margin:0 0 24px;font-size:18px;letter-spacing:-0.02em">
        Nuova richiesta dal sito WAB Studio
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 0;color:#63636f;width:120px;vertical-align:top">${label}</td>
            <td style="padding:8px 0">${escapeHtml(value)}</td>
          </tr>`
          )
          .join('')}
      </table>
      <div style="margin-top:24px;padding-top:24px;border-top:1px solid #e5e5ea">
        <p style="margin:0 0 8px;color:#63636f;font-size:13px">Messaggio</p>
        <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `${settings.name} <${from}>`,
      to: [to],
      replyTo: email,
      subject: `Nuova richiesta — ${name}${body.company ? ` (${body.company})` : ''}`,
      html,
    });

    if (error) {
      console.error('[contact] Resend:', error);
      return NextResponse.json({ error: 'send_failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}
