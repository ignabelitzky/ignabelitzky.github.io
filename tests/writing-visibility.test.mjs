import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  cpSync,
  symlinkSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

test('Actual navigation stays hidden for draft/future-only locale and appears for a published locale', () => {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const temp = mkdtempSync(join(tmpdir(), 'ib-writing-nav-'));
  try {
    for (const name of ['src', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json'])
      cpSync(join(root, name), join(temp, name), { recursive: true });
    symlinkSync(
      join(root, 'node_modules'),
      join(temp, 'node_modules'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    const articles = join(temp, 'src/content/articles');
    mkdirSync(articles, { recursive: true });
    const fixture = (locale, slug, draft, date) =>
      `---\nslug: ${slug}\ntranslationKey: ${slug}\nlocale: ${locale}\ntitle: "Navigation test fixture"\ndescription: "Test only."\nauthor: Ignacio Belitzky\npubDate: "${date}"\ndraft: ${draft}\n---\n\nTest only.\n`;
    writeFileSync(join(articles, 'draft-es.md'), fixture('es', 'draft-only', true, '2020-01-01'));
    writeFileSync(
      join(articles, 'future-es.md'),
      fixture('es', 'future-only', false, '9999-01-01'),
    );
    writeFileSync(
      join(articles, 'published-en.md'),
      fixture('en', 'published-only', false, '2020-01-01'),
    );
    const pkg = JSON.parse(readFileSync(join(root, 'node_modules/astro/package.json'), 'utf8'));
    const result = spawnSync(
      process.execPath,
      [join(root, 'node_modules/astro', pkg.bin.astro), 'build'],
      {
        cwd: temp,
        encoding: 'utf8',
        env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
        timeout: 60000,
      },
    );
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(readFileSync(join(temp, 'dist/index.html'), 'utf8'), /href="\/writing\/"/);
    assert.doesNotMatch(
      readFileSync(join(temp, 'dist/es/index.html'), 'utf8'),
      /href="\/es\/writing\/"/,
    );
    assert.match(
      readFileSync(join(temp, 'dist/es/writing/index.html'), 'utf8'),
      /Todavía no hay artículos publicados/,
    );
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
