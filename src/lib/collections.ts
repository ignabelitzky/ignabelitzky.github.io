import { getCollection } from 'astro:content';
import { isPublished, validateArticles } from './articles.ts';

export async function publishedArticles() {
  const entries = validateArticles(await getCollection('articles'));
  return entries
    .filter((entry) => isPublished(entry.data))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
