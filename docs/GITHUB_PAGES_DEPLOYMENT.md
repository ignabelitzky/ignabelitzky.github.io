# Current deployment configuration — 2026-10-09

Phase 7 was published successfully and accepted. The public repository already exists; do not recreate it or change Pages to branch-based publishing. Phase 8 authorizes the purchased DonWeb domain `ignaciobelitzky.dev` as the canonical apex, with www redirected to it. The configured source origin is now `https://ignaciobelitzky.dev`; Pages Source remains GitHub Actions and releases remain manual. Read `DONWEB_DOMAIN_SETUP.md` for current domain instructions. The initial verified release is `0e4f50b45fe83f3e2748e4ae4e6236d663f1ad0f`, CI run 37961357189 and release run 37961979745. The older preparation notes below are historical; statements that the repository is absent or permission is pending no longer describe current status.

# GitHub Pages deployment — owner runbook

Updated 2026-10-09 for the authorized Phase 7 release. Ignacio has approved public repository creation, reviewed source upload, indexing, GitHub Pages and publication. No GitHub operation or deployment has yet been executed. The publication permission is already granted; a successful live release must still be established from actual workflow and HTTPS evidence.

## Current Phase 7 authorization

On 2026-10-09, Ignacio accepted Phase 6, confirmed the repository does not exist, and explicitly authorized creating the exact repository as **public**, uploading the reviewed source, enabling indexing/Pages and publishing. This supersedes the earlier private-preparation proposal. Local source is version 0.7.0 with indexing enabled, and error pages remain noindex. The steps below remain unexecuted until actual remote access and workflow evidence are recorded. GitHub creation/configuration/dispatch still require available execution access. No public site is claimed until actual deployment and HTTPS verification succeed.

## Repository discovery and permission boundary

Target: https://github.com/ignabelitzky/ignabelitzky.github.io . GitHub API lookup returned 404, scoped repository search returned 422, and the available installation search returned no repositories. These observations do not distinguish a missing repository from an inaccessible private repository. Status: **not visible; existence unconfirmed**. Evidence: `evidence/phase6/repository-status.json` in the full source archive.

Before creation, Ignacio must open that exact URL while signed in as `ignabelitzky`, check his repository list including private repositories, and confirm whether the name is available. If it exists, inspect its default branch, contents, Pages settings, workflows, and active deployments before proposing any changes. Do not replace an existing site, initialize over a clone, force push, or change its visibility. Work on a feature branch after a reviewed, explicit authorization.

Authorized operation for the owner-confirmed absent repository: create **public** `ignabelitzky/ignabelitzky.github.io`, default branch `main`, upload only the reviewed Phase 7 repository payload, inspect successful CI, configure Pages Source as GitHub Actions and dispatch the manual release for the tested main commit. Set PAGES_APPROVED_SHA only for that exact release and clear it afterward.

## Hosting and GitHub plans

GitHub Free supports Pages from public repositories. GitHub Pro supports Pages from public or private repositories; Team and Enterprise plans also support private sources where applicable. A private source repository does not make an ordinary personal Pages website private. This portfolio release must be treated as public even if its source stays private. Do not change visibility or upgrade a plan without specific approval. For a nonpublic preview, use localhost or the existing private workspace.

Required environment reviewers and wait timers on Free/Pro/Team are available only for public repositories. Deployment branch restrictions support public repositories and private repositories on Pro/Team. Check the actual Settings UI and current plan; the owner's GitHub plan is not known. Do not claim an environment reviewer gate exists merely because the YAML names an environment. If a sole owner initiates and reviews releases, enabling "Prevent self-review" would block that owner; use it only when a different reviewer is available.

Protected branches are available for public repositories on Free and private repositories on Pro/Team/Enterprise. When available, require PRs and the check named **Validate source and production build**, restrict force pushes/deletions, and use `main` as the default branch. A sole maintainer may omit mandatory second-person PR reviews while retaining status checks. Optional working branches: `feature/...`. Plan controls supplement the manual workflow; they do not authorize publication.

## Prepared workflow behavior

