import test from 'node:test';
import assert from 'node:assert/strict';
import { structuredData, serializeStructuredData } from '../src/lib/seo.ts';
const input = {
  locale: 'es',
  route: 'project',
  canonical: 'https://ignaciobelitzky.dev/es/projects/kineticbox-1d/',
  title: 'KineticBox 1D',
  description: 'Una colaboración académica.',
  image: 'https://ignaciobelitzky.dev/_astro/preview.png',
};
test('Project schema preserves language and does not invent authorship, ratings or dates', () => {
  const graph = structuredData(input)['@graph'];
  const project = graph.find((node) => node['@type'] === 'CreativeWork');
  assert.equal(project.name, input.title);
  assert.equal(project.inLanguage, 'es');
  for (const key of ['author', 'creator', 'datePublished', 'aggregateRating'])
    assert.equal(project[key], undefined);
  const crumbs = graph.find((node) => node['@type'] === 'BreadcrumbList').itemListElement;
  assert.deepEqual(
    crumbs.map((item) => item.item),
    [
      'https://ignaciobelitzky.dev/es/',
      'https://ignaciobelitzky.dev/es/projects/',
      input.canonical,
    ],
  );
});
test('Profile identity is consistent across locales and errors have no schema', () => {
  const en = structuredData({ ...input, route: 'home', locale: 'en' })['@graph'];
  const es = structuredData({ ...input, route: 'about' })['@graph'];
  assert.deepEqual(en[0], es[0]);
  assert.equal(en.find((node) => node['@type'] === 'ProfilePage').mainEntity['@id'], en[0]['@id']);
  assert.equal(structuredData({ ...input, route: 'notFound' }), null);
});
test('Article schema uses actual dates and JSON-LD serialization cannot close its script', () => {
  const value = structuredData({
    ...input,
    route: 'article',
    title: '</script><script>fixture</script>',
    article: { published: new Date('2020-01-02') },
  });
  const serialized = serializeStructuredData(value);
  assert.equal(serialized.includes('</script>'), false);
  assert.deepEqual(JSON.parse(serialized), value);
  const article = value['@graph'].find((node) => node['@type'] === 'BlogPosting');
  assert.equal(article.datePublished, '2020-01-02T00:00:00.000Z');
  assert.equal(article.dateModified, undefined);
});
