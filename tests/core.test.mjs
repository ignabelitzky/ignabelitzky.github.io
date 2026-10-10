import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import {
  coreRoutes,
  routePath,
  equivalentPath,
  otherLocale,
  isCurrent,
  detailPath,
} from '../src/i18n/routes.ts';
import { ui } from '../src/i18n/ui.ts';
import { normalizeTheme, readTheme, writeTheme, effectiveTheme } from '../src/lib/theme.ts';
import { projectSchema, experimentSchema, articleSchema } from '../src/lib/content-schema.ts';
import {
  isPublished,
  validateArticles,
  articleAlternates,
  formatDate,
} from '../src/lib/articles.ts';
import { editorial } from '../src/i18n/editorial.ts';
import { availableCV } from '../src/data/site.ts';

test('Core routes preserve English root and Spanish equivalents, including nontrailing input', () => {
  for (const route of coreRoutes) {
    const en = routePath('en', route);
    const es = routePath('es', route);
    assert.equal(equivalentPath(en, 'es'), es);
    assert.equal(equivalentPath(es, 'en'), en);
    assert.equal(equivalentPath(es.replace(/\/$/, ''), 'en'), en);
    assert.ok(en.startsWith('/') && !en.startsWith('/en/'));
    assert.ok(es.startsWith('/es/'));
  }
  assert.equal(routePath('en', 'home'), '/');
});
test('Unknown and error routes switch to a useful locale home', () => {
  for (const path of ['/unknown/', '/es/unknown/', '/404.html', '/es/404/', '/esoteric/']) {
    assert.equal(equivalentPath(path, 'es'), '/es/');
    assert.equal(equivalentPath(path, 'en'), '/');
  }
  assert.equal(routePath('en', 'notFound'), '/404.html');
});
test('Gallery marks Projects as current and locale switching is symmetric', () => {
  assert.equal(isCurrent('gallery', 'projects'), true);
  assert.equal(isCurrent('writing', 'projects'), false);
  assert.equal(otherLocale(otherLocale('en')), 'en');
});
test('Every core route has genuinely paired labels and metadata', () => {
  for (const route of coreRoutes)
    for (const locale of ['en', 'es']) {
      assert.ok(ui[locale].nav[route]);
      assert.ok(ui[locale].titles[route]);
      assert.ok(ui[locale].descriptions[route]);
    }
  assert.deepEqual(Object.keys(ui.en).sort(), Object.keys(ui.es).sort());
  assert.notEqual(ui.en.hero, ui.es.hero);
  assert.match(ui.es.explore, /Explorá/);
});
test('Theme normalizes stale values and explicitly overrides the system', () => {
  for (const value of [null, undefined, 'auto', 'DARK', 12])
    assert.equal(normalizeTheme(value), 'system');
  assert.equal(effectiveTheme('system', true), 'dark');
  assert.equal(effectiveTheme('system', false), 'light');
  assert.equal(effectiveTheme('light', true), 'light');
  assert.equal(effectiveTheme('dark', false), 'dark');
});
test('Theme selection survives normal storage and safely handles denied access', () => {
  const values = new Map();
  const store = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.equal(readTheme(store), 'system');
  assert.equal(writeTheme(store, 'dark'), true);
  assert.equal(readTheme(store), 'dark');
  assert.equal(writeTheme(store, 'system'), true);
  assert.equal(readTheme(store), 'system');
  const denied = {
    getItem() {
      throw Error('denied');
    },
    setItem() {
      throw Error('denied');
    },
  };
  assert.equal(readTheme(denied), 'system');
  assert.equal(writeTheme(denied, 'light'), false);
});
const projectFiles = readdirSync(new URL('../src/content/projects/', import.meta.url)).filter((p) =>
  p.endsWith('.json'),
);
const entries = projectFiles.map((file) =>
  JSON.parse(readFileSync(new URL('../src/content/projects/' + file, import.meta.url), 'utf8')),
);
test('All nine public project entries validate against the actual project schema', () => {
  assert.equal(entries.length, 9);
  for (const entry of entries) assert.equal(projectSchema.safeParse(entry).success, true);
  assert.equal(new Set(entries.map((p) => p.slug)).size, entries.length);
  assert.deepEqual(
    entries.sort((a, b) => a.order - b.order).map((p) => p.name),
    [
      'Qt RSS Reader',
      'Video to ASCII',
      'Boids Simulation',
      'Periodic Table',
      'Periodic Table 3D',
      'EasySubber',
      'Tiny Programs',
      'KineticBox 1D',
      'Veterinaria DACOR',
    ],
  );
});
test('Schema rejects missing translations, unsafe URLs, invalid slugs and unverified extra fields', () => {
  const source = entries[0];
  const failures = [
    { ...source, translations: { en: source.translations.en } },
    { ...source, source: 'javascript:alert(1)' },
    { ...source, source: 'https://github.com/someone-else/repository' },
    {
      ...source,
      source: 'https://example-user@example.test@github.com/ignabelitzky/qt-rss-reader',
    },
    { ...source, source: 'https://github.com/ignabelitzky/qt-rss-reader?token=fixture' },
    { ...source, source: 'https://github.com/ignabelitzky/qt-rss-reader#unreviewed' },
    { ...source, source: 'https://github.com/ignabelitzky/qt-rss-reader/tree/main' },
    { ...source, slug: '../escape' },
    { ...source, technologies: [] },
    { ...source, inventedSpeedup: '10x' },
    ...[
      'http://www.veterinariadacor.com/',
      'https://evil.example/',
      'https://www.veterinariadacor.com/?token=fixture',
      'https://name@www.veterinariadacor.com/',
      'https://www.veterinariadacor.com/path/',
    ].map((website) => ({ ...source, website })),
  ];
  for (const entry of failures) assert.equal(projectSchema.safeParse(entry).success, false);
});

