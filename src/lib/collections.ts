import { getCollection } from 'astro:content';
import type { Locale } from '../i18n/routes.ts';
import { isPublished, validateArticles } from './articles.ts';

export async function publishedArticles(locale?: Locale) {
  const entries = validateArticles(await getCollection('articles'));
  return entries
    .filter((entry) => isPublished(entry.data) && (!locale || entry.data.locale === locale))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
