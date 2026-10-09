import type { APIRoute } from 'astro';
import { site } from '../data/site.ts';

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\n${site.indexable ? 'Allow: /' : 'Disallow: /'}\nSitemap: ${site.origin}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