- `.github/workflows/ci.yml`: pushes to any branch and PRs targeting `main`; `contents: read`; no Pages action, deployment environment or deploy trigger. Uses Node 24.19.0, npm 11.9.0, `npm ci`, format/lint/Astro/strict TypeScript, unit and workflow safety tests, production build/static checks/source audit, Chromium/axe E2E, five mobile Lighthouse audits, and an npm high/critical advisory gate.
- `.github/workflows/deploy.yml`: **only** `workflow_dispatch`; no push, PR, tag, schedule or workflow-run deployment. Exact repository, `refs/heads/main`, full dispatched SHA, repository variable `PAGES_APPROVED_SHA`, input `approved_sha`, and literal `PUBLISH` must agree. Keep the variable unset until the owner approves an exact Phase 7 commit. Treat it as a one-release approval marker and clear it immediately after a release or canceled attempt.
- Release repeats the same `verify-ci.sh` test path before the official Astro action uploads `dist/`. The build job has read-only repository access. Only the dependent deploy job gets `pages: write` and `id-token: write`, through `github-pages`; no PAT or secrets are needed by the workflows. Checkouts use `persist-credentials: false`. Serialized releases do not cancel an in-progress deployment.
- Official action versions are pinned to immutable commits: checkout v7, setup-node v7, withastro/action v6, upload-artifact v6, deploy-pages v5. The checked Astro composite pins its own component actions, including upload-pages-artifact v5. Version labels identify the inspected major tag on 2026-10-09; future upgrades must be reviewed separately.
- The Astro action runs `npm install` internally. Its build override first rejects package/lockfile drift, then repeats **`npm ci`**, checks the exact runtime versions, and runs the common verification path. Autodetection preserves the action's `package-lock.json` cache key; its npm-version input is not relied on to install npm. Astro output caching is disabled. A dependency or runtime drift fails rather than silently releasing a different build.
- SHA-256 manifests identify the exact `dist/` files tested and uploaded. Normal CI uploads diagnostic evidence only, not a deployable Pages artifact. Release Pages artifact is uploaded by the Astro action only after successful checks. Both workflows preserve diagnostic reports for seven days; private-repository Actions usage may consume plan minutes/storage, so review the owner's budget before running.

The configured origin is `https://ignaciobelitzky.dev`; `https://ignabelitzky.github.io` is the original recovery host. It is a **user site**, served from `/`; `astro.config.mjs` deliberately has no project-repository `base`. Pages receives built **`dist/` via Actions**, not manually committed output on `main`. The `dist/`, `node_modules/`, `brief/`, and `evidence/` trees are excluded from Git. Use `IGNACIO_PORTFOLIO_PHASE7_RELEASE_CANDIDATE.zip` for GitHub upload; the full checkpoint ZIP includes internal working records and should not be uploaded wholesale. No license choice has been made.

## A. GitHub web UI instructions

### Repository preparation — only after explicit repository authorization

1. Sign in to GitHub as `ignabelitzky`, inspect the exact target URL and private repository list. If it already exists, stop the new-repository steps, review contents/settings, and agree on a feature-branch change plan.
2. If confirmed absent and approved: **+ → New repository**; owner `ignabelitzky`; name exactly `ignabelitzky.github.io`; visibility **Public**, as expressly authorized; initialize with a README so `main` exists. Do not choose a deployment template or activate Pages. The public source payload must match the reviewed candidate; no private working records belong in it.
3. Extract the repository ZIP. Upload the **contents** of its top-level `ignabelitzky.github.io` folder into the repository root using **Add file → Upload files**. Do not upload the enclosing folder or either ZIP. Preserve `src`, `scripts`, `tests`, and `docs` subpaths. This replaces only the approved initializer README in a newly created repo.
4. Upload hidden root configuration files explicitly if the picker omitted them: `.gitignore`, `.nvmrc`, `.prettierrc.json` if present (use the ZIP inventory as authoritative). Create the two workflow files using **Add file → Create new file**, entering full names `.github/workflows/ci.yml` and `.github/workflows/deploy.yml` and copying their complete reviewed YAML. Nested folder names in the filename field create those paths. Review the complete file tree against the ZIP; empty article folders need no invented content.
5. Commit the source and workflows to `main` for an approved new repository. For an existing repository, use the explicitly agreed feature branch and PR. Creating CI starts validation; the deploy workflow is manual and its approval variable remains empty. Never upload `dist/` to enable branch deployment.
6. **Actions → CI → latest run**: inspect actual results and each job log. The prepared YAML has not run on GitHub yet. **Settings → Actions → General**: allow the listed official actions under the owner's policy; keep default workflow permissions read-only. Do not grant PR write permissions. If plan-supported, **Settings → Rules → Rulesets** (or **Branches → Add branch protection rule**) protects `main`; require the validation check after its first successful run.
7. After CI succeeds on the exact source commit, proceed to the authorized manual-release steps below. A source push alone does not publish.

### Public release — Phase 7 only

