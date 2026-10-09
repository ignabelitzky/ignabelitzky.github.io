# Phase 5 browser QA runbook

**Executed 2026-10-09 after explicit owner authorization.** 156/156 actual E2E cases pass; 120 axe scans have zero violations; five Lighthouse mobile reports are saved. The audit used Chromium 148.0.7778.0 headless with Playwright 1.64.0. Read `TEST_REPORT.md` for the exact evidence, incomplete-rule review and limits; a rerun on another browser/host can produce different results. The previous blocked checkpoint is archived, not the current state.

## Standard owner-local setup

Use Node 24.19+ <25, npm 11 and Python 3 (Windows: `py -3`). From the source directory:

```bash
npm ci
npm run validate
npx playwright install chromium
npm run test:e2e
npm run test:lighthouse
node scripts/review-browser.mjs
npm audit
npm run test:links
```

Default browser installation was not successful in this Work run: both installer variants received a 195-byte HTML “Site Unavailable” page from the CDN instead of a ZIP. Do not report that as an installed default browser. The exact non-default setup below was used successfully, independently of the portfolio dependency graph.

Fedora is outside Playwright's documented Debian/Ubuntu Linux support list. This checkpoint does not certify the owner's Fedora installation; use appropriate Fedora libraries or the owner's Windows 11/supported local container. Do not blindly apply Debian apt commands to Fedora. Official [installation/system requirements](https://playwright.dev/docs/intro#system-requirements) remain the default setup reference.

The tests start **production output** with `npm run preview -- --port 4321 --ignore-lock`, localhost only. `--ignore-lock` keeps Astro's agent-aware preview in the foreground; Playwright rejects an occupied/reused base URL, and owns process shutdown. Lighthouse/review runners use separate ephemeral localhost ports and stop their own processes. CLI telemetry is disabled for all audit previews. Run `npm run build` before an independent rerun; never substitute the development server or stale output.

## Exact isolated Chromium fallback used here

This optional Linux QA method downloads a separate exact browser package, with npm install scripts disabled, then decompresses its packaged Brotli binary using Node. It adds no production dependency or browser binary to the portfolio. Existing system libraries/fonts are used. The standard package extractor failed ownership changes on `/tmp/fonts`, so that extractor was not used. The actual binary hash/version and launch flags are in `evidence/phase5/browser-environment.json`; both isolated package manifests are preserved in `evidence/phase5/isolated-browser-package*.json`.

From the portfolio directory, the recorded installation was:

```bash
npm install --prefix ../browser-qa-runtime --save-exact --ignore-scripts --no-fund @sparticuz/chromium@148.0.0
node --input-type=module - <<'JS'
import {createReadStream, createWriteStream, chmodSync} from 'node:fs';
import {createBrotliDecompress} from 'node:zlib';
import {pipeline} from 'node:stream/promises';
const root = '../browser-qa-runtime/';
await pipeline(
  createReadStream(root + 'node_modules/@sparticuz/chromium/bin/chromium.br'),
  createBrotliDecompress(),
  createWriteStream(root + 'chromium'),
);
chmodSync(root + 'chromium', 0o700);
JS
```

For exact transitive setup on later reruns, create a fresh isolated directory with copies of `isolated-browser-package.json` as `package.json` and `isolated-browser-package-lock.json` as `package-lock.json`, and run `npm ci --prefix ../browser-qa-runtime --ignore-scripts --no-fund` before decompression. This Linux headless binary is not a Windows/macOS setup.

Set `QA_CHROMIUM_EXECUTABLE` to the absolute extracted executable path for each command (Linux example; replace with your actual path):

```bash
QA_CHROMIUM_EXECUTABLE=/absolute/path/browser-qa-runtime/chromium npm run test:e2e
QA_CHROMIUM_EXECUTABLE=/absolute/path/browser-qa-runtime/chromium npm run test:lighthouse
QA_CHROMIUM_EXECUTABLE=/absolute/path/browser-qa-runtime/chromium node scripts/review-browser.mjs
```