test('Every project keeps the detail route when switching languages', () => {
  const paths = entries.flatMap((p) =>
    ['en', 'es'].map((locale) => detailPath(locale, 'projects', p.slug)),
  );
  for (const p of entries) {
    const en = detailPath('en', 'projects', p.slug),
      es = detailPath('es', 'projects', p.slug);
    assert.equal(equivalentPath(en, 'es', paths), es);
    assert.equal(equivalentPath(es, 'en', paths), en);
    assert.equal(equivalentPath(es.slice(0, -1), 'en', paths), en);
  }
  assert.equal(equivalentPath('/projects/unlisted/', 'es', paths), '/es/');
  assert.throws(() => detailPath('en', 'projects', '../escape'));
  assert.equal(isCurrent('project', 'projects'), true);
  assert.equal(isCurrent('article', 'writing'), true);
});
test('Featured order, public source attribution and research credit remain exact', () => {
  assert.deepEqual(
    entries.filter((p) => p.featured).map((p) => p.slug),
    ['qt-rss-reader', 'video-to-ascii', 'boids-simulation'],
  );
  for (const p of entries) {
    const repo =
      p.slug === 'periodic-table-3d'
        ? 'periodic-table-3D'
        : p.slug === 'kineticbox-1d'
          ? 'kinetic-box-1d'
          : p.slug;
    assert.equal(p.source, `https://github.com/ignabelitzky/${repo}`);
    for (const locale of ['en', 'es']) {
      assert.ok(p.translations[locale].context);
      assert.ok(p.translations[locale].engineeringFocus);
      assert.ok(p.translations[locale].role);
    }
  }
  const research = entries.find((p) => p.slug === 'kineticbox-1d');
  assert.deepEqual(research.research.authors, [
    'Silvina Limandri',
    'Silvina Segui',
    'Bruno Castellano',
    'Ignacio Belitzky',
    'Gustavo Castellano',
  ]);
  assert.equal(
    projectSchema.safeParse({
      ...research,
      research: { ...research.research, authors: [...research.research.authors].reverse() },
    }).success,
    false,
  );
  assert.match(research.translations.en.role, /small contribution/);
  assert.match(research.translations.en.role, /vast majority/);
  assert.match(research.translations.es.role, /pequeña|pequeño/);
});
test('Six curated experiments validate and link to exact lowercase source directories', () => {
  const base = new URL('../src/content/experiments/', import.meta.url);
  const experiments = readdirSync(base)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(readFileSync(new URL(file, base), 'utf8')))
    .sort((a, b) => a.order - b.order);
  assert.equal(experiments.length, 6);
  for (const entry of experiments) assert.equal(experimentSchema.safeParse(entry).success, true);
  assert.deepEqual(
    experiments.filter((e) => e.status === 'highlight').map((e) => e.slug),
    ['reaction-diffusion', 'ray-casting', 'double-pendulum', 'smart-rockets'],
  );
  assert.equal(experiments[4].status, 'experimental');
  assert.equal(experiments[5].status, 'prototype');
  assert.equal(
    experimentSchema.safeParse({
      ...experiments[0],
      source: 'https://github.com/ignabelitzky/tiny-programs/tree/main/Other',
    }).success,
    false,
  );
  assert.equal(
    experimentSchema.safeParse({
      ...experiments[0],
      recording: 'https://evil.example/watch?v=qhOWHsmHPQg',
    }).success,
    false,
  );
});
const fixture = {
  slug: 'schema-fixture',
  translationKey: 'schema-fixture',
  locale: 'en',
  title: 'Schema fixture (test only)',
  description: 'Test fixture, never published.',
  author: 'Ignacio Belitzky',
  pubDate: '2020-01-02',
};
test('Article schema defaults to draft and rejects malformed metadata', () => {
  const valid = articleSchema.parse(fixture);
  assert.equal(valid.draft, true);
  assert.equal(isPublished(valid, new Date('2021-01-01')), false);
  for (const change of [
    { author: 'Someone else' },
    { locale: 'pt' },
    { slug: '../escape' },
    { pubDate: 'not-a-date' },
    { pubDate: '2020-02-31' },
    { updatedDate: '2019-01-01' },
    { description: '   ' },
  ])
    assert.equal(articleSchema.safeParse({ ...fixture, ...change }).success, false);
  assert.equal(articleSchema.safeParse({ ...fixture, updatedDate: '2020-01-03' }).success, true);
});
test('Article publication excludes drafts and future entries, and detects route collisions', () => {
  const article = articleSchema.parse({ ...fixture, draft: false });
  assert.equal(isPublished(article, new Date('2020-01-01')), false);
  assert.equal(isPublished(article, new Date('2020-01-02')), true);
  assert.throws(() => validateArticles([{ data: article }, { data: article }]), /Duplicate/);
  const differentSlug = { ...article, locale: 'es', slug: 'different' };
  assert.throws(
    () => validateArticles([{ data: article }, { data: differentSlug }]),
    /stable slug/,
  );
});
test('Article language links use published translations and fall back safely', () => {
  const en = { data: articleSchema.parse({ ...fixture, draft: false }) };
  const es = { data: articleSchema.parse({ ...fixture, locale: 'es', draft: false }) };
  assert.deepEqual(articleAlternates(en, [en, es]), {
    en: '/writing/schema-fixture/',
    es: '/es/writing/schema-fixture/',
  });
  const single = articleAlternates(en, [en]);
  assert.equal(single.es, undefined);
  assert.equal(equivalentPath('/writing/schema-fixture/', 'es', Object.values(single)), '/es/');
  assert.equal(formatDate(en.data.pubDate, 'en'), 'January 2, 2020');
  assert.match(formatDate(en.data.pubDate, 'es'), /2 de enero de 2020/);
});
test('Extended editorial labels are paired and unavailable CV has no UI target', () => {
  assert.deepEqual(Object.keys(editorial.en).sort(), Object.keys(editorial.es).sort());
  assert.equal(availableCV('en'), null);
  assert.equal(availableCV('es'), null);
  assert.match(editorial.es.dacor_text, /Desde 2023/);
});
