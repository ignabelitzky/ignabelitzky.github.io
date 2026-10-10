import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, readdirSync } from 'node:fs';
import { ui } from '../../src/i18n/ui.ts';
import { routePath, detailPath, type Locale, type CoreRoute } from '../../src/i18n/routes.ts';
import { site } from '../../src/data/site.ts';
import { projectSchema } from '../../src/lib/content-schema.ts';

const projectDirectory = new URL('../../src/content/projects/', import.meta.url);
const projects = readdirSync(projectDirectory)
  .filter((name) => name.endsWith('.json'))
  .map((name) =>
    projectSchema.parse(JSON.parse(readFileSync(new URL(name, projectDirectory), 'utf8'))),
  )
  .sort((a, b) => a.order - b.order);
const core: CoreRoute[] = ['home', 'projects', 'gallery', 'about', 'writing', 'contact'];
const pages = (['en', 'es'] as const).flatMap((locale) => [
  ...core.map((route) => ({
    locale,
    path: routePath(locale, route),
    heading:
      route === 'home'
        ? ui[locale].hero
        : route === 'contact'
          ? ui[locale].contactHeading
          : ui[locale].titles[route],
    error: false,
  })),
  ...projects.map((project) => ({
    locale,
    path: detailPath(locale, 'projects', project.slug),
    heading: project.name,
    error: false,
  })),
  { locale, path: routePath(locale, 'notFound'), heading: ui[locale].notFound, error: true },
]);

async function navigation(page: Page) {
  if ((page.viewportSize()?.width ?? 1440) < 1024) {
    await page.locator('.mobile-menu summary').click();
    return page.locator('.mobile-nav');
  }
  return page.locator('.nav');
}

for (const entry of pages) {
  test(`route ${entry.path}: content, layout, privacy, WCAG scan`, async ({ page }, testInfo) => {
    const runtimeErrors: string[] = [];
    const remoteRequests: string[] = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('request', (request) => {
      if (new URL(request.url()).origin !== 'http://127.0.0.1:4321')
        remoteRequests.push(request.url());
    });
    const response = await page.goto(entry.path);
    expect(response).not.toBeNull();
    expect(entry.error ? [200, 404] : [200]).toContain(response!.status());
    await expect(page.locator('html')).toHaveAttribute('lang', entry.locale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(entry.heading);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      site.indexable && !entry.error ? 'index, follow' : 'noindex, nofollow',
    );
    await expect(page.getByRole('main')).toHaveCount(1);
    // axe flags a collapsed popup relationship as incomplete: check the real target.
    const controls = await page.getByRole('combobox').getAttribute('aria-controls');
    await expect(page.locator(`[id="${controls}"]`)).toHaveCount(1);
    await expect(page.locator(`[id="${controls}"]`)).toHaveAttribute('role', 'listbox');
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      failedImages: [...document.images]
        .filter((image) => !image.complete || !image.naturalWidth)
        .map((image) => image.src),
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width + 1);
    expect(metrics.failedImages).toEqual([]);
    const nav = await navigation(page);
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link')).toHaveCount(4);
    const copy = await page.locator('main').innerText();
    expect(copy).not.toMatch(
      /Moki|Software Engineer|Download CV|Descargar CV|Internal notes|Notas internas/i,
    );
    if (!entry.error) {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        site.origin + entry.path,
      );
      const switched = entry.locale === 'en' ? '/es' + entry.path : entry.path.replace(/^\/es/, '');
      await expect(page.locator('header .lang')).toHaveAttribute('href', switched);
    }
    // Analyze the open mobile menu too, not only the collapsed shell.
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(accessibility, null, 2),
      contentType: 'application/json',
    });
    expect(accessibility.violations).toEqual([]);
    if ((page.viewportSize()?.width ?? 1440) < 1024) {
      await page.locator('.mobile-menu summary').click();
      // Open disclosure temporarily overlays page text; also scan the closed layout.
      const closed = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      await testInfo.attach('closed-menu-axe-results.json', {
        body: JSON.stringify(closed, null, 2),
        contentType: 'application/json',
      });
      expect(closed.violations).toEqual([]);
    }
    await testInfo.attach('page.png', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
    expect(runtimeErrors).toEqual([]);
    expect(remoteRequests).toEqual([]);
  });
}

