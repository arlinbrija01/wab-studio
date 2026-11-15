import Link from 'next/link';
import { path, type Locale } from '@/lib/routes';

/**
 * Marchio tipografico di WAB Studio.
 * Non serve un file immagine: è testo, quindi resta nitido ovunque
 * e si adatta da solo al tema chiaro o scuro della sezione.
 */
export default function Logo({
  locale,
  className = '',
  onClick,
}: {
  locale: Locale;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={path(locale, 'home')}
      onClick={onClick}
      aria-label="WAB Studio — home"
      className={`group inline-flex items-baseline gap-[0.3em] leading-none ${className}`}
    >
      <span className="text-[1.05rem] font-semibold tracking-[-0.04em] md:text-[1.15rem]">
        WAB
      </span>
      <span
        aria-hidden
        className="mb-[0.15em] h-[0.3em] w-[0.3em] rounded-full bg-[var(--color-accent)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-150"
      />
      <span className="eyebrow opacity-60 transition-opacity duration-500 group-hover:opacity-100">
        Studio
      </span>
    </Link>
  );
}
