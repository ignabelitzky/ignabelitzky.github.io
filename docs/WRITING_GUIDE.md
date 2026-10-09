# Writing maintenance — Phase 4

The article collection and real Markdown page template exist. There are **zero authored articles** in this checkpoint. `README.txt` is outside the `**/*.md` loader pattern. Nothing in this guide is a published article.

## Adding a reviewed article later

Create `src/content/articles/en/<stable-slug>.md` and its reviewed Spanish equivalent under `es/`. Each file has a separate collection ID derived from its relative filename; both use the same public slug and translationKey. This avoids Astro's default frontmatter-slug ID collision between translations. Routes are `/writing/<slug>/` and `/es/writing/<slug>/`.

Required frontmatter fields: `slug` (lowercase hyphenated), `translationKey` (same for translations), `locale` (`en` or `es`), `title`, `description`, `author` (exactly `Ignacio Belitzky`), and `pubDate` (a **quoted** ISO calendar date, `YYYY-MM-DD`). Optional `updatedDate` uses the same format and cannot precede publication. Optional `tags` is a string array. `draft` defaults to **true**; explicitly set it to false only after editorial approval. The schema rejects unknown fields and malformed or impossible dates.

Use a body written by/for Ignacio from verified material. Begin body sections at H2 because the template supplies the page H1. Inspect code, tables, external links, image alt text and permission before publishing. Markdown is a trusted authoring input; do not add arbitrary scripts, remote tracking widgets or opaque HTML from third parties. This phase installs no MDX or client framework.

Publication filtering is shared between index and detail generation: drafts and future publication dates are omitted in every build. Static output does not schedule itself; a future date requires a subsequent authorized build. Duplicate locale routes or duplicate locale/translation keys fail the build; translated records must keep the same slug. A missing or unpublished translation is not advertised through hreflang, and its language switch falls back to the other language's home. Dates render in English or Argentine Spanish in UTC. Real articles get author/date/Open Graph Article metadata; the empty index gets none. No RSS or invented Article JSON-LD is emitted.

Before adding the first actual article, extend the Phase 4 built-output checker's intentional zero-article/count assertions and run the approved content/QA gate. Keep the article build regression test: it creates clearly named temporary fixtures, compiles the actual source/templates, checks bilingual rendering, draft/future exclusion and missing-translation fallback, then deletes the temporary directory. These fixtures never enter the portfolio's content directory, final dist or prebuilt archive.

## Other content and CV maintenance

Project narrative: `src/content/projects/*.json` (required EN/ES records; shared proper name, source and technologies). Tiny Programs: `src/content/experiments/*.json` (paired descriptions, exact directory links, explicit maturity labels). Editorial UI and biography: `src/i18n/ui.ts` and `editorial.ts`.

Future reviewed media requires a local image, paired nonempty alt and credit, provenance URL and `rightsConfirmed: true`; actual Astro asset processing then emits responsive WebP. No project images are approved or bundled now. Recorded YouTube links are ordinary outbound links only, with a translated availability note; they load no player/thumbnail or third-party bytes on page load.

Future CV: place the reviewed, approved PDF under `public/files/<name>.pdf`; configure `cv.path` and `cv.enabled` in `src/data/site.ts`, with both label translations. The current values (`false`, `null`) produce no UI. The path guard only accepts local `/files/<safe-name>.pdf`. Once approved, update the current unavailable-CV assertion in the build checker, which will also catch a missing file. No CV was supplied or created in this phase.

Reference checked 2026-10-09: [Astro content collections](https://docs.astro.build/en/guides/content-collections/), including custom IDs, `getCollection`, `render` and static route generation. Code uses the locked Astro 7.3.8 package, not an untested future API.
