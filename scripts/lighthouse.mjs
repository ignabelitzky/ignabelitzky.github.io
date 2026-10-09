import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { site } from '../src/data/site.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(root, process.env.QA_EVIDENCE_DIR ?? 'evidence/phase5', 'lighthouse');
mkdirSync(output, { recursive: true });
const chromePath = process.env.QA_CHROMIUM_EXECUTABLE ?? chromium.executablePath();
if (!existsSync(chromePath)) {
  writeFileSync(
    resolve(output, 'execution-status.json'),
    JSON.stringify(
      {
        status: 'not run',
        reason:
          'Chromium is not installed. Browser installation/execution needs an authorized environment.',
        scores: null,
      },
      null,
      2,
    ) + '\n',
  );
  throw new Error(
    'No Chromium binary. Run the documented browser setup on an authorized machine; no score was produced.',
  );
}
async function availablePort() {
  const server = createServer();
  await new Promise((done, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', done);
  });
  const address = server.address();
  const port = address.port;
  await new Promise((done) => server.close(done));
  return port;
}
async function waitFor(url, child) {
  for (let attempt = 0; attempt < 150; attempt++) {
    if (child.exitCode !== null) throw new Error('Local QA process exited before becoming ready');
    try {
      const result = await fetch(url);
      if (result.ok) return;
    } catch {
      /* Local readiness only. */
    }
    await new Promise((done) => setTimeout(done, 100));
  }
  throw new Error(`Local QA process did not become ready: ${url}`);
}
const astroPort = await availablePort();
const chromePort = await availablePort();
const preview = spawn(
  process.execPath,
  [
    resolve(root, 'node_modules/astro/bin/astro.mjs'),
    'preview',
    '--ignore-lock',
    '--host',
    '127.0.0.1',
    '--port',
    String(astroPort),
  ],
  { cwd: root, stdio: 'ignore', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } },
);
const chrome = spawn(
  chromePath,
  [
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    ...(process.env.QA_CHROMIUM_EXECUTABLE ? ['--disable-gpu'] : []),
    `--remote-debugging-port=${chromePort}`,
    '--remote-debugging-address=127.0.0.1',
    '--user-data-dir=' + resolve(output, '.chrome-profile'),
    'about:blank',
  ],
  { stdio: 'ignore' },
);
const results = [];
try {
  await waitFor(`http://127.0.0.1:${astroPort}/`, preview);
  await waitFor(`http://127.0.0.1:${chromePort}/json/version`, chrome);
  for (const [name, path] of [
    ['home-en', '/'],
    ['home-es', '/es/'],
    ['qt-detail-en', '/projects/qt-rss-reader/'],
    ['gallery-es', '/es/gallery/'],
    ['writing-en', '/writing/'],
  ]) {
    const audit = await lighthouse(`http://127.0.0.1:${astroPort}${path}`, {
      port: chromePort,
      logLevel: 'error',
      output: ['html', 'json'],
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    if (!audit || audit.lhr.runtimeError)
      throw new Error(
        `${path}: Lighthouse failed: ${audit?.lhr.runtimeError?.message ?? 'no report'}`,
      );
    writeFileSync(resolve(output, `${name}.html`), audit.report[0]);
    writeFileSync(resolve(output, `${name}.json`), audit.report[1]);
    const scores = Object.fromEntries(
      Object.entries(audit.lhr.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    );
    const misses = Object.entries(audit.lhr.audits)
      .filter(([, value]) => value.score !== null && value.score < 1)
      .map(([id, value]) => ({
        id,
        title: value.title,
        score: value.score,
        explanation: value.explanation,
      }));
    results.push({
      path,
      mode: 'mobile (Lighthouse defaults, simulated throttling)',
      scores,
      misses,
    });
    console.log(path, JSON.stringify(scores));
  }
  writeFileSync(
    resolve(output, 'summary.json'),
    JSON.stringify(
      {
        status: 'executed',
        lighthouseVersion: results.length ? 'see full LHR reports' : null,
        results,
        indexingPolicy: site.indexable ? 'indexable release' : 'prelaunch noindex',
        indexingNote: site.indexable
          ? 'Owner-authorized indexable release. SEO is included in the 90-point gate.'
          : 'Prelaunch noindex is intentional; SEO is recorded exactly but indexing remains disabled.',
      },
      null,
      2,
    ) + '\n',
  );
  // An authorized indexable release must meet the SEO target as well.
  if (
    results.some((r) =>
      ['performance', 'accessibility', 'best-practices', ...(site.indexable ? ['seo'] : [])].some(
        (key) => r.scores[key] < 90,
      ),
    )
  )
    process.exitCode = 1;
} finally {
  preview.kill();
  chrome.kill();
}
