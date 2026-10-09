import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, lstatSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = resolve('dist');
const files = {};
function visit(directory) {
  for (const name of readdirSync(directory).sort()) {
    const path = resolve(directory, name);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) throw new Error('Pages artifact must not contain symbolic links');
    if (stat.isDirectory()) visit(path);
    else if (stat.isFile()) {
      if (stat.nlink !== 1) throw new Error('Pages artifact must not contain hard links');
      files[relative(root, path).replaceAll('\\', '/')] = createHash('sha256')
        .update(readFileSync(path))
        .digest('hex');
    }
  }
}
visit(root);
if (!files['index.html'] || !files['404.html'] || !files['es/index.html'])
  throw new Error('Pages root files missing');
const evidence = resolve(process.env.QA_EVIDENCE_DIR ?? 'evidence/phase6/local');
mkdirSync(evidence, { recursive: true });
writeFileSync(
  resolve(evidence, 'build-manifest.json'),
  JSON.stringify({ commit: process.env.GITHUB_SHA ?? null, files }, null, 2) + '\n',
);
console.log(`Recorded SHA-256 manifest for ${Object.keys(files).length} actual dist files`);
