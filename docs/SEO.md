# Portfolio SEO

The canonical site is `https://ignaciobelitzky.dev/`. English is served at the root
and Spanish under `/es/`. Every translated page retains its own canonical URL and
reciprocal `en`, `es` and `x-default` alternatives. GitHub Pages redirects HTTP,
`www`, and the original `ignabelitzky.github.io` host to the custom HTTPS domain.
Unknown paths return a real 404. The static `/index.html` alias already emits `/`
as its canonical, as both URLs serve the same generated file.

`robots.txt` permits crawling and advertises `/sitemap-index.xml`. The generated
sitemap contains the 32 canonical core and project URLs; error pages are excluded.
The two writing indexes currently display an honest empty state and are hidden
from navigation. Publishing useful articles is an editorial follow-up; no filler
articles or unsupported claims were added for SEO.

`src/lib/seo.ts` supplies a shared Person/WebSite identity and per-page JSON-LD:
ProfilePage for the personal profile, ContactPage, CollectionPage, project
CreativeWork and BreadcrumbList. Authored articles use real publication dates.
Project markup deliberately does not claim sole authorship, ratings or dates,
including for collaborative research. Errors have no identity markup. JSON-LD
escapes `<` before insertion into a script raw-text element; the source security
check exempts only that exact serializer expression and rejects other HTML sinks.

The social preview is `src/assets/social-preview-phosphor.png`, with an editable
source and license in `design/`. Both OG and Twitter metadata share the processed
1200 × 630 PNG and descriptive alternative text. Astro's content hash changes the
image URL when the image changes. Social networks may retain cached previews of
previously shared links; that is independent of the site's current metadata.

The existing validation pipeline now checks JSON-LD, page identity/language,
canonical/OG consistency and the actual PNG signature and dimensions for every
built page. Unit tests cover identity consistency, localized breadcrumbs,
authorship restraint, real article dates and script-escaping safety. Existing
browser, consent, accessibility, performance and release checks still apply.

Release through the existing manual Pages workflow only: merge the tested PR,
set `PAGES_APPROVED_SHA` to the exact main commit, and dispatch `deploy.yml` on
that same SHA with confirmation `PUBLISH`. Do not remove or bypass release guards.

Search Console should use the existing domain property `ignaciobelitzky.dev`
under verified owner `igna.belitzky@gmail.com`. Submit the absolute sitemap URL
once; do not create another property or change ownership unnecessarily. Search
Console processing and Google's choice to index/rank pages are separate from
successful deployment and sitemap submission.

References: [Google profile markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page),
[localized pages](https://developers.google.com/search/docs/specialty/international/localized-versions),
and [sitemap submission](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
