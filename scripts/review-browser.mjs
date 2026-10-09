/* global document, getComputedStyle, innerHeight, innerWidth, window, DOMException, matchMedia */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(root, 'evidence/phase5/manual');
mkdirSync(output, { recursive: true });
const socket = createServer();
await new Promise((done) => socket.listen(0, '127.0.0.1', done));
const port = socket.address().port;
await new Promise((done) => socket.close(done));
const origin = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  [
    resolve(root, 'node_modules/astro/bin/astro.mjs'),
    'preview',
    '--ignore-lock',
    '--host',
    '127.0.0.1',
    '--port',
    String(port),
  ],
  { cwd: root, stdio: 'ignore', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } },
);
let browser;
const observations = [];
const screenshots = [];
async function capture(page, name, fullPage = true) {
  await page.screenshot({ path: resolve(output, `${name}.png`), fullPage });
  screenshots.push(`${name}.png`);
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 150; attempt++) {
    if (server.exitCode !== null) throw new Error('Production preview exited');
    try {
      if ((await fetch(origin)).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Preview readiness only. */
    }
    await new Promise((done) => setTimeout(done, 100));
  }
  assert(ready, 'Production preview ready');
  browser = await chromium.launch({
    ...(process.env.QA_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.QA_CHROMIUM_EXECUTABLE, args: ['--disable-gpu'] }
      : {}),
  });
  for (const [name, locale, width, colorScheme] of [
    ['desktop-en-light', 'en', 1440, 'light'],
    ['desktop-es-dark', 'es', 1440, 'dark'],
    ['mobile-es-light', 'es', 390, 'light'],
    ['mobile-en-dark', 'en', 390, 'dark'],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      colorScheme,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const prefix = locale === 'es' ? '/es' : '';
    await page.goto(`${origin}${prefix}/`);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip').evaluate((el) => el === document.activeElement), true);
    await capture(page, `${name}-skip-focus`, false);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#main').evaluate((el) => el === document.activeElement), true);
    // Review the native keyboard path as it is presented, including the footer select.
    await page.goto(`${origin}${prefix}/`);
    const keyboard = [];
    for (let index = 0; index < 65; index++) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const element = document.activeElement;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          name: element.getAttribute('aria-label') ?? element.textContent?.trim().slice(0, 120),
          href: element.getAttribute('href'),
          outline: `${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`,
          visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight,
        };
      });
      if (index && (focus.href === '#main' || focus.tag === 'BODY')) break;
      keyboard.push(focus);
      assert(focus.visible, `${name}: focused control is visible`);
      assert(!focus.outline.includes(' none '), `${name}: visible keyboard outline`);
      if (focus.tag === 'SELECT') await capture(page, `${name}-theme-focus`, false);
      if (width < 768 && focus.tag === 'SUMMARY') {
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.mobile-menu').getAttribute('open'), '');
        await capture(page, `${name}-menu-keyboard`, false);
      }
    }
    observations.push({ name, keyboard, keyboardCycleCompleted: keyboard.length < 65 });
    const arrows = [];
    // axe marks non-text arrow glyphs as incomplete. Check their actual inherited
    // colors against the painted ancestor, rather than treating "incomplete" as a pass.
    for (const path of [
      '',
      'projects/',
      'gallery/',
      'about/',
      'writing/',
      'projects/tiny-programs/',
    ]) {
      await page.goto(`${origin}${prefix}/${path}`);
      const colors = await page.evaluate(() =>
        [...document.querySelectorAll('a span[aria-hidden="true"]')].map((element) => {
          let ancestor = element;
          let background = 'rgba(0, 0, 0, 0)';
          while (ancestor) {
            background = getComputedStyle(ancestor).backgroundColor;
            if (background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent') break;
            ancestor = ancestor.parentElement;
          }
          return {
            glyph: element.textContent,
            foreground: getComputedStyle(element).color,
            background,
            backgroundImage: ancestor ? getComputedStyle(ancestor).backgroundImage : 'none',
          };
        }),
      );
      const luminance = (css) => {
        const [r, g, b] = css
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map(Number)
          .map((channel) => {
            const value = channel / 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
          });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      for (const color of colors) {
        assert.equal(color.backgroundImage, 'none', 'Arrow background is a known solid color');
        const a = luminance(color.foreground);
        const b = luminance(color.background);
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        assert(ratio >= 4.5, 'Redundant arrow glyph contrast also exceeds normal text threshold');
        arrows.push({ path: `${prefix}/${path}`, ...color, ratio });
      }
    }
    observations.push({ name, reviewedArrowGlyphs: arrows });
    for (const [slug, suffix] of [
      ['projects/', 'projects'],
      ['gallery/', 'gallery'],
      ['projects/kineticbox-1d/', 'research'],
      ['contact/', 'contact'],
    ]) {
      await page.goto(`${origin}${prefix}/${slug}`);
      await capture(page, `${name}-${suffix}`);
    }
    const semantics = await page.locator('body').ariaSnapshot();
    writeFileSync(resolve(output, `${name}-contact-aria.yml`), semantics);
    assert.equal(await page.locator('html').getAttribute('lang'), locale);
    assert.equal(
      await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior),
      'auto',
    );
    assert.equal((await context.cookies()).length, 0);
    observations.push({ name, reducedMotionScroll: 'auto', language: locale, cookies: 0 });
    await context.close();
  }
  const denied = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await denied.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Storage disabled for QA', 'SecurityError');
      },
    });
  });
  const storagePage = await denied.newPage();
  const errors = [];
  storagePage.on('pageerror', (error) => errors.push(error.message));
  await storagePage.goto(`${origin}/es/`);
  await storagePage.locator('[data-theme-select]').selectOption('dark');
  assert.equal(await storagePage.locator('html').getAttribute('data-theme'), 'dark');
  assert.deepEqual(errors, []);
  await capture(storagePage, 'storage-denied-dark');
  observations.push({ name: 'storage denied', themeSelectionWorks: true, runtimeErrors: errors });
  await denied.close();
  const forced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    forcedColors: 'active',
    reducedMotion: 'reduce',
  });
  const forcedPage = await forced.newPage();
  await forcedPage.goto(`${origin}/es/`);
  await forcedPage.locator('.mobile-menu summary').focus();
  await forcedPage.keyboard.press('Enter');
  await forcedPage.keyboard.press('Tab');
  await capture(forcedPage, 'forced-colors-menu-focus', false);
  observations.push({
    name: 'forced colors',
    active: await forcedPage.evaluate(() => matchMedia('(forced-colors: active)').matches),
    focusedControl: await forcedPage.evaluate(() => document.activeElement.textContent?.trim()),
  });
  await forced.close();
  const zoom = await browser.newContext({
    viewport: { width: 720, height: 500 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const zoomPage = await zoom.newPage();
  for (const path of ['/es/', '/es/projects/kineticbox-1d/', '/es/contact/']) {
    await zoomPage.goto(origin + path);
    const overflow = await zoomPage.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    assert.equal(overflow, false);
    await capture(
      zoomPage,
      'zoom-equivalent-' +
        (path === '/es/' ? 'home' : path.includes('contact') ? 'contact' : 'research'),
    );
  }
  observations.push({
    name: '200 percent zoom equivalent',
    method:
      '720 CSS pixels at DPR 2 in a 1440 physical-pixel viewport; browser chrome zoom UI not available',
    overflow: false,
  });
  await zoom.close();
  const mime = [];
  const probe = await browser.newPage();
  await probe.goto(origin);
  const assets = await probe.evaluate(() => [
    document.querySelector('link[rel="stylesheet"]')?.getAttribute('href'),
    document.querySelector('img')?.getAttribute('src'),
    '/favicon.svg',
    '/robots.txt',
    '/sitemap-index.xml',
  ]);
  for (const asset of assets.filter(Boolean)) {
    const response = await fetch(origin + asset);
    mime.push({ path: asset, status: response.status, type: response.headers.get('content-type') });
    assert.equal(response.status, 200);
  }
  observations.push({ name: 'local production asset MIME', assets: mime });
  writeFileSync(
    resolve(output, 'observations.json'),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        browser: browser.version(),
        observations,
        screenshots,
        limits:
          'Agent-driven keyboard observations, real screenshots and ARIA tree; no human assistive-technology speech review or real browser chrome zoom UI. Screenshot visual assessment is recorded separately after inspection.',
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    `Captured ${screenshots.length} review screenshots and ${observations.length} scenario records.`,
  );
} finally {
  if (browser) await browser.close();
  server.kill();
}
