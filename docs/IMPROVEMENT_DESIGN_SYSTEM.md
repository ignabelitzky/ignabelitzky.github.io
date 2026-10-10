# Portfolio maintenance and design notes

Approved system: supplied Phosphor artwork, Inter 400/600, restrained green interface, English default and complete Spanish, sticky shared header. Do not regenerate or recolor the logo. The exact same /brand/phosphor-web.svg is shown at 48×48 CSS px in both themes. Favicons, ICO, Apple icons and WOFF2 come from the Essential Kit; keep Inter's license. Asset hashes are in the QA evidence. No project media was added.

| Role | Light | Dark |
| --- | --- | --- |
| Background | #F5FAF7 | #071C13 |
| Surface | #FFFFFF | #102C20 |
| Text | #071C13 | #F5FAF7 |
| Secondary text/control boundary | #466052 | #A8C0B1 |
| Accent/button | #087A44 | #31E981 |
| Focus | #087A44 | #B6FFCF |
| Button text | #FFFFFF | #071C13 |
| Decorative line | #B8CABF | #365F48 |
| Hover accent | #086B3C | #B6FFCF |
| Soft selected surface | #EDF6F0 | #153A2A |

Supporting colors are interface roles, not amendments to the artwork. Keep tokens centralized in src/styles/global.css. Numeric checks cover 36 foreground/background pairs; actual route/popup axe scans and screenshots complement those checks.

Header CSS uses sticky/top:0; ResizeObserver sets --header-height for scroll padding as layouts change. At widths below 1024px, navigation becomes a details disclosure; Escape/Close restore summary focus. At small widths the name/Theme label are reduced while the 48px logo and touch targets remain. Maintain semantic current-route indication and locale-preserving language links.

ThemeSelect.astro implements a select-only combobox/listbox with a single focus boundary. theme-dropdown.ts holds keyboard state. Selected preference and highlighted option are distinct: arrows/Home/End/typeahead preview; Enter/Space commit; Escape/Tab discard preview. Outside interaction dismisses; pointer/touch options commit and return trigger focus. Keep System/Light/Dark with localized labels and a checkmark, never only a color cue.

The ib-theme key stores explicit overrides; System clears the override and follows CSS prefers-color-scheme live. The early theme script applies saved choice before enhancement; denied storage retains current-page choice but reload returns to System. No JS hides the inert theme control while content/navigation and OS colors remain usable. Do not introduce duplicate footer state or a large dependency for this component.

UI strings live in src/i18n/ui.ts, editorial copy in src/i18n/editorial.ts, responsibilities in typed experience data, project descriptions in bilingual content records. Shared source/website links and research attribution remain single sources. DACOR's 2023–present role includes website, reconstruction of an existing logo, computer assembly and IT support; its case study describes the existing website. Planned future upgrades and unmeasured outcomes are excluded.

Writing promotion depends on publishedArticles(locale), excluding drafts/future entries. The direct Writing route and its language switch remain supported while public promotion is hidden. Publishing a genuine locale article enables its navigation on the next static build; run node/build fixtures after changing that logic.

Keep Astro/Tailwind/strict TypeScript, static output and the lockfile. No React, analytics, third-party initial requests, paid services, CV or personal photograph was added. Run npm run validate, browser QA and relevant link checks before the next manual release. See IMPROVEMENT_PHASE3_QA.md for this candidate's actual results.