1. Obtain explicit approval to publish, and separately approve any visibility change. On Free, public-source Pages requires **Settings → General → Danger Zone → Change repository visibility** and a reviewed public-source inventory; on supported paid plans private source can remain private. A published personal Pages site is public.
2. Decide indexing. The archived Phase 6 build kept `src/data/site.ts` `indexable: false`, `noindex, nofollow`, and robots `Disallow: /`. The authorized Phase 7 release candidate sets `indexable: true`, emits `index, follow` on normal pages and `Allow: /`, and enforces the SEO score target; 404 pages stay noindex. For a discoverable portfolio, explicitly approve switching it to true and update the prelaunch-only build/E2E assertions and Lighthouse SEO gate before approval of the release commit. Re-run all critical checks on that changed build. The Phase 7 workflow validates the explicit indexable state and includes SEO in the 90-point Lighthouse gate. Indexing was enabled only after the owner authorized it; passing hosted SEO is not inferred from a local result. If explicitly choosing a public noindex release, record that choice and accept the SEO limitation for that exact release.
3. Review source/privacy/content, exact commit, successful CI, local screenshots and reports. Record the full 40-character `main` SHA. If `main` moves, re-approve its new SHA; the dispatcher does not accept an old commit through a different branch.
4. **Settings → Pages → Build and deployment → Source → GitHub Actions**. Do this only now. Do not select “Deploy from a branch.” The prepared workflow does not call `configure-pages` to auto-enable hosting.
5. **Settings → Environments → github-pages**: selected deployment branches/tags → allow branch `main` only. If available, add Ignacio (or a designated collaborator) as required reviewer; use self-review prevention only if another reviewer can approve. Apply stronger plan-supported controls if desired. No environment secrets are needed.
6. **Settings → Secrets and variables → Actions → Variables → New repository variable**: name `PAGES_APPROVED_SHA`, value the exact approved SHA. This is a nonsecret approval marker, not a password; use a repository variable, not an environment-only variable, because the build job reads it before entering the deploy environment.
7. **Actions → Manual Pages release → Run workflow**; branch `main`; `approved_sha` exact SHA; `confirmation` exactly `PUBLISH`; submit. Inspect the actual build job, any environment approval screen, and the deployment job. A run counts as released only after the deployment succeeds and HTTPS smoke checks pass. Remove `PAGES_APPROVED_SHA` afterward; this does not revoke a job already past the guard, so cancel such a run explicitly if consent is withdrawn.
8. Download the run's `release-evidence-...` diagnostics and `github-pages` artifact while available. Inspect the artifact's built root files and compare them with `build-manifest.json`; do not publish a workspace/brief/source directory. Verify the live site independently as below. Record the deployment workflow URL, actual commit and outcome.

## B. Fedora terminal instructions

These commands are for Ignacio's machine; they have not been executed there. Read each stage's permission boundary before running it. Use the exact Node/npm setup in `docs/LOCAL_SETUP.md`, then `nvm install 24.19.0`, `nvm use 24.19.0`, and `npm install --global npm@11.9.0`. Git needs a configured commit name/email. Keep credentials in GitHub CLI/keychain or SSH tooling, never in repository files or a pasted URL.

### Local tooling and read-only discovery

```bash
sudo dnf install git gh rsync python3 unzip
# Interactive GitHub login; no token pasted into project files.
gh auth login --hostname github.com --git-protocol https --web
gh auth status
gh auth setup-git
# If this fails, check the signed-in web UI; failure alone does not prove absence.
gh repo view ignabelitzky/ignabelitzky.github.io --json nameWithOwner,isPrivate,defaultBranchRef,url
```

### New repository: absent, public creation/upload authorized

```bash
gh repo create ignabelitzky/ignabelitzky.github.io --public --description 'Ignacio Belitzky — Software Developer portfolio'
mkdir -p ~/Projects/ignacio-portfolio-import
unzip ~/Downloads/IGNACIO_PORTFOLIO_PHASE7_RELEASE_CANDIDATE.zip -d ~/Projects/ignacio-portfolio-import
cd ~/Projects
git clone https://github.com/ignabelitzky/ignabelitzky.github.io.git
cd ~/Projects/ignabelitzky.github.io
# An empty clone may warn; create its first branch explicitly.
git switch --orphan main
rsync -av --exclude='.git/' ~/Projects/ignacio-portfolio-import/ignabelitzky.github.io/ ./
nvm install 24.19.0
nvm use 24.19.0
npm install --global npm@11.9.0
npm ci
npm run validate
npx --no-install playwright install chromium
QA_EVIDENCE_DIR=evidence/local bash scripts/verify-ci.sh
npm run build
git status --short
# Inspect staged public contents before committing. dist/evidence/brief must be absent.
git add .
git diff --cached --stat
git diff --cached --name-only
git commit -m 'Add bilingual portfolio with validation CI and manual Pages release'
git push --set-upstream origin main
gh run list --repo ignabelitzky/ignabelitzky.github.io --workflow ci.yml --limit 5
```

