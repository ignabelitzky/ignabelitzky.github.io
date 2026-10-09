# Release checklist

Phase 6 was approved and public repository creation/source upload/indexing/Pages/publication were authorized on 2026-10-09. Unchecked boxes remain unexecuted tasks. This checklist does not certify an actual release.

## Phase 6 prepared result

- [x] Phase 5 approved 2026-10-09, including deliberate prelaunch SEO 66.
- [x] Local CI/release YAML prepared separately; actions pinned to inspected official commits.
- [x] CI uses push/PR and read-only permissions; no deployment.
- [x] Manual-only release checks target repo/main/exact approval SHA/confirmation.
- [x] Tested source/configured origin is `https://ignabelitzky.github.io` with no project base.
- [x] Web UI and Fedora paths, plan/visibility boundaries and rollback instructions supplied.
- [x] Repository upload payload excludes internal brief/evidence/working notes.
- [x] Owner accepts Phase 6 and specifically authorizes public repository creation/source upload.
- [x] Owner confirms target repository does not exist; connected account verified as ignabelitzky.

## Repository preparation — separate specific authorization

- [ ] Confirm exact target while signed in; inspect existing content, workflows, settings and deployments.
- [x] Owner approves creating the absent repository as public and uploading reviewed source.
- [ ] Decide source visibility/plan later without assuming private-source Pages is private hosting.
- [ ] Review repository upload ZIP tree, committed files and source privacy; choose a license only if desired.
- [ ] Push to agreed main/feature branch, inspect actual CI run and supported branch controls.
- [ ] Until successful CI on the release commit, keep Pages deployment unexecuted and the approval marker unset. Phase 7 itself is already authorized.

## Phase 7 before publication

- [x] Explicit authorization received for public source and public portfolio publication.
- [ ] Accept exact public inventory and empty Writing/CV-disabled/media/content decisions.
- [x] Indexing enabled by explicit authorization; build/E2E/source assertions and SEO gate updated. Fresh checks are recorded in the candidate report; hosted execution remains pending.
- [ ] Run clean locked install and all critical tests on exact intended main commit; successful actual CI.
- [ ] Review screenshots/accessibility/Lighthouse results and remaining limits; no known high/critical defects.
- [ ] Confirm current supported Node/npm/actions, plan usage/budget and Pages prerequisites.
- [ ] Pages Source set to GitHub Actions only after approval; correct root URL/no custom domain.
- [ ] Protect github-pages environment with main-only branch and reviewers when supported; confirm effective UI state.
- [ ] Record the full approved SHA; no main changes after approval.
- [ ] Set repository variable PAGES_APPROVED_SHA to that SHA; manually dispatch main with same SHA and PUBLISH.

## After dispatch

- [ ] Build/test/lockfile validation succeeds; correct tested dist-only Pages artifact and manifest.
- [ ] Confirm required environment approval if configured; actual deployment job succeeds.
- [ ] Download run evidence; capture run URLs, full SHA, timestamps and artifact hashes.
- [ ] Independently check HTTPS EN/ES routes, eight project details, media/link behavior, assets/MIME, themes, mobile/keyboard, 404, canonical/hreflang, robots and sitemap.
- [ ] Re-run hosted critical browser and mobile Lighthouse checks; actual hosted SEO matches approved state.
- [ ] Verify no unexpected private content, scripts, cookies or third-party runtime requests.
- [ ] Clear PAGES_APPROVED_SHA. If approval is withdrawn, cancel any run already beyond guard.
- [ ] Owner accepts the live site; fill RELEASE_RECORD.md with actual evidence and known-good rollback SHA.
- [ ] Stop. Do not add automatic deployment, domains/DNS or a purchased service.

## Failure/rollback

- [ ] Record failing step; cancel pending releases and clear approval marker.
- [ ] For sensitive exposure, unpublish promptly; acknowledge that rollback cannot erase caches/history.
- [ ] Select known-good source, review a new revert/fix commit, pass tests/CI, obtain exact-SHA approval.
- [ ] Manually redeploy rollback; a source push alone does not deploy.
- [ ] Smoke-test rollback, archive record/evidence, clear marker and notify owner with actual outcome.
