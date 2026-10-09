import { defineConfig } from '@playwright/test';

const evidenceDirectory = process.env.QA_EVIDENCE_DIR ?? 'evidence/phase5';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 5_000 },
  outputDir: `${evidenceDirectory}/browser/test-results`,
  reporter: [
    ['list'],
    ['json', { outputFile: `${evidenceDirectory}/browser/results.json` }],
    ['html', { outputFolder: `${evidenceDirectory}/browser/html-report`, open: 'never' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    // Optional local QA binary when the default Playwright CDN is unavailable.
    launchOptions: process.env.QA_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.QA_CHROMIUM_EXECUTABLE, args: ['--disable-gpu'] }
      : {},
  },
  projects: [
    {
      name: 'desktop-light',
      use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'light' },
    },
    { name: 'desktop-dark', use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' } },
    {
      name: 'mobile-light',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
        colorScheme: 'light',
      },
    },
    {
      name: 'mobile-dark',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
        colorScheme: 'dark',
      },
    },
  ],
  webServer: {
    // Keep Astro's agent-aware preview in the foreground so Playwright owns it.
    command: 'npm run preview -- --port 4321 --ignore-lock',
    env: { ASTRO_TELEMETRY_DISABLED: '1' },
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: false,
    timeout: 30_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
