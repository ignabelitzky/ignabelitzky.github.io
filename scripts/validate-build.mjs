import { spawnSync } from 'node:child_process';
const windows = process.platform === 'win32';
const result = spawnSync(
  windows ? 'py' : 'python3',
  [...(windows ? ['-3'] : []), 'scripts/validate_build.py'],
  { stdio: 'inherit' },
);
if (result.error) {
  console.error('Python 3 is required for the built-output checker:', result.error.message);
}
process.exit(result.status ?? 1);
