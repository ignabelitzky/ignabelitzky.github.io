import type { ArticleData } from './content-schema.ts';
import { detailPath, type Locale } from '../i18n/routes.ts';

export function isPublished(data: ArticleData, now: Date = new Date()): boolean {
  return !data.draft && data.pubDate <= now;
}

export function validateArticles<T extends { data: ArticleData }>(entries: T[]): T[] {
  const routes = new Set<string>();
  const translations = new Set<string>();
  const slugs = new Map<string, string>();
  for (const entry of entries) {
    const d = entry.data;
    const path = detailPath(d.locale, 'writing', d.slug);
    const key = `${d.locale}:${d.translationKey}`;
    if (routes.has(path) || translations.has(key))
      throw new Error('Duplicate article route or translation');
    if (slugs.has(d.translationKey) && slugs.get(d.translationKey) !== d.slug)
      throw new Error('Translated articles must share a stable slug');
    routes.add(path);
    translations.add(key);
    slugs.set(d.translationKey, d.slug);
  }
  return entries;
}

export function articleAlternates<T extends { data: ArticleData }>(
  article: T,
  published: T[],
): Partial<Record<Locale, string>> {
  return Object.fromEntries(
    published
      .filter((entry) => entry.data.translationKey === article.data.translationKey)
      .map((entry) => [
        entry.data.locale,
        detailPath(entry.data.locale, 'writing', entry.data.slug),
      ]),
  );
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-AR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
