import { fileURLToPath } from 'node:url';

// This validates the exact dispatched commit; it cannot grant publication consent.
export function assertReleaseApproval(env) {
  if (env.GITHUB_EVENT_NAME !== 'workflow_dispatch') throw new Error('Manual dispatch required');
  if (env.GITHUB_REPOSITORY !== 'ignabelitzky/ignabelitzky.github.io')
    throw new Error('Unexpected release repository');
  if (env.GITHUB_REF !== 'refs/heads/main') throw new Error('Release must use main');
  if (env.RELEASE_CONFIRMATION !== 'PUBLISH')
    throw new Error('Public-release confirmation missing');
  const sha = env.GITHUB_SHA;
  if (!/^[a-f0-9]{40}$/.test(sha ?? '')) throw new Error('Full commit SHA required');
  if (env.RELEASE_INPUT_SHA !== sha || env.RELEASE_APPROVED_SHA !== sha)
    throw new Error('Dispatched commit differs from the explicitly approved SHA');
  return sha;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Approved exact release commit: ${assertReleaseApproval(process.env)}`);
}
