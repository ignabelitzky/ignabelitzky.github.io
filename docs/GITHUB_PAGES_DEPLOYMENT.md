# Current publication and rollback workflow

Improvement Phase 3 prepares an unpublished candidate for ignabelitzky/ignabelitzky.github.io and https://ignaciobelitzky.dev/. Current remote main was read-only rechecked: 5cd8094ec58f838e18172d3cf0c4b89e9749c4fa. Its successful Manual Pages release is run 37971203049 (2026-10-09); CI run 37970737642 also succeeded. This is the current rollback source, superseding the older initial-release SHA in historical notes. Evidence includes the retrieved run state. No new push, merge, release dispatch, Pages setting or DNS change occurred.

CI runs on push/PR with read-only permissions. The tracked deploy.yml has workflow_dispatch only. Integrating/pushing source does not invoke that release workflow. Publication requires the full current main SHA to match both PAGES_APPROVED_SHA and approved_sha, confirmation PUBLISH, and the target-repo/main guards. The workflow validates, browser-tests, audits and uploads only dist; a dependent job deploys the tested artifact. Do not substitute a source ZIP for a Pages artifact.

## Exact next action after explicit Phase 4 authorization

1. Open the actual owner's checkout; inspect working tree, branch, remotes and latest main. Preserve unrelated work. This package comes from a reconstructed local audit baseline; its local commit hash is not a remote release hash.
2. Compare main with 5cd8094ec58f838e18172d3cf0c4b89e9749c4fa. Apply the reviewed binary patch in a separate feature branch, resolve any newer changes, and run the checks. Prefer one reviewed integration commit so rollback can revert it unambiguously. Source publication/merge must be covered by the owner's Phase 4 authorization.
3. Merge the approved candidate into main and wait for successful CI on that actual new main SHA. Record it; if the source materially changes after approval, return for review. Obtain authorization covering that exact source/revision before dispatch; do not use a reconstructed local hash.
4. Set PAGES_APPROVED_SHA to that full SHA; manually dispatch deploy.yml on main with approved_sha equal to it and confirmation=PUBLISH. Inspect the actual newly created run and its successful dependent deploy job. Clear the approval marker after completion; clearing it does not cancel a run already past the guard.
5. Verify HTTPS, EN/ES routes, DACOR, locale/theme/navigation, icons/fonts, asset MIME, 404, sitemap/canonicals and absence of private output. Download the tested artifact/evidence, compare manifests and record the deployed revision. No hosting or DNS changes are needed for this candidate.

After the exact action is authorized, the existing CLI form is:

```bash
release_sha=$(git rev-parse HEAD)
gh variable set PAGES_APPROVED_SHA --repo ignabelitzky/ignabelitzky.github.io --body "$release_sha"
gh workflow run deploy.yml --repo ignabelitzky/ignabelitzky.github.io --ref main -f approved_sha="$release_sha" -f confirmation=PUBLISH
```

Use the actual resulting run ID to watch/inspect it, download evidence, then delete PAGES_APPROVED_SHA. These are review instructions; none was executed in Phase 3. GitHub's available permissions and current settings must be checked when performing publication.

## Concrete rollback

Known-good source: 5cd8094ec58f838e18172d3cf0c4b89e9749c4fa, successful deployment https://github.com/ignabelitzky/ignabelitzky.github.io/actions/runs/37971203049. Preserve the current domain/origin and manual release workflow.

If the improvement release fails or regresses: cancel pending releases and clear the approval marker, inspect the failing logs and identify the exact integration commit. In a reviewed branch revert that ordinary improvement commit, preserving history and unrelated later changes. For a merge commit or multi-commit integration, inspect the parents and prepare the specific reviewed revert rather than assuming git revert -m 1. Do not force push or reset main. Run critical static/browser/CI checks, approve the resulting rollback SHA, merge and manually deploy it through the same guarded workflow. A revert push alone does not roll back the website.

Verify the restored baseline content, EN/ES routing, existing domain/HTTPS, assets and 404; archive the rollback SHA/run. An old-run re-deployment is a separate explicit action and is not the normal source rollback. Phase 3 authorizes no rollback execution because no new deployment occurred.
