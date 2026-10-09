# Ignacio Belitzky — portfolio

Bilingual English/Spanish portfolio for Ignacio Belitzky, Software Developer from Córdoba, Argentina. Astro, TypeScript and Tailwind CSS; English at `/` and Spanish at `/es/`.

## Local development

Use Node 24.19.0, npm 11.9.0 and Python 3.

```bash
npm ci
npm run validate
npm run dev
```

For production QA, install Chromium as documented and run `QA_EVIDENCE_DIR=evidence/local bash scripts/verify-ci.sh`. Fedora instructions are in `docs/LOCAL_SETUP.md` and `docs/BROWSER_QA_RUNBOOK.md`.

## Release

Target: https://ignabelitzky.github.io . The source repository is `ignabelitzky/ignabelitzky.github.io`, served from the domain root without a project base. Public repository creation, reviewed source upload, indexing, GitHub Pages and manual publication were expressly authorized by the owner on 2026-10-09. These source files are an authorized release candidate; their presence does not certify that a deployment occurred.

Normal pages emit `index, follow`; error pages stay noindex. Robots allows crawling and references the canonical sitemap. All four local Lighthouse categories must score at least 90. Analytics and CV download remain disabled; Writing contains no authored articles yet.

CI tests pushes and PRs and does not publish. The separate workflow requires manual dispatch of the exact approved main SHA and a matching repository variable. It uploads only tested `dist/` through the official Astro/Pages actions. Read `docs/GITHUB_PAGES_DEPLOYMENT.md` and `docs/RELEASE_CHECKLIST.md` for configuration, verification and rollback. No automatic deployment or custom-domain configuration is authorized. No source license has been selected.