test('Robots and sitemap follow the configured release indexing policy', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text).toContain(`Sitemap: ${site.origin}/sitemap-index.xml`);
  if (site.indexable) {
    expect(text).toContain('Allow: /');
    expect(text).not.toContain('Disallow: /');
  } else expect(text).toContain('Disallow: /');
  const sitemap = await request.get('/sitemap-0.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain('/404');
  expect(await sitemap.text()).toContain(`${site.origin}/es/`);
});

for (const locale of ['en', 'es'] as const) {
  test(`${locale}: all project detail/source paths and real empty writing`, async ({ page }) => {
    await page.goto(routePath(locale, 'projects'));
    for (const project of projects) {
      await expect(
        page.locator('main .project-row h3').getByRole('link', { name: project.name, exact: true }),
      ).toHaveAttribute('href', detailPath(locale, 'projects', project.slug));
      await expect(page.locator(`main a[href="${project.source}"]`)).toHaveCount(1);
    }
    await page.goto(routePath(locale, 'writing'));
    await expect(
      page.getByRole('heading', { name: ui[locale].writingEmpty, exact: true }),
    ).toBeVisible();
    await expect(page.locator('main article')).toHaveCount(0);
    await page.goto(routePath(locale, 'contact'));
    await expect(page.locator(`main a[href="mailto:${site.email}"]`)).toHaveText(site.email);
    await expect(page.locator(`main a[href="${site.github}"]`)).toBeVisible();
  });
  test(`${locale}: navigation changes locale and preserves a real project`, async ({ page }) => {
    await page.goto(detailPath(locale, 'projects', 'qt-rss-reader'));
    await page.locator('header .lang').click();
    const target: Locale = locale === 'en' ? 'es' : 'en';
    await expect(page).toHaveURL(new RegExp(detailPath(target, 'projects', 'qt-rss-reader') + '$'));
    await expect(page.locator('html')).toHaveAttribute('lang', target);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Qt RSS Reader');
  });
}

test('Theme: OS preference, explicit overrides, reload, navigation and System reset', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const select = page.locator('[data-theme-select]');
  const choose = async (value: string) => {
    await select.click();
    await page.locator(`[data-theme-option="${value}"]`).click();
  };
  await expect(select).toHaveAttribute('data-value', 'system');
  expect(
    await page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor),
  ).toBe('rgb(7, 28, 19)');
  await choose('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(select).toHaveAttribute('data-value', 'light');
  await page.goto('/es/about/');
  await expect(select).toHaveAttribute('data-value', 'light');
  expect(
    await page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor),
  ).toBe('rgb(245, 250, 247)');
  await choose('dark');
  await page.reload();
  await expect(select).toHaveAttribute('data-value', 'dark');
  await choose('system');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  await page.emulateMedia({ colorScheme: 'light' });
  expect(
    await page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor),
  ).toBe('rgb(245, 250, 247)');
});

test('Keyboard: skip to main, visible focus and native navigation disclosure', async ({
  page,
}, testInfo) => {
  await page.goto('/es/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await expect(page.locator('.skip')).toBeVisible();
  expect(
    await page.locator('.skip').evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  if ((page.viewportSize()?.width ?? 1440) < 1024) {
    const summary = page.locator('.mobile-menu summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.mobile-menu')).toHaveAttribute('open', '');
    await page.keyboard.press('Tab');
    await expect(page.locator('.mobile-nav a').first()).toBeFocused();
    await summary.focus();
    await page.keyboard.press('Space');
    await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open');
  }
  await testInfo.attach('keyboard-focus.png', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('Layout reflow at 320, 360, 390, 768, 1280 and 1440 CSS pixels, in both languages', async ({
  page,
}) => {
  for (const width of [320, 360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      '/',
      '/es/',
      '/projects/',
      '/es/gallery/',
      '/es/projects/kineticbox-1d/',
      '/es/contact/',
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
        ),
        `${path} at ${width}`,
      ).toBe(true);
    }
  }
});

test('JavaScript-disabled core navigation, content and OS-aware theme remain usable', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: testInfo.project.use.viewport,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4321/es/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(ui.es.hero);
    await expect(page.locator('[data-theme-control]')).toBeHidden();
    const nav = await navigation(page);
    await nav.getByRole('link', { name: 'Proyectos', exact: true }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4321/es/projects/');
    await expect(page.locator('main .project-row')).toHaveCount(9);
  } finally {
    await context.close();
  }
});

test('Unknown URLs have a 404 response and useful custom-error navigation', async ({ page }) => {
  for (const path of ['/missing-page/', '/es/missing-page/']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.locator('main h1')).toHaveText(/Page not found|Página no encontrada/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('main a[href="/"]')).toBeVisible();
  }
});