The orphan command is for a confirmed **empty** new clone only. If the clone contains an initial README or any other history, use `git switch main` instead. Do not run the empty-repository initialization over an existing project. Fedora Playwright browsers may require additional system libraries; Playwright's `--with-deps` targets its supported Linux distributions and is used on Ubuntu CI, not assumed to configure Fedora. Follow `docs/BROWSER_QA_RUNBOOK.md` for existing-browser overrides and investigate concrete missing-library messages. Do not call tests passed if installation or launch failed.

### Existing repository: read first, then apply only agreed changes

```bash
cd ~/Projects
git clone https://github.com/ignabelitzky/ignabelitzky.github.io.git
cd ~/Projects/ignabelitzky.github.io
git status --short
git log -5 --oneline
git ls-tree --name-only HEAD
# STOP here to review existing content, workflows, Pages and the approved change plan.
# Resume only after that specific plan is authorized and the worktree is clean.
git switch -c feature/portfolio-phase6 main
# For an authorized replacement/import, the reviewed payload may be copied without deletion:
rsync -av --exclude='.git/' ~/Projects/ignacio-portfolio-import/ignabelitzky.github.io/ ./
# Inspect existing-only files: rsync does not delete them; old workflows may still deploy.
git diff --stat
git diff -- .github/workflows/
npm ci
npm run validate
npm run build
git status --short
git add .
git diff --cached --stat
git commit -m 'Prepare approved portfolio changes and manual Pages workflow'
git push --set-upstream origin feature/portfolio-phase6
gh pr create --repo ignabelitzky/ignabelitzky.github.io --base main --head feature/portfolio-phase6 --title 'Prepare portfolio and manual release workflow' --body 'Apply the approved portfolio preparation. CI validates without deployment; public release remains manual and requires exact-commit approval.'
```

Do not merge if an existing workflow would publish on the merge/push; disabling or replacing it must be part of the explicitly authorized change plan. Inspect the PR and successful CI, then merge through GitHub only when that source change is approved. CI status and Pages protections must be inspected rather than inferred from prepared YAML.

### Phase 7 manual release commands — do not run during Phase 6

First perform the approved Pages/visibility/environment UI setup above. Confirm the branch is the reviewed `main` commit and complete its indexing decision before these commands.

```bash
cd ~/Projects/ignabelitzky.github.io
git switch main
git pull --ff-only
npm ci
QA_EVIDENCE_DIR=evidence/release-review bash scripts/verify-ci.sh
git status --short
git rev-parse HEAD
# Use the printed full SHA only after Ignacio approves it explicitly.
release_sha=$(git rev-parse HEAD)
gh variable set PAGES_APPROVED_SHA --repo ignabelitzky/ignabelitzky.github.io --body "$release_sha"
gh workflow run deploy.yml --repo ignabelitzky/ignabelitzky.github.io --ref main -f approved_sha="$release_sha" -f confirmation=PUBLISH
gh run list --repo ignabelitzky/ignabelitzky.github.io --workflow deploy.yml --limit 5
# Identify the actual newly dispatched run; do not blindly select an unrelated concurrent run.
read -r -p 'Approved release run ID: ' release_run_id
gh run watch "$release_run_id" --repo ignabelitzky/ignabelitzky.github.io --exit-status
gh run view "$release_run_id" --repo ignabelitzky/ignabelitzky.github.io --json headSha,status,conclusion,url
mkdir -p evidence/hosted-release
gh run download "$release_run_id" --repo ignabelitzky/ignabelitzky.github.io --dir evidence/hosted-release
gh variable delete PAGES_APPROVED_SHA --repo ignabelitzky/ignabelitzky.github.io
curl --fail --location --head https://ignabelitzky.github.io/
curl --fail --location --head https://ignabelitzky.github.io/es/
curl --fail --location --head https://ignabelitzky.github.io/projects/qt-rss-reader/
curl --fail --location --head https://ignabelitzky.github.io/robots.txt
# This nonexistent path should return 404 with the customized root error document.
curl --silent --show-error --output /tmp/ignacio-pages-404.html --write-out '%{http_code}\n' https://ignabelitzky.github.io/__phase7_missing_path__/
```

