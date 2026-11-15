import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/routes';

/**
 * Due compiti:
 *
 * 1. Il pannello. Vive in app/admin/ ma non è raggiungibile a quell'indirizzo:
 *    risponde solo sul percorso segreto scelto in ADMIN_PATH, che viene
 *    riscritto qui. Chi prova /admin a mano riceve un 404 secco, identico
 *    a quello di una pagina inesistente.
 *
 * 2. Le lingue. Ogni indirizzo pubblico comincia con /it o /de; chi arriva
 *    su "/" viene mandato alla lingua del suo browser.
 */

function adminSegment() {
  return (process.env.ADMIN_PATH ?? 'pannello').trim().replace(/^\/+|\/+$/g, '');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Pannello -----------------------------------------------------
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const segment = adminSegment();
  if (segment && (pathname === `/${segment}` || pathname.startsWith(`/${segment}/`))) {
    const rest = pathname.slice(segment.length + 1);
    const url = request.nextUrl.clone();
    url.pathname = `/admin${rest}`;

    const response = NextResponse.rewrite(url);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // --- Lingue -------------------------------------------------------
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  const accept = request.headers.get('accept-language')?.toLowerCase() ?? '';
  const preferred = locales.find((locale) => accept.startsWith(locale)) ?? defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Esclude API, file di Next e qualsiasi percorso con un'estensione.
  matcher: ['/((?!api|og|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
