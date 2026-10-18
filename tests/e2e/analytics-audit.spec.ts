import { test, expect } from '@playwright/test';
const key = 'ib-analytics-consent-v1';
const secondPage = '/es/about/';
const panel = '[data-consent]';
const accept = '[data-consent-choice="accepted"]';
const reject = '[data-consent-choice="rejected"]';
const settings = '[data-cookie-settings]';
const tracking =
  /https:\/\/[^/]*(?:google-analytics\.com|googletagmanager\.com|analytics\.google\.com)\//;

test('opt-in, persisted decisions, navigation, current choice, revocation and cookie cleanup', async ({
  page,
}) => {
  const requests: string[] = [];
  await page.route(tracking, async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ contentType: 'application/javascript', body: '' });
  });
  await page.goto('/');
  await expect(page.locator(panel)).toBeVisible();
  expect(requests).toEqual([]);
  await page.locator(reject).click();
  await page.reload();
  await expect(page.locator(panel)).toBeHidden();
  await page.goto(secondPage);
  await expect(page.locator(panel)).toBeHidden();
  expect(requests).toEqual([]);
  await page.locator(settings).click();
  await expect(page.locator(reject)).toHaveAttribute('aria-pressed', 'true');
  await page.locator(accept).click();
  await expect.poll(() => requests.length).toBe(1);
  await page.locator(settings).click();
  await expect(page.locator(accept)).toHaveAttribute('aria-pressed', 'true');
  await page.locator(accept).click();
  expect(requests).toHaveLength(1);
  const queue = await page.evaluate(() => {
    const w = window as unknown as { dataLayer: IArguments[] };
    return w.dataLayer.map((item) => ({
      kind: Object.prototype.toString.call(item),
      command: item[0],
    }));
  });
  expect(queue.filter((item) => item.command === 'config')).toEqual([
    { kind: '[object Arguments]', command: 'config' },
  ]);
  await page.reload();
  await expect.poll(() => requests.length).toBe(2);
  await expect(page.locator(panel)).toBeHidden();
  await page.goto('/');
  await expect.poll(() => requests.length).toBe(3);
  await page.evaluate(() => {
    document.cookie = '_ga=sample;path=/';
    document.cookie = '_ga_sample=value;path=/';
    document.cookie = 'necessary=keep;path=/';
  });
  await page.locator(settings).click();
  await page.locator(reject).click();
  await page.waitForTimeout(500);
  await expect(page.locator(panel)).toBeHidden();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe('rejected');
  expect(await page.evaluate(() => document.cookie)).not.toMatch(/_ga[= _]/);
  expect(await page.evaluate(() => document.cookie)).toContain('necessary=keep');
  expect(requests).toHaveLength(3);
  await page.locator(settings).click();
  await page.locator(accept).click();
  await expect.poll(() => requests.length).toBe(4);
});

for (const failure of ['getter', 'methods']) {
  test(`storage ${failure} failure stays opt-in and supports session revocation`, async ({
    page,
  }) => {
    const requests: string[] = [];
    await page.route(tracking, async (route) => {
      requests.push(route.request().url());
      await route.fulfill({ body: '' });
    });
    await page.addInitScript((mode) => {
      if (mode === 'getter')
        Object.defineProperty(window, 'localStorage', {
          get() {
            throw new Error('blocked');
          },
        });
      else {
        Storage.prototype.getItem = () => {
          throw new Error('blocked');
        };
        Storage.prototype.setItem = () => {
          throw new Error('blocked');
        };
      }
    }, failure);
    await page.goto('/');
    await expect(page.locator(panel)).toBeVisible();
    expect(requests).toEqual([]);
    await page.locator(reject).click();
    await page.locator(settings).click();
    await page.locator(accept).click();
    await expect.poll(() => requests.length).toBe(1);
    await page.locator(settings).click();
    await page.locator(reject).click();
    await expect(page.locator(panel)).toBeHidden();
    expect(
      await page.evaluate(() =>
        Object.keys(window)
          .filter((k) => k.startsWith('ga-disable-'))
          .some((k) => (window as unknown as Record<string, unknown>)[k] === true),
      ),
    ).toBe(true);
    await page.reload();
    await expect(page.locator(panel)).toBeVisible();
    expect(requests).toHaveLength(1);
  });
}

test('storage removal in another tab revokes an already running tag', async ({ page, context }) => {
  await context.route(tracking, (route) => route.fulfill({ body: '' }));
  await page.goto('/');
  await page.locator(accept).click();
  const other = await context.newPage();
  await other.goto('/');
  await other.evaluate((k) => localStorage.removeItem(k), key);
  await expect(page.locator(panel)).toBeVisible();
  await expect(page.locator('script[data-analytics]')).toHaveCount(0);
});

test('real Google library sends exactly one page_view after acceptance, none before or after revocation', async ({
  page,
}) => {
  const sent: URL[] = [];
  await page.route(
    /https:\/\/[^/]*(?:google-analytics\.com|analytics\.google\.com)\//,
    async (route) => {
      sent.push(new URL(route.request().url()));
      await route.fulfill({ status: 204, body: '' });
    },
  );
  await page.goto('/');
  await page.waitForTimeout(700);
  expect(sent).toEqual([]);
  expect(await page.locator('script[src*="googletagmanager.com"]').count()).toBe(0);
  await page.locator(accept).click();
  await expect
    .poll(() => sent.filter((url) => url.searchParams.get('en') === 'page_view').length, {
      timeout: 20000,
    })
    .toBe(1);
  const id = await page.locator(panel).getAttribute('data-measurement-id');
  expect(sent.every((url) => url.searchParams.get('tid') === id)).toBe(true);
  await page.locator(settings).click();
  await page.locator(accept).click();
  await page.waitForTimeout(700);
  expect(sent.filter((url) => url.searchParams.get('en') === 'page_view')).toHaveLength(1);
  await page.locator(settings).click();
  await page.locator(reject).click();
  await page.waitForTimeout(700);
  const count = sent.length;
  await page.goto(secondPage);
  await page.waitForTimeout(700);
  expect(sent).toHaveLength(count);
});

test('responsive equal-weight actions and keyboard reopening', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(panel)).toBeVisible();
  const actions = await page.locator('[data-consent-choice]').evaluateAll((buttons) =>
    buttons.map((button) => {
      const css = getComputedStyle(button);
      const box = button.getBoundingClientRect();
      return { background: css.backgroundColor, color: css.color, height: box.height };
    }),
  );
  expect(actions[0]).toEqual(actions[1]);
  expect(actions[0]!.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator(reject).click();
  await page.locator(settings).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator(accept)).toBeFocused();
  await page.screenshot({
    path: `evidence/consent-${test.info().project.name}.png`,
    fullPage: false,
  });
});

test('consent text and both actions have readable contrast', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(panel)).toBeVisible();
  const ratios = await page.locator(panel).evaluate((element) => {
    const luminance = (css: string) => {
      const channels = css
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number)
        .map((v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
      return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
    };
    return Array.from(element.querySelectorAll('p,button')).map((child) => {
      const style = getComputedStyle(child);
      const fg = luminance(style.color);
      const bg = luminance(
        child.tagName === 'BUTTON'
          ? style.backgroundColor
          : getComputedStyle(element).backgroundColor,
      );
      return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    });
  });
  for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
});
