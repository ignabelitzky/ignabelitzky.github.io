# Ignacio Belitzky — portfolio

Bilingual English/Spanish portfolio for Ignacio Belitzky, Software Developer from Córdoba, Argentina. Astro, TypeScript and Tailwind CSS; English at `/` and Spanish at `/es/`.

## Current improvement review

This checkout contains the unpublished Phase 3 release candidate: Phosphor assets/Inter, sticky header, accessible header theme dropdown, published-content-driven Writing navigation, revised English/Spanish copy and DACOR experience/case study. See `docs/WORK_STATUS.md` and `docs/IMPROVEMENT_PHASE3_QA.md`. Static and actual browser validation have been completed; limitations are recorded in the QA report. Historical release authorization below does not authorize publishing this candidate.

## Local development

Use Node 24.19.0, npm 11.9.0 and Python 3.

```bash
npm ci
npm run validate
npm run dev
```

For production QA, install Chromium as documented and run `QA_EVIDENCE_DIR=evidence/local bash scripts/verify-ci.sh`. Fedora instructions are in `docs/LOCAL_SETUP.md` and `docs/BROWSER_QA_RUNBOOK.md`.

## Release

Canonical site: https://ignaciobelitzky.dev . `www.ignaciobelitzky.dev` redirects to the apex. Original GitHub Pages address: https://ignabelitzky.github.io . The source repository is `ignabelitzky/ignabelitzky.github.io`, served from the domain root without a project base. Public repository creation, reviewed source upload, indexing, GitHub Pages and manual publication were expressly authorized by the owner on 2026-10-09. Phase 7 was deployed successfully on commit `0e4f50b45fe83f3e2748e4ae4e6236d663f1ad0f` and accepted by the owner. Phase 8 custom-domain configuration and the corresponding source/release were authorized on 2026-10-09. Read `docs/DONWEB_DOMAIN_SETUP.md` for DNS, verification, HTTPS and recovery. Source alone does not certify a completed custom-domain release.

Normal pages emit `index, follow`; error pages stay noindex. Robots allows crawling and references the canonical sitemap. All four local Lighthouse categories must score at least 90. Analytics and CV download remain disabled; Writing contains no authored articles yet.

CI tests pushes and PRs and does not publish. The separate workflow requires manual dispatch of the exact approved main SHA and a matching repository variable. It uploads only tested `dist/` through the official Astro/Pages actions. Read `docs/GITHUB_PAGES_DEPLOYMENT.md` and `docs/RELEASE_CHECKLIST.md` for configuration, verification and rollback. Deployment remains manual. Custom-domain configuration is authorized; unrelated purchases and account changes are outside this work. No source license has been selected.
