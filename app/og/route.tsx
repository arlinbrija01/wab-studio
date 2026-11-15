import { ImageResponse } from 'next/og';

/**
 * Immagine di anteprima per social e messaggistica, disegnata al volo.
 * Serve quando una pagina non ha una foto propria: invece di un rettangolo
 * vuoto, chi condivide il link vede titolo e marchio.
 *
 *   /og?title=...&kicker=...&accent=%232f6bff
 */

export const runtime = 'nodejs';

const size = { width: 1200, height: 630 };

const clamp = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = clamp(searchParams.get('title')?.trim() || 'WAB Studio', 95);
  const kicker = clamp(searchParams.get('kicker')?.trim() || 'Studio digitale', 42);
  const accentRaw = searchParams.get('accent') ?? '';
  const accent = /^#[0-9a-fA-F]{6}$/.test(accentRaw) ? accentRaw : '#2f6bff';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#050507',
          padding: '72px',
          position: 'relative',
        }}
      >
        {/* Alone di colore in alto a destra */}
        <div
          style={{
            position: 'absolute',
            top: -260,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background: accent,
            opacity: 0.3,
            filter: 'blur(130px)',
            display: 'flex',
          }}
        />

        {/* Marchio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#f7f7f9', fontSize: 34, fontWeight: 700, letterSpacing: -1.6 }}>
            WAB
          </span>
          <span
            style={{ width: 11, height: 11, borderRadius: 9999, background: accent, display: 'flex' }}
          />
          <span style={{ color: '#9a9aa8', fontSize: 19, letterSpacing: 5 }}>STUDIO</span>
        </div>

        {/* Titolo */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: accent, fontSize: 21, letterSpacing: 4, marginBottom: 22 }}>
            {kicker.toUpperCase()}
          </span>
          <span
            style={{
              color: '#f7f7f9',
              fontSize: title.length > 55 ? 62 : 76,
              fontWeight: 700,
              letterSpacing: -2.6,
              lineHeight: 1.06,
            }}
          >
            {title}
          </span>
        </div>

        {/* Riga in basso */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            paddingTop: 26,
          }}
        >
          <span style={{ color: '#9a9aa8', fontSize: 21 }}>
            Siti web · SEO · Social media
          </span>
          <span style={{ color: '#9a9aa8', fontSize: 21 }}>wabstudio.it</span>
        </div>
      </div>
    ),
    size
  );
}
