import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { assertReleaseApproval } from '../scripts/release-guard.mjs';

const sha = 'a'.repeat(40);
const approved = {
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_REPOSITORY: 'ignabelitzky/ignabelitzky.github.io',
  GITHUB_REF: 'refs/heads/main',
  GITHUB_SHA: sha,
  RELEASE_INPUT_SHA: sha,
  RELEASE_APPROVED_SHA: sha,
  RELEASE_CONFIRMATION: 'PUBLISH',
};
test('manual release accepts only the approved main commit', () => {
  assert.equal(assertReleaseApproval(approved), sha);
});
for (const [field, value] of [
  ['GITHUB_EVENT_NAME', 'push'],
  ['GITHUB_EVENT_NAME', 'pull_request'],
  ['GITHUB_REPOSITORY', 'someone/ignabelitzky.github.io'],
  ['GITHUB_REF', 'refs/heads/feature'],
  ['GITHUB_REF', 'refs/tags/main'],
  ['GITHUB_SHA', sha.slice(0, 7)],
  ['RELEASE_INPUT_SHA', 'b'.repeat(40)],
  ['RELEASE_APPROVED_SHA', ''],
  ['RELEASE_APPROVED_SHA', 'b'.repeat(40)],
  ['RELEASE_CONFIRMATION', 'publish'],
  ['RELEASE_INPUT_SHA', '$(echo unauthorized)'],
]) {
  test(`release rejects ${field}=${value}`, () => {
    assert.throws(() => assertReleaseApproval({ ...approved, [field]: value }));
  });
}

const workflows = ['ci', 'deploy'].map((name) =>
  parse(readFileSync(new URL(`../.github/workflows/${name}.yml`, import.meta.url), 'utf8')),
);
const [ci, release] = workflows;
test('CI has push/PR triggers and read-only permissions with no deployment', () => {
  assert.deepEqual(Object.keys(ci.on).sort(), ['pull_request', 'push']);
  assert.deepEqual(ci.permissions, { contents: 'read' });
  assert.deepEqual(Object.keys(ci.jobs), ['validate']);
  assert.ok(ci.jobs.validate.steps.some((s) => s.run === 'bash scripts/verify-ci.sh'));
  for (const job of Object.values(ci.jobs)) {
    assert.equal(job.environment, undefined);
    assert.equal(job.permissions, undefined);
    for (const step of job.steps) assert.doesNotMatch(step.uses ?? '', /deploy-pages|withastro/);
  }
});
test('release is dispatch-only and scopes Pages/OIDC writes to dependent deployment', () => {
  assert.deepEqual(Object.keys(release.on), ['workflow_dispatch']);
  assert.equal(release.on.workflow_dispatch.inputs.approved_sha.required, true);
  assert.equal(release.on.workflow_dispatch.inputs.confirmation.required, true);
  assert.deepEqual(release.permissions, { contents: 'read' });
  assert.equal(release.jobs.build.permissions, undefined);
  assert.equal(release.jobs.deploy.needs, 'build');
  assert.deepEqual(release.jobs.deploy.permissions, { pages: 'write', 'id-token': 'write' });
  assert.equal(release.jobs.deploy.environment.name, 'github-pages');
  assert.equal(release.concurrency['cancel-in-progress'], false);
  const steps = release.jobs.build.steps;
  const guard = steps.findIndex((s) => s.run === 'node scripts/release-guard.mjs');
  const build = steps.findIndex((s) => (s.uses ?? '').startsWith('withastro/action@'));
  assert.ok(guard >= 0 && guard < build);
  assert.equal(steps[guard].env.RELEASE_APPROVED_SHA, '${{ vars.PAGES_APPROVED_SHA }}');
  assert.equal(steps[guard].env.RELEASE_INPUT_SHA, '${{ inputs.approved_sha }}');
  assert.equal(steps[build].with['build-cmd'], 'bash scripts/verify-release.sh');
  assert.equal(steps[build].with['out-dir'], 'dist');
  assert.equal(steps[build].with.cache, 'false');
});
test('all workflow actions use immutable commits and checkouts discard credentials', () => {
  for (const workflow of workflows) {
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps) {
        if (!step.uses) continue;
        assert.match(step.uses, /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+@[a-f0-9]{40}$/);
        if (step.uses.startsWith('actions/checkout@'))
          assert.equal(step.with['persist-credentials'], false);
      }
    }
  }
});
test('CI and release enforce one lockfile, runtime and full audit path', () => {
  for (const workflow of workflows) {
    const job = workflow.jobs.build ?? workflow.jobs.validate;
    const setup = job.steps.find((s) => (s.uses ?? '').startsWith('actions/setup-node@'));
    assert.equal(setup.with['node-version'], '24.19.0');
    assert.equal(setup.with['cache-dependency-path'], 'package-lock.json');
    assert.ok(job.steps.some((s) => s.run === 'npm ci --no-fund'));
    assert.ok(
      job.steps.some((s) => s.run === 'npx --no-install playwright install --with-deps chromium'),
    );
  }
  const common = readFileSync(new URL('../scripts/verify-ci.sh', import.meta.url), 'utf8');
  for (const command of [
    'npm run validate',
    'npm run test:e2e',
    'npm run test:lighthouse',
    'npm audit --audit-level=high',
  ])
    assert.ok(common.includes(command));
  const deploy = readFileSync(new URL('../scripts/verify-release.sh', import.meta.url), 'utf8');
  assert.ok(deploy.includes('npm ci --no-fund'));
  assert.ok(deploy.includes('bash scripts/verify-ci.sh'));
  assert.ok(deploy.includes('git diff --exit-code -- package.json package-lock.json'));
});
