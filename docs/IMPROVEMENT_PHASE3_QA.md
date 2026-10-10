# IMPROVEMENT PHASE 3 — QA and release preparation

**Status: PASS for local release preparation, with the limits below. Production unchanged. Browser QA was executed, not skipped. STOP — awaiting explicit publication authorization.**

## Candidate and changes

The approved bilingual candidate retains the sticky shared header, exact full-color Phosphor badge, supplied Inter fonts, matching light/dark interface, header System/Light/Dark dropdown, expanded DACOR 2023–present experience and website case study, tighter page layouts, and publication-driven Writing navigation. All nine projects, six experiments, selected-project order and research attribution remain. The content and runtime source have not changed since the Phase 2 candidate; actual browser checks found no material defect requiring a UI correction.

Phase 3 updates the browser walkthrough for the header combobox, adds real touch/typeahead/Tab/outside/popup placement and font checks, checks the actual aria-controls target, retains open and closed mobile accessibility scans and popup reports, routes audit output to the requested evidence directory, and replaces stale release/design/status notes. No production dependency or lockfile change occurred. Historical Phase 2 evidence remains historical; the current QA results below apply to this candidate.

## Checks actually executed

| Check | Outcome |
| --- | --- |
| npm run validate | PASS: formatting, lint, Astro diagnostics (64 files, zero errors/warnings/hints), strict TypeScript, 38 node/build-fixture tests, production build |
| Production output | 32 pages; 436/436 checks; 803 local references |
| Source/contrast audit | 36/36 contrast pairs; 7/7 source checks |
| npm run test:e2e, final full run | 188/188 passed, 0 skipped, 0 flaky, no automatic retries; 4 desktop/mobile × light/dark projects |
| Accessibility | 196 actual axe scans; zero violations; full incomplete findings retained and reviewed below |
| Screenshot evidence | 140 E2E PNGs, including 128 route captures and 8 localized popup captures; 37 supplementary walkthrough PNGs |
| Keyboard walkthrough | Four complete Tab/Enter/Space cycles; focus visible, no observed trap; skip target and mobile close/focus return exercised |
| Theme and header | Actual OS preference, overrides/reload/navigation, System reset/live response, keyboard preview/commit/cancel, typeahead, outside dismissal, emulated touch, denied storage, sticky scrolling/anchor offset, logo and fonts |
| Responsive layouts | 320, 360, 390, 768, 1280 and 1440 CSS px, both languages; no horizontal overflow in covered pages |
| Supplementary review | Forced colors, reduced motion, ARIA snapshots, 720 CSS px/DPR 2 zoom-equivalent layout, local MIME, no cookies/unexpected third-party initial requests |
| Lighthouse mobile lab | Five pages: Performance 97; Accessibility/Best Practices/SEO 100 on each |
| External links | All 23 unique HTTPS URLs responded; mailto/internal targets checked in build/browser tests |
| npm audit --audit-level=high | Zero known advisories; no dependency edits |
| Brand assets | Fresh SHA-256 comparison: 10/10 byte-identical supplied assets, including logo/font/icon/license files |
| Final tooling checks | Format, lint, strict TypeScript and git diff --check passed after test/tooling edits |

Browser: existing Linux headless Chromium 148.0.7778.0, Playwright 1.64.0, axe 4.13.0. Node 24.19.0/npm 11.9.0. No browser install was performed. The owner's latest instruction explicitly retained browser QA and superseded the earlier skipped-QA state; the existing repository QA scripts and available browser binary were used locally. Nothing was published.

## Review of incomplete accessibility results

Axe reported aria-valid-attr-value as incomplete in 196 scans for the combobox's controlled popup. Each route's browser assertion confirms exactly one real referenced ID with listbox role; interaction tests exercise opening, selection and active descendant behavior. This relationship was reviewed rather than counted as an automated pass.

Color-contrast had 124 scan-level incomplete entries. Open mobile navigation and popup overlays temporarily cover underlying content, so 64 additional closed-mobile scans check that content separately. The remaining closed-layout contrast findings concern redundant non-text arrow glyphs; the walkthrough checks 192 actual solid-background color samples, minimum 5.13:1. All full axe findings are included. These checks and zero violations do not certify complete WCAG conformance.

## Visual review and limitations

Inspected all 128 route tops in eight labeled contact sheets, the four actual popup walkthrough PNGs, full Spanish DACOR desktop/mobile pages, full Spanish About, forced-color menu focus and zoom-equivalent Contact. No clipping, horizontal overflow or unexpected layout overlap was observed in those inspected states. Open navigation/dropdown overlays are expected. The popup uses the site's actual surface/colors and one external keyboard focus outline rather than a platform-native option window.

This is sampled agent visual/keyboard review in one headless Chromium engine. Actual browser-toolbar 200% zoom, speech assistive technology, other browser engines and physical touch devices were not tested. A 720 CSS-pixel viewport at DPR 2 checks the equivalent layout but is not a claim of toolbar zoom execution. Lighthouse is local simulated mobile lab data, not field Core Web Vitals or a deployed-performance guarantee. URL reachability is not video playback verification. Actual hosted checks remain Phase 4 post-deployment work.

## Failures encountered and resolved

The initial 184-case suite passed. In the first expanded 188-case run, two mobile outside-dismissal tests attempted to click a heading behind the open popup; Playwright correctly refused an intercepted click. The test now targets the unobscured introduction for a genuine outside interaction. The four focused cases then passed, and the final complete 188-case suite passed. Failed-attempt logs and traces are retained separately; no runtime fix was necessary. The inherited walkthrough still assumed a native footer select and a 768px navigation breakpoint; it now uses the actual header combobox and 1024px breakpoint.

A GitHub read with a workflow-specific query URL was rejected as an unsupported endpoint; the supported runs collection then established the real release state. No write was attempted.

## Publication and rollback

Current remote main was rechecked read-only as 5cd8094ec58f838e18172d3cf0c4b89e9749c4fa. Its successful manual Pages release is run 37971203049 and CI run 37970737642. CI responds to pushes/PRs; deploy.yml is manual-dispatch-only. Pushing the source does not invoke that release workflow.

The next requested authorization is to accept this candidate and proceed with Phase 4 source integration/publication through the existing guarded manual Pages workflow. The actual new remote main SHA is determined only after reviewed integration; this local reconstructed audit commit is not a remote release SHA. Successful CI, exact source authorization, PAGES_APPROVED_SHA/input equality and PUBLISH are required before dispatch. No hosting/DNS changes are needed. See RELEASE_CHECKLIST.md and RELEASE_AND_ROLLBACK.md for the precise action and post-deployment verification.

Rollback is tied to the current known-good 5cd8094ec58f838e18172d3cf0c4b89e9749c4fa source and its successful run. Revert the actual reviewed improvement integration commit through a new commit, test/approve its resulting SHA and manually deploy it; a revert push alone does not restore the website. Preserve history, unrelated changes, the domain and release safeguards.

## Files and next gate

The package includes complete source, exact built output, the full binary-capable diff against the audited baseline, a Phase 3-only diff, build/source manifests, approved bilingual copy, content evidence, screenshots/browser report, logs and current maintenance/release notes. Dependencies, browser binaries, caches, credentials and Git metadata are excluded.

**Specific decision requested:** Accept the Phase 3 candidate and authorize Phase 4 integration/publication, including the guarded release of the reviewed resulting remote main revision. No publication is authorized by this Phase 3 execution or the instruction to continue.

**Next authorized step:** Await owner review. **STOP — awaiting approval.**
