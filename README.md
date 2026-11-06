# Ignacio Belitzky — portfolio

## Project description

Bilingual portfolio for Ignacio Belitzky, Software Developer from Córdoba, Argentina. English is served at `/`, Spanish at `/es/`; the site presents projects, experience, gallery and Writing.

- [Canonical website](https://ignaciobelitzky.dev/); `www` redirects to the apex.
- [Public source repository](https://github.com/ignabelitzky/ignabelitzky.github.io), branch `main`.
- [Original Pages address](https://ignabelitzky.github.io/).

## Technology stack

Astro **7.3.8**, TypeScript **5.9.3**, Tailwind CSS **4.3.3**, ESLint, Prettier, Node tests, Playwright **1.64.0**, axe and Lighthouse **13.5.0**. GitHub Actions runs validation; the official Astro and Pages actions publish the tested `dist/` artifact. There is **no Sanity CMS**.

## Architecture

Astro builds static HTML and assets. `src/pages/`, components/layouts and `src/data/` define pages, shared UI and content; `tests/` and `scripts/` implement checks, while `docs/` contains operational references. English and Spanish share the same root-hosted site; there is no repository-name base path.

GitHub stores source and runs CI/CD; GitHub Pages hosts the compiled site and manages the custom-domain publication. The [domain setup record](docs/DONWEB_DOMAIN_SETUP.md) documents DonWeb registration/DNS (`ns1.donweb.com`, `ns2.donweb.com`), apex records pointing to Pages and `www` pointing to `ignabelitzky.github.io`. Those are historical setup evidence, not a fresh account/DNS audit. Cloudflare is not established as this project's host or DNS provider. Registering a domain, resolving DNS and hosting its files are separate responsibilities.

The repository Pages setting supplies `ignaciobelitzky.dev` as the custom domain with Actions as the source; this publishing method does not require a repository `CNAME` file. Source URLs, canonical/hreflang metadata and sitemap use `https://ignaciobelitzky.dev`. A source commit alone does not prove that the public site has been released.

## Requirements

Fedora Linux with Bash, Git, curl and Python 3. Use **Node 24.19.0** from `.nvmrc` and **npm 11.9.0** from `packageManager` and CI. Engines allow Node `>=24.19.0 <25` and npm `>=11 <12`, but `scripts/verify-ci.sh` checks the exact tested versions. Chromium is needed for browser QA and Lighthouse. No `.env` file or CMS account is required for normal local development.

## Installation on Fedora Linux

Skip nvm installation if already available. The [official nvm installer](https://github.com/nvm-sh/nvm#installing-and-updating) installs a user-managed runtime and may update the Bash profile:

```bash
sudo dnf install git curl python3
curl --fail --location --output /tmp/portfolio-nvm-install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh
bash /tmp/portfolio-nvm-install.sh
source ~/.bashrc
git clone https://github.com/ignabelitzky/ignabelitzky.github.io.git
cd ignabelitzky.github.io
nvm install
nvm use
npm install --global npm@11.9.0
node --version
npm --version
python3 --version
npm ci
npm run dev
```

Use npm without `sudo` under nvm. Do not copy `node_modules` between operating systems or replace the committed lockfile during setup.

## Local development

Open Astro's printed URL, normally `http://127.0.0.1:4321`, and `/es/`. Edit a page/component or data file under `src/`, save and inspect hot reload in both languages. `Ctrl+C` stops the process. Use `npm run dev -- --port 4323` if the default port is occupied.

After editing, stop development and review the compiled site:

```bash
npm run validate
npm run test:e2e
npm run test:lighthouse
npm run build
npm run preview -- --port 4321
```

Install a browser before E2E/Lighthouse as described below. Playwright owns its server and needs its port free. It rebuilds with a test analytics ID; the final `npm run build` above restores a normal local build before manual preview. Development serves live edits, build generates `dist/`, and preview serves those files locally. **None publishes the website; pushing to `main` also does not publish it.**

## Validation and testing

| Command | Purpose |
| --- | --- |
| `npm run format:check` | Check formatting without rewriting. `format` rewrites its configured targets. |
| `npm run lint` | ESLint with zero allowed warnings. |
| `npm run check` / `npm run check:ts` | Astro diagnostics / TypeScript without emission. |
| `npm test` | Serial Node tests in `tests/*.test.mjs`. |
| `npm run build` / `npm run test:build` | Generate static output / verify generated pages and assets. Python 3 is required by build validation. |
| `npm run audit:source` | Check source constraints. |
| `npm run validate` | Format, lint, Astro, TypeScript, Node tests, build, build checks and source audit, in that order. |
| `npm run test:e2e` | Chromium tests across desktop/mobile and light/dark themes, including accessibility and consent. Rebuilds and starts preview automatically. |
| `npm run test:e2e:list` | List configured browser tests. |
| `npm run test:lighthouse` | Audit five routes on local preview; report performance, accessibility, best practices and SEO. Gate is 90 in each for an indexable release. Requires a build first. |
| `npm run test:links` | Python external-link checks; available separately, not invoked by current CI shell script. |
| `npm run qa` | `validate`, E2E and Lighthouse. |
| `QA_EVIDENCE_DIR=evidence/local bash scripts/verify-ci.sh` | Exact CI sequence, plus high-level dependency audit, lockfile checksum preservation and build manifest. Requires pinned Node/npm and Python. |

There is no separately named integration suite. `qa` does not add all the audit/manifest checks performed by `verify-ci.sh`.

For Fedora, the existing browser configuration and Lighthouse script support a system Chromium executable:

```bash
sudo dnf install chromium
export QA_CHROMIUM_EXECUTABLE="$(command -v chromium-browser || command -v chromium)"
npm run test:e2e
npm run test:lighthouse
```

Alternatively, `npx --no-install playwright install chromium` downloads the pinned browser. Fedora is not an officially supported Linux distribution in [Playwright's requirements](https://playwright.dev/docs/intro#system-requirements); do not use Ubuntu dependency-install commands on Fedora. If the downloaded browser lacks libraries, use Fedora Chromium or reproduce CI on Ubuntu. System Chromium can differ from CI's pinned browser. CI uses `playwright install --with-deps chromium` on Ubuntu 24.04.

## CI/CD and deployment

### Continuous integration

[ci.yml](.github/workflows/ci.yml) runs on pushes to all branches and PRs targeting `main`, with read-only repository permissions. It checks out source, installs Node 24.19.0/npm 11.9.0 and locked dependencies, installs Chromium, then runs [verify-ci.sh](scripts/verify-ci.sh): `validate` → E2E → Lighthouse → `npm audit --audit-level=high` → unchanged-lockfile check → manifest generation. A newer run cancels the older CI run for the same ref.

Diagnostic `ci-evidence-<runId>-<attempt>` artifacts from `evidence/ci/` are uploaded even on failure when available, retained seven days. External-link testing remains a separate command. CI never uploads a Pages release or publishes the site.

### Manual Pages release

[deploy.yml](.github/workflows/deploy.yml) accepts **only `workflow_dispatch`**. [release-guard.mjs](scripts/release-guard.mjs) requires the exact repository, `refs/heads/main`, a 40-character lowercase SHA equal to `GITHUB_SHA`, matching input `approved_sha` and repository variable `PAGES_APPROVED_SHA`, plus literal confirmation **`PUBLISH`**. The guard validates approval; it cannot grant it. If main moves before dispatch, approve the new revision or stop: a stale SHA will fail.

To release an explicitly approved revision:

1. Open the repository's current `main` commit in GitHub. Copy the full SHA and review successful CI for that exact source. Obtain approval for that revision; historical candidate approvals are not reusable release consent.
2. Settings → Secrets and variables → Actions → Variables: set `PAGES_APPROVED_SHA` to the full SHA and ensure `GA_MEASUREMENT_ID` contains the valid intended GA4 ID.
3. Actions → **Manual Pages release** → Run workflow → branch **main**. Enter the identical SHA in `approved_sha` and **PUBLISH** in `confirmation`.
4. Inspect both jobs. `build` runs the guard, installs tools, then the official Astro action invokes [verify-release.sh](scripts/verify-release.sh). That script requires a valid analytics ID, rejects package/lock drift, runs the full CI sequence and creates the final instrumented build, validates it and generates its manifest. Only `dist/` becomes the Pages artifact.
5. `deploy` depends on successful `build`, uses the `github-pages` environment and `pages:write`/`id-token:write` to publish that artifact. Release runs are serialized without cancelling the current release. Diagnostic `release-evidence-<runId>-<attempt>` artifacts are retained seven days.
6. Verify the run's deployment URL, canonical HTTPS, EN/ES routes, navigation/theme, assets, 404, sitemap and metadata. Compare the built artifact/manifest and record the actual SHA/run. Do not infer deployment from a source push or a green CI run.
7. Delete `PAGES_APPROVED_SHA` (or replace it with a non-SHA value) to withdraw temporary authorization. Clearing it does not cancel a run that has already passed the guard; inspect active runs separately.

Updating documentation on `main` does not authorize or dispatch a public Pages release.

## Content administration

There is no Studio or Sanity dataset/webhook. Edit content in source, maintain both languages, validate, commit/PR and integrate into `main`. Then use the manual release above to publish. Source integration and public publication are distinct actions. Writing navigation depends on published source content; see the project-specific notes before adding entries.

## Environment variables and security

| Variable | Source and use | Visibility |
| --- | --- | --- |
| `PAGES_APPROVED_SHA` | Repository Actions variable, compared with dispatched commit and input. | Non-secret authorization marker; remove after release. |
| `GA_MEASUREMENT_ID` | Repository Actions variable passed to release script; a valid `G-…` ID is mandatory for the current release script. | Public analytics identifier, not a token. |
| `PUBLIC_GA_MEASUREMENT_ID` | Final build environment derived from the preceding variable; a test ID is used by E2E with mocked endpoints. | Intentionally public. Normal local development does not need it. |
| `ASTRO_TELEMETRY_DISABLED` | CI/release set `1`. | Non-secret tool setting. |
| `QA_EVIDENCE_DIR`, `QA_PORT`, `QA_CHROMIUM_EXECUTABLE` | Optional local QA output path, E2E port and browser override. | Non-secret local settings. |
| `RELEASE_APPROVED_SHA`, `RELEASE_INPUT_SHA`, `RELEASE_CONFIRMATION` | Workflow maps repository variable and dispatch inputs into the guard's environment. | Transient control values, not credentials. |

The release script rejects a missing/invalid analytics ID, despite older prose describing analytics as optional. CI/QA does not send real visitor analytics; acceptance is required for production tracking. See [consent details](docs/GITHUB_PAGES_DEPLOYMENT.md). Do not commit credentials, cookies, private output or `.env` files; Pages authentication uses the workflow's scoped permissions rather than a personal token in source.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Node mismatch / `npm ci` failure | `nvm use`, Node 24.19.0 and npm 11.9.0; check registry/network and optional native packages. Reinstall on the actual OS without changing the lockfile. |
| Astro will not start / port occupied | Correct folder and dependencies; read first error, use another port. E2E can use `QA_PORT=4323 npm run test:e2e`. |
| Type/test/build failure | Run the specific check; verify Python 3, browser and required ports. Do not bypass gates. |
| Browser/Lighthouse failure | Verify browser path, free ports and existing build; inspect evidence. A missing browser is not a passing audit. |
| Release blocked | Event must be manual, repository/main correct, full SHA/input/variable identical and confirmation exactly PUBLISH. Check valid `GA_MEASUREMENT_ID`. |
| Source changed but public site did not | Expected after push: inspect the separate manual release and its deployed SHA. |
| Pages/HTTPS failure | Inspect dependent deploy job and Pages deployment, then domain/DNS status. Do not change DNS to fix a build error. |
| Released site still looks old | Check canonical domain, actual deployment/artifact and browser cache; validate both locales. |
| Published regression | Follow recovery below; a post-deployment verification failure does not automatically restore old files. |

Sanity content/webhook errors and Cloudflare Pages failures do not apply to this project.

## Rollback and recovery

Pause pending releases, clear temporary approval and inspect/cancel any already-running release as appropriate. Identify the last known-good artifact/run and the commit introducing the regression; do not rely blindly on historical SHA examples.

Prepare a normal reviewed **revert commit**, preserving unrelated later work and history. For merge/multi-commit changes, inspect parents and choose the intended revert rather than assuming a mainline parent. Validate locally, integrate into `main`, confirm CI, explicitly approve the resulting full SHA, and publish through the same guarded manual workflow. **A revert push alone does not restore the published website.**

Verify canonical HTTPS, EN/ES, assets, 404 and metadata; record restored SHA/run and clear approval again. Before-deploy failures prevent publication of the new artifact. Failures after activation can leave it live and require a new recovery release. Do not force-push or alter domain settings as a code rollback.

## Additional documentation

- [Local setup](docs/LOCAL_SETUP.md) and [browser QA](docs/BROWSER_QA_RUNBOOK.md).
- [Manual release, consent and recovery](docs/GITHUB_PAGES_DEPLOYMENT.md).
- [Release checklist](docs/RELEASE_CHECKLIST.md): historical candidate status is not current release authorization.
- [Custom domain and DNS record](docs/DONWEB_DOMAIN_SETUP.md).
- [Work status](docs/WORK_STATUS.md) and [historical improvement QA](docs/IMPROVEMENT_PHASE3_QA.md).

This README was checked against `main` configuration/scripts on 2026-11-06. Historical phase reports do not establish today's deployed revision; no fresh hosting-panel audit or actual Fedora installation is claimed. No source license has been selected.
