export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const coreRoutes = ['home', 'projects', 'gallery', 'about', 'writing', 'contact'] as const;
export type CoreRoute = (typeof coreRoutes)[number];
export type RouteKey = CoreRoute | 'notFound' | 'project' | 'article';
const segments: Record<RouteKey, string> = {
  home: '',
  projects: 'projects',
  gallery: 'gallery',
  about: 'about',
  writing: 'writing',
  contact: 'contact',
  notFound: '404',
  project: 'projects',
  article: 'writing',
};

export function routePath(locale: Locale, route: RouteKey): string {
  if (route === 'notFound') return locale === 'en' ? '/404.html' : '/es/404/';
  const prefix = locale === 'es' ? '/es/' : '/';
  return `${prefix}${segments[route]}${segments[route] ? '/' : ''}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

/** Unknown paths deliberately fall back to the requested language's home. */
export function equivalentPath(
  pathname: string,
  target: Locale,
  availablePaths: readonly string[] = [],
): string {
  const withoutPrefix = pathname.replace(/^\/es(?=\/|$)/, '');
  const normalized = `/${withoutPrefix.split('/').filter(Boolean).join('/')}/`.replace(
    /^\/\/$/,
    '/',
  );
  const key = coreRoutes.find((route) => routePath('en', route) === normalized);
  if (!key) {
    const current = pathname.startsWith('/es/') ? `/es${normalized}` : normalized;
    const translated = target === 'es' ? `/es${normalized}` : normalized;
    if (availablePaths.includes(current) && availablePaths.includes(translated)) return translated;
  }
  return routePath(target, key ?? 'home');
}

export function isCurrent(route: RouteKey, item: CoreRoute): boolean {
  return (
    route === item ||
    (item === 'projects' && (route === 'gallery' || route === 'project')) ||
    (item === 'writing' && route === 'article')
  );
}

export function detailPath(locale: Locale, section: 'projects' | 'writing', slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid content slug');
  return `${routePath(locale, section)}${slug}/`;
}