With no override, the code uses Playwright's default installed executable. The override is explicit and test-only; it does not edit browser revision manifests, production configuration or indexing flags. A launch smoke check verified a real Chromium browser/version before auditing. Npm audit returns zero known advisories for the isolated package graph, but does not certify browser-engine CVEs or generic binary security. The package's [primary documentation](https://github.com/Sparticuz/chromium/blob/master/README.md) describes its Linux headless binary and Playwright executable-path integration.

## Coverage and artifact inspection

- 156 cases in four projects: desktop 1440×1000 / mobile 390×844, light/dark, zero automatic retries and two workers. All 30 actual localized core/detail/error routes plus critical flows are covered.
- WCAG 2 A/AA, 2.1 A/AA and 2.2 AA axe tags. Mobile menu is open during scans. All full axe JSON is retained, including incomplete findings.
- Route language/headings/canonicals/locale-preserving switch, project/source paths, empty Writing, contact, native menu, skip focus, theme persistence/OS reset, JavaScript-disabled navigation, runtime privacy/errors and 320/768/1024/1920 reflow.
- Screenshots: 120 full-page routes and 4 keyboard captures in the browser report; decoded `browser/captures/` gives readable names. Failure traces/screenshots from the initial 140-pass/16-fail run are archived separately. The final full run passes 156/156 after test corrections.

Extract `IGNACIO_PORTFOLIO_PHASE5_QA_EVIDENCE.zip` alongside the source archive to restore full output paths. Open the final HTML report locally:

```bash
npx playwright show-report evidence/phase5/browser/html-report
```

Actual result/stats are `browser/results.json`; `browser/summary.json` summarizes scans and captures. Historical discovery JSON explicitly means discovery, not execution. For independent visual inspection, open original PNGs rather than inferring layout quality from pass counts alone.

## Review performed and limits

The `review-browser.mjs` walkthrough drives real keyboard controls and records observed focus names, outlines/visibility, native menu state, current-page theme with denied storage, forced colors, reduced motion, cookies, local asset MIME and ARIA snapshots. It creates 31 supplementary screenshots and 16 scenario records. The agent inspected all 120 route tops in eight contact sheets and eleven selected original-resolution focus/full-page images. These actions constitute sampled agent review, not human assistive-technology speech testing or exhaustive full-page pixel inspection.

| Review | Recorded outcome / limit |
| --- | --- |
| Keyboard/focus | Four complete homepage cycles, 26 desktop / 27 expanded-mobile controls; visible 3 px outlines, skip-to-main, native Enter/Space/Tab; no trap |
| Navigation/locale/theme | Critical flows pass in all four projects; selected theme persists/reverts to OS; current-page override still works when storage is denied |
| Reflow/zoom | E2E reflow widths pass; Spanish Home/research/contact pass 720 CSS-pixel × DPR 2 layout equivalent to 200% at 1440 physical pixels; actual browser-chrome zoom UI not exercised |
| Text/contrast | Translated names/landmarks checked; no observed clipping/overlap in reviewed captures. 48 axe incomplete arrow findings reviewed using 148 actual computed samples, min 6.523:1 |
| Forced colors/motion | Actual forced-color expanded-menu focus image inspected; reduced-motion scroll is auto; no autoplay/tracking players |
| Screen reader | Actual ARIA snapshots captured; no speech AT tool was available/exercised, no pronunciation/conformance certification |
| Errors/MIME/privacy | Real preview 404 fallback and expected local MIME; no unexpected third-party initial page requests, no inspected-context cookies. Actual GitHub Pages host behavior remains a later check |

Owner assistive-technology/other-engine testing may extend this scope. Do not label an unperformed check a pass. A zero axe/Lighthouse a11y score failure count is not full WCAG conformance.

## Lighthouse and release flags

`npm run test:lighthouse` audits Home EN/ES, Qt detail EN, gallery ES and Writing EN, mobile defaults/simulated throttling, producing five full HTML/JSON LHR pairs and a summary. Actual local scores are **100 Performance / 100 Accessibility / 100 Best Practices / 66 SEO** on each page. See full runtime settings in the LHR.

The SEO failure is intentional prelaunch **noindex/nofollow** plus **robots Disallow: /**. It remains a disclosed owner-review/release-preparation item; do not silently enable indexing or audit a different build to inflate scores. The command enforces P/A/BP ≥90 and preserves the exact SEO score, so exit 0 does not mean every category reached 90. The full diagnostics also show a small shared render-blocking CSS request chain, investigated and retained because Performance is 100 and shared CSS is appropriate. Local scores do not certify deployed performance.

Official references: [Playwright configuration](https://playwright.dev/docs/test-configuration), [accessibility testing](https://playwright.dev/docs/accessibility-testing), [Astro CLI preview/ignore-lock](https://docs.astro.build/en/reference/cli-reference/#--ignore-lock), [Lighthouse docs](https://github.com/GoogleChrome/lighthouse/tree/main/docs). No repository, hosting or publishing operation is part of this runbook.

**STOP — request Phase 5 owner acceptance of the real evidence and documented limits before Phase 6.**
