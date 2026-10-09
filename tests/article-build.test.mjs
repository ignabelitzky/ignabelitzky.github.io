import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  cpSync,
  symlinkSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('The actual article template builds Markdown, pairs locales, and excludes draft/future fixtures', () => {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const temporary = mkdtempSync(join(tmpdir(), 'ib-article-fixture-'));
  try {
    for (const name of ['src', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json'])
      cpSync(join(root, name), join(temporary, name), { recursive: true });
    symlinkSync(
      join(root, 'node_modules'),
      join(temporary, 'node_modules'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    const articles = join(temporary, 'src/content/articles');
    mkdirSync(articles, { recursive: true });
    const fixture = (locale, slug, draft, date) =>
      `---\nslug: ${slug}\ntranslationKey: ${slug}\nlocale: ${locale}\ntitle: "Article fixture (test only)"\ndescription: "Never published to the portfolio."\nauthor: Ignacio Belitzky\npubDate: "${date}"\ndraft: ${draft}\n---\n\n## Fixture heading\n\nMarkdown **rendering** fixture.\n`;
    for (const locale of ['en', 'es'])
      writeFileSync(
        join(articles, `paired-${locale}.md`),
        fixture(locale, 'test-fixture', false, '2020-01-02'),
      );
    writeFileSync(join(articles, 'draft.md'), fixture('en', 'draft-fixture', true, '2020-01-02'));
    writeFileSync(
      join(articles, 'future.md'),
      fixture('es', 'future-fixture', false, '9999-01-01'),
    );
    writeFileSync(
      join(articles, 'single.md'),
      fixture('en', 'single-fixture', false, '2020-01-02'),
    );
    const astroPackage = JSON.parse(
      readFileSync(join(root, 'node_modules/astro/package.json'), 'utf8'),
    );
    const result = spawnSync(
      process.execPath,
      [join(root, 'node_modules/astro', astroPackage.bin.astro), 'build'],
      {
        cwd: temporary,
        encoding: 'utf8',
        env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
        timeout: 60000,
      },
    );
    assert.equal(result.status, 0, (result.stdout ?? '') + (result.stderr ?? ''));
    const dist = join(temporary, 'dist');
    assert.ok(
      existsSync(join(dist, 'writing/test-fixture/index.html')),
      result.stdout + result.stderr,
    );
    assert.ok(
      existsSync(join(dist, 'es/writing/test-fixture/index.html')),
      result.stdout + result.stderr,
    );
    assert.ok(
      existsSync(join(dist, 'writing/single-fixture/index.html')),
      result.stdout + result.stderr,
    );
    const en = readFileSync(join(dist, 'writing/test-fixture/index.html'), 'utf8');
    const es = readFileSync(join(dist, 'es/writing/test-fixture/index.html'), 'utf8');
    const single = readFileSync(join(dist, 'writing/single-fixture/index.html'), 'utf8');
    assert.match(en, /<strong>rendering<\/strong>/);
    assert.match(en, /property="og:type" content="article"/);
    assert.match(en, /name="author" content="Ignacio Belitzky"/);
    assert.match(en, /article:published_time/);
    assert.match(en, /class="lang" href="\/es\/writing\/test-fixture\/"/);
    assert.match(es, /class="lang" href="\/writing\/test-fixture\/"/);
    assert.match(es, /2 de enero de 2020/);
    assert.match(single, /class="lang" href="\/es\/"/);
    assert.doesNotMatch(single, /<link[^>]+hreflang="es"/);
    assert.doesNotMatch(single, /og:locale:alternate/);
    assert.equal(existsSync(join(dist, 'writing/draft-fixture/index.html')), false);
    assert.equal(existsSync(join(dist, 'es/writing/future-fixture/index.html')), false);
    assert.match(
      readFileSync(join(dist, 'writing/index.html'), 'utf8'),
      /\/writing\/test-fixture\//,
    );
    assert.match(
      readFileSync(join(dist, 'es/writing/index.html'), 'utf8'),
      /\/es\/writing\/test-fixture\//,
    );
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
