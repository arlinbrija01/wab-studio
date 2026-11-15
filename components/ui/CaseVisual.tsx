import Image from 'next/image';

/**
 * Immagine di copertina di un progetto.
 *
 * Finché non ci sono foto vere, disegna un fondo astratto costruito
 * sul colore del progetto. Appena hai gli screenshot, passa `image`
 * (es. "/work/hotel-alpenblick.jpg", file dentro /public/work)
 * e il resto resta identico.
 */
export default function CaseVisual({
  accent,
  client,
  index = 0,
  image,
  className = '',
  priority = false,
}: {
  accent: string;
  client: string;
  index?: number;
  image?: string;
  className?: string;
  priority?: boolean;
}) {
  const initials = client
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[var(--bg-elevated)] ${className}`}
      style={{ ['--case' as string]: accent }}
    >
      {image ? (
        <Image
          src={image}
          alt={client}
          fill
          priority={priority}
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 58vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 95% at ${
                20 + index * 13
              }% 0%, color-mix(in oklab, var(--case) 78%, white) 0%, var(--case) 42%, color-mix(in oklab, var(--case) 55%, black) 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '3.5rem 3.5rem',
            }}
          />
          <span
            className="absolute right-5 bottom-3 font-semibold tracking-[-0.05em] text-white/22"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', lineHeight: 1 }}
          >
            {initials}
          </span>
          <span className="absolute top-5 left-5 rounded-full bg-black/25 px-3 py-1 text-[0.68rem] tracking-[0.14em] text-white/80 uppercase backdrop-blur-sm">
            {client}
          </span>
        </div>
      )}
    </div>
  );
}