test('Sticky header, real Inter and exact full-color mark survive scrolling', async ({ page }) => {
  await page.goto('/es/projects/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator('body').evaluate((node) => getComputedStyle(node).fontFamily)).toMatch(
    /Inter/,
  );
  await expect(page.locator('header .brand-logo')).toHaveAttribute(
    'src',
    '/brand/phosphor-web.svg',
  );
  await expect(page.locator('header .brand-logo')).toHaveAttribute('width', '48');
  await page.evaluate(() => window.scrollTo(0, 700));
  expect((await page.locator('header').boundingBox())?.y).toBe(0);
  await page.locator('#web').evaluate((node) => node.scrollIntoView());
  const target = await page.locator('#web').boundingBox();
  const header = await page.locator('header').boundingBox();
  expect(target!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
});

test('Theme popup keyboard selection, Escape, visible labels and one focus boundary', async ({
  page,
}, testInfo) => {
  await page.goto('/es/');
  const trigger = page.getByRole('combobox');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('End');
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('data-value', 'system');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('data-value', 'dark');
  await expect(trigger).toContainText('Oscuro');
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(page.locator('[data-theme-select]')).toHaveCount(1);
  await trigger.click();
  await expect(page.getByRole('option', { name: 'Oscuro' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  await testInfo.attach('popup-axe-results.json', {
    body: JSON.stringify(accessibility, null, 2),
    contentType: 'application/json',
  });
  expect(accessibility.violations).toEqual([]);
});

test('Theme still works when storage access is denied and falls back to System on reload', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage denied in test');
      },
    });
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const trigger = page.getByRole('combobox');
  await expect(trigger).toHaveAttribute('data-value', 'system');
  await trigger.click();
  await page.getByRole('option', { name: 'Light', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(trigger).toHaveAttribute('data-value', 'system');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
});

test('Mobile menu closes with Escape and restores focus to its summary', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/es/');
  const summary = page.locator('.mobile-menu summary');
  await summary.click();
  await page.locator('.mobile-nav a').first().focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open');
  await expect(summary).toBeFocused();
});

test('Theme popup: localized typeahead, Tab cancellation, outside dismissal and touch selection', async ({
  page,
}, testInfo) => {
  for (const locale of ['en', 'es'] as const) {
    await page.goto(routePath(locale, 'home'));
    const trigger = page.getByRole('combobox');
    const select = async (theme: string) => {
      if (testInfo.project.use.hasTouch) {
        await trigger.tap();
        await page.locator(`[data-theme-option="${theme}"]`).tap();
      } else {
        await trigger.click();
        await page.locator(`[data-theme-option="${theme}"]`).click();
      }
    };
    await select('system');
    await trigger.focus();
    await page.keyboard.press(locale === 'en' ? 'd' : 'o');
    await expect(trigger).toHaveAttribute('aria-activedescendant', 'theme-option-dark');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(trigger).toHaveAttribute('data-value', 'system');
    await expect(trigger).not.toBeFocused();
    await trigger.click();
    await page.locator('.intro').click();
    await expect(page.getByRole('listbox')).toBeHidden();
    await select('light');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await select('dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await select('system');
    await trigger.focus();
    await page.keyboard.press('Enter');
    const popup = await page.getByRole('listbox').boundingBox();
    expect(popup!.x).toBeGreaterThanOrEqual(0);
    expect(popup!.x + popup!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    await testInfo.attach(`${locale}-theme-popup.png`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.fonts.check('400 16px Inter'))).toBe(true);
    expect(await page.evaluate(() => document.fonts.check('600 16px Inter'))).toBe(true);
  }
});
