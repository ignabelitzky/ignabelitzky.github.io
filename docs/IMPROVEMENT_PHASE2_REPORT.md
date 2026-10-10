# Improvement Phase 2 — Implementation report

**Status: PARTIAL checkpoint.** The requested implementation and static checks are complete. Required browser QA and candidate screenshots remain unavailable. No production change, remote write, push, merge, release dispatch, Pages configuration or DNS change occurred. Stop for owner review; do not automatically begin Phase 3 or publish.

## Implemented

- Shared CSS sticky header at top zero, deliberate stacking order and opaque theme surface. A ResizeObserver updates the anchor offset when header height changes. The 48px kit badge is byte-identical in both themes; name remains visible on desktop.
- A single theme control in the header, alongside a locale link and semantic mobile menu. The mobile panel supports Escape/close/focus return, outside dismissal and bounded scrolling. Writing links are enabled only when that locale has a genuinely published article; draft/future entries do not enable them. Direct routes and language pairing remain functional.
- Supplied Inter 400/600 fonts and license, approved Phosphor role palette, stronger control boundaries, SVG/ICO/Apple/manifest references and bilingual sharing graphics. No new project media, framework, account, paid service or tracking.
- Approved bilingual home/About/Contact/metadata/interface copy, all nine project narratives and six gallery summaries. The featured software order and full research credit are unchanged.
- DACOR ongoing 2023–present experience, confirmed logo reconstruction/computer assembly/IT responsibilities, a homepage preview and bilingual `/projects/veterinaria-dacor/` case study with website/source actions. Its current HTML/CSS/JavaScript implementation is described. No planned rebuild or unmeasured commercial outcome is presented as completed.
- Tighter hero/Contact rhythm, responsive widths, separate practical-work/research hierarchy, type-validated web category/website URL and shared typed experience data. DACOR does not require project media or display an image-coming-soon panel.

## Theme correction prompted by the screenshot

The supplied screenshot showed the native option popup and an oversized focus ring around the inner select. Native popup painting is controlled partly by the browser/OS, which prevents reliable visual consistency across themes. The implementation therefore refines Phase 1's native-select preference to a small select-only combobox built with Astro, CSS and browser JavaScript.

The trigger is one button with one focus boundary, an icon, visible Theme/Tema label, selected option, aria-expanded and aria-controls. The popup uses the actual site surface, border, text and selected-state tokens; a checkmark identifies the committed choice. It uses listbox/option semantics, aria-selected and aria-activedescendant. Arrow keys preview; Enter/Space commit; Escape/Tab cancel; Home/End and localized typeahead work. Mouse/touch selection, outside dismissal and focus return are implemented. System removes the explicit data-theme override and lets OS-aware CSS respond automatically. The original ib-theme storage key, guarded access and prepaint behavior remain. No-JS follows OS colors and hides the inert theme control. Its space is reserved during enhancement to keep the header stable.

This is the necessary component change for the reported issue in Phase 2. Browser rendering, screen-reader behavior and touch interaction are still pending verification; no visual-success claim is made from source inspection alone.

## Isolation and provenance

Current remote main was rechecked read-only and still equals `5cd8094ec58f838e18172d3cf0c4b89e9749c4fa`. The 97 pinned source files were copied to a fresh local checkout on `improvement/phase-2`; the local baseline represents those source bytes, not the original remote Git history. It has no configured remotes. Other workspace folders and the user's unobserved local machine working tree were preserved. The checked-in CI/deployment workflows, release guard, lockfile and Astro origin config match the baseline bytes exactly. No AGENTS.md exists in the audited tree.

## Commands actually executed

| Check | Result |
| --- | --- |
| `npm ci --ignore-scripts --no-fund --no-audit` | PASS; 491 packages from unchanged lockfile |
| `npm run format` / `npm run format:check` | PASS |
| `npm run lint` | PASS; zero ESLint warnings |
| `npm run check` | PASS; 64 files, zero errors/warnings/hints |
| `npm run check:ts` | PASS |
| `npm test` | PASS; 38/38, including actual article builds, Writing publication fixtures, dropdown keyboard state and existing release guards |
| `npm run build` | PASS; 32 pages |
| `npm run test:build` | PASS; 436/436 actual-build checks; 803 local references |
| `npm run audit:source` | PASS; 36/36 contrast pairs; 7/7 source checks |
| `npm run test:e2e:list` | PASS collection only; 184 browser tests prepared, zero executed |
| `git diff --check` | PASS |
| Asset/payload verification | 10/10 copied brand files byte-identical; approved project/experiment and shared UI/editorial copy checked against payload |

`npm run validate` runs formatting, lint, Astro/TypeScript, node tests, build, built-output checks and source audit in sequence. See evidence/improvement-phase2/validate-final.log and its JSON reports in the package.

## Failures encountered and resolved

The first combined suite ran two temporary article builds in parallel and one received the other fixture's content. The node test command now sets `--test-concurrency=1`, avoiding concurrent Astro content-sync builds. The complete sequential suite passes. This establishes the mitigation; the exact shared-cache mechanism has not been fully diagnosed.

The initial expanded build checker incorrectly counted the language switch on a directly opened empty Writing page as a Writing promotion. It now checks promotion links while preserving the locale switch. All public navigation is hidden for the empty collection and both direct Writing pages remain useful. The initial check's 434/436 outcome and final 436/436 pass are retained in logs. A packaging command initially used a wrong relative package.json path; corrected before the final sequential validation.

## Browser QA limitation

The [Sites SKILL.md](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) explicitly says: “If `$control-browser` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” `SITES_MANAGED_LINUX_CONTAINER=1`, and the browser skill was absent from the available catalog. No preview server, substitute browser automation or browser installation was used.

Playwright/axe, Lighthouse, manual keyboard/screen-reader checks, actual 200% browser zoom, reduced-motion review, touch behavior, font requests, sticky scrolling and candidate screenshots were **not executed**. Source checks and keyboard-state unit tests do not replace browser tests. External links retain verified owner/public-source destinations but the complete external-link script was not rerun. No field performance or release-readiness claim is made.

## Review artifacts and next gate

PHASE2_LOCAL_PREVIEW_EN.html and PHASE2_LOCAL_PREVIEW_ES.html are self-contained review documents derived from the actual build, with CSS/fonts/logo embedded and the compiled control scripts unchanged. They are not browser screenshots. Their paired locale links open the other review document when both are in one folder; other internal navigation points to the existing published baseline, not the proposed full site. Use the packaged source's local preview for reviewing all candidate routes. File-origin storage behavior may differ from normal HTTP.

The ZIP includes source/, built-site/, evidence/, the binary-capable patch against the audited source baseline, and these local review documents. No dependency folder or credentials are included. The source remains review-only.

Before claiming the Phase 2 acceptance gate passed, run the prepared browser suite in an environment with the supported browser capability, capture both themes and narrow/wide layouts, and resolve observed defects. Phase 3 remains unstarted. Publication requires its separate explicit authorization.
