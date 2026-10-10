# Browser QA — current improvement candidate

Improvement Phase 3 restores the browser QA required by the owner's latest instruction. It supersedes the Phase 2 pending state and the earlier original-build runbook. Do not treat original-build evidence as results for this candidate.

Use Node 24.19.0, npm 11.9.0, Python 3 and the unchanged lockfile. Standard local setup:

```bash
npm ci
npm run validate
npx --no-install playwright install chromium
QA_EVIDENCE_DIR=evidence/local npm run test:e2e
QA_EVIDENCE_DIR=evidence/local npm run test:lighthouse
QA_EVIDENCE_DIR=evidence/local node scripts/review-browser.mjs
QA_EVIDENCE_DIR=evidence/local npm run test:links
npm audit --audit-level=high
```

On this run an already available Linux headless Chromium 148.0.7778.0 was used with QA_CHROMIUM_EXECUTABLE pointing to its absolute path. No browser installation, package upgrade or production dependency was needed. Browser SHA-256: 19d04ecc759247c060f0d581afd3b535bcf36570425f32ac7742d9b0be29afd5. The binary is not distributed in the release ZIP. Use your normally installed Playwright browser, or explicitly set QA_CHROMIUM_EXECUTABLE to a compatible existing local binary. The recorded override is Linux-specific and does not certify Fedora/Windows installation. Scripts stop their own localhost-only production preview processes; do not run two E2E suites on port 4321 at once.

Four projects cover desktop 1440×1000 and touch mobile 390×844, both light/dark, with no automatic retries. All 32 localized core/project/error routes are scanned and captured. Expanded checks include popup keyboard/typeahead/Tab/outside/touch behavior, storage denial, System/reload/navigation, sticky/anchor offsets, logo/fonts, locale switching, no-JS, 404, reflow at 320/360/390/768/1280/1440, Writing visibility, local requests and privacy. Open-mobile-menu and closed-mobile-menu axe scans are separate. Popup scans retain full results.

review-browser.mjs walks actual Tab/Enter/Space sequences, captures popups/focus/menu/contact/project/research pages, ARIA snapshots, actual solid-color glyph contrasts, storage denial, forced colors and reduced motion. Its output follows QA_EVIDENCE_DIR. The formerly native-select-only walkthrough has been updated for the header combobox.

Open the saved final HTML report locally with npx playwright show-report evidence/improvement-phase3/browser/html-report. Read results.json and decoded browser/captures/ for individual images, plus manual/observations.json. Read IMPROVEMENT_PHASE3_QA.md for actual pass counts, observed failures and visual review.

Axe's incomplete findings require review. The hidden aria-controls listbox relationship is checked against a unique real ID/role. Open mobile overlays obscure underlying text, so closed-layout scans verify that text separately. Decorative arrow glyphs have actual computed-color checks. Zero violations is not full WCAG certification.

Limits: one headless Chromium engine; sampled agent visual/keyboard review, not speech assistive-technology testing. 720 CSS px at DPR 2 models a 200% layout at 1440 physical px; real browser toolbar zoom was not exercised. Touch events are emulated, not a physical-device test. Lighthouse is local mobile lab data, not field Core Web Vitals. Hosted behavior is a separate post-publication gate. No publishing action is part of this runbook.