A failed/canceled run is not a successful release. Inspect its logs, clear the approval variable, and obtain approval for any corrected new commit before dispatching again. The SHA guard is checked when the build starts; clearing the variable cannot stop a run already past it. Cancel a pending/active unapproved run in **Actions → run → Cancel workflow** (or `gh run cancel RUN_ID --repo ignabelitzky/ignabelitzky.github.io`).

## Artifact and live verification

In the release run, **Artifacts → github-pages** contains a Pages tar archive of `dist/`. Extract it into a fresh temporary directory, inspect `index.html`, `es/index.html`, `404.html`, `_astro/`, robots and sitemap; compare every file against the diagnostic SHA-256 manifest. No brief, source, test fixture, environment file or credential belongs in that artifact. Never substitute the full source ZIP for the Pages artifact.

Open the actual HTTPS site in desktop/mobile views. Check English/Spanish home, eight project details, Gallery, About, empty Writing, Contact, theme persistence, keyboard navigation, locale-preserving links, local images/styles, all approved external links, canonical/hreflang URLs, robots/sitemap matching the approved indexing state, no third-party runtime resources, and a nonexistent route returning 404. GitHub Pages has one root `404.html`; unknown Spanish paths may use that English root fallback even though `/es/404/` is an explicit Spanish page. Test actual MIME types for CSS, JS, WebP/SVG and XML. Re-run representative hosted Lighthouse audits and critical browser checks on the exact live release; localhost scores do not certify the host. Record any manual accessibility checks still outside coverage honestly.

Record full SHA, date/time, repository visibility, explicit authorization, approved indexing state, CI/release run URLs, artifact manifest, live URL, checks and outcomes in `docs/RELEASE_RECORD.md` during Phase 7. No release record or live status is invented in Phase 6.

## Rollback — only if a site has actually been released

1. Pause: cancel queued release runs and remove `PAGES_APPROVED_SHA`; keep automatic deployment disabled. For exposed private material, rollback alone does not erase caches/history: immediately unpublish **Settings → Pages → Unpublish site** and coordinate remediation with the owner.
2. Identify the actual last accepted release SHA and workflow in the release record. Do not assume the most recent commit was deployed.
3. Restore known-good source through a new commit/PR on `main`, preserving history. Prefer `git revert BAD_SHA` for a single ordinary commit; merge commits need reviewed `git revert -m 1 MERGE_SHA`, and larger spans need an explicit rollback plan. Avoid force pushes, branch resets or automatic multi-commit reverts.
4. Re-run all critical checks/CI on the rollback commit, approve that exact new SHA, set the variable, and manually run the same release workflow. Reverting/pushing alone does **not** redeploy. If the prior Pages artifact still exists and is genuinely needed, re-running its old deployment job is a separate explicit approval because it bypasses the new-SHA guard; the normal rollback is a new reviewed source commit.
5. Verify HTTPS/routes/assets/404 and indexing, archive evidence, clear the variable, and record the rollback commit/run. On a first failed release with no earlier site, there is no known-good site to restore: leave Pages disabled/unpublished until a fix is approved.

Fedora single-commit rollback, after the exact rollback is authorized:

```bash
cd ~/Projects/ignabelitzky.github.io
git switch main
git pull --ff-only
git switch -c fix/approved-rollback
read -r -p 'Approved ordinary commit to revert (full SHA): ' bad_sha
git revert "$bad_sha"
npm ci
npm run validate
git push --set-upstream origin fix/approved-rollback
# Open/review/merge the rollback PR, wait for CI, then repeat the Phase 7 dispatch
# procedure with the approved new main SHA. A push does not publish the rollback.
```

## Official references, checked 2026-10-09

- Astro GitHub Pages guide: https://docs.astro.build/en/guides/deploy/github/
- Exact Astro action source: https://github.com/withastro/action/blob/3eafd002e65cc31b4f0eae0bb05450d521562247/action.yml
- Pages availability and user-site naming: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Custom Pages workflows and permissions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Deployment environments and plan limits: https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
- Branch protection availability: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub CLI: https://cli.github.com/manual/gh_repo_create , https://cli.github.com/manual/gh_workflow_run , https://cli.github.com/manual/gh_variable_set

The generic Astro documentation includes push deployment in its example; this project intentionally uses manual dispatch only, as required by the owner brief. Official documentation examples and action repository tags currently differ in major versions; the workflows use the inspected current official action tags resolved to commits, not an unverified example pasted verbatim. Recheck these references before a later real release.
