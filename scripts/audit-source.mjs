import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const directory = resolve(root, process.env.QA_EVIDENCE_DIR ?? 'evidence/phase5');
mkdirSync(directory, { recursive: true });
const css = readFileSync(resolve(root, 'src/styles/global.css'), 'utf8');
const lightBlock = css.match(/:root\s*\{([^}]+)\}/)?.[1];
const darkBlock = css.match(/:root\[data-theme='dark'\]\s*\{([^}]+)\}/)?.[1];
if (!lightBlock || !darkBlock) throw new Error('Actual theme token blocks were not found');
const colors = (block) =>
  Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6}|#[0-9a-f]{3})\b/gi)].map((match) => [
      match[1],
      match[2],
    ]),
  );
function luminance(hex) {
  if (hex.length === 4) hex = '#' + [...hex.slice(1)].map((part) => part + part).join('');
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((part) => parseInt(part, 16) / 255);
  const linear = rgb.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
const pairs = [
  ['body text', 'ink', 'bg', 4.5],
  ['muted text', 'muted', 'bg', 4.5],
  ['muted surface text', 'muted', 'surface', 4.5],
  ['panel small labels', 'muted', 'panel', 4.5],
  ['soft-panel small labels', 'muted', 'soft', 4.5],
  ['link', 'accent', 'bg', 4.5],
  ['surface link', 'accent', 'surface', 4.5],
  ['hover link', 'accent-hover', 'bg', 4.5],
  ['button text', 'bg', 'accent', 4.5],
  ['button hover text', 'bg', 'accent-hover', 4.5],
  ['inverse panel', 'bg', 'ink', 4.5],
  ['tag text', 'ink', 'soft', 4.5],
  ['control border', 'control', 'bg', 3],
  ['focus outline', 'accent', 'bg', 3],
];
const contrast = [];
for (const [theme, tokens] of [
  ['light', colors(lightBlock)],
  ['dark', colors(darkBlock)],
]) {
  for (const [purpose, foreground, background, required] of pairs) {
    if (!tokens[foreground] || !tokens[background]) throw new Error('Missing actual theme token');
    const values = [luminance(tokens[foreground]), luminance(tokens[background])].sort(
      (a, b) => b - a,
    );
    const ratio = (values[0] + 0.05) / (values[1] + 0.05);
    contrast.push({
      theme,
      purpose,
      foreground: tokens[foreground],
      background: tokens[background],
      ratio: Number(ratio.toFixed(3)),
      required,
      pass: ratio >= required,
    });
  }
}
const packageData = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const config = readFileSync(resolve(root, 'astro.config.mjs'), 'utf8');
const site = readFileSync(resolve(root, 'src/data/site.ts'), 'utf8');
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(resolve(directory, entry.name)) : [resolve(directory, entry.name)],
  );
}
const sourceFiles = files(resolve(root, 'src'));
const publicFiles = [...sourceFiles, ...files(resolve(root, 'public'))].filter((path) =>
  /\.(ts|astro|json|css|js|mjs|svg|txt)$/.test(path),
);
const combined = publicFiles.map((path) => readFileSync(path, 'utf8')).join('\n');
const checks = [
  {
    name: 'Static Astro, approved custom-domain root origin, no SSR adapter or repo base',
    pass:
      /output:\s*'static'/.test(config) &&
      /site:\s*'https:\/\/ignaciobelitzky\.dev'/.test(config) &&
      !/\bbase\s*:|\badapter\s*:/.test(config),
  },
  {
    name: 'No runtime React/framework or analytics dependency',
    pass: !Object.keys(packageData.dependencies).some((name) =>
      /react|vue|svelte|analytics|@astrojs\/(node|vercel|cloudflare)/.test(name),
    ),
  },
  {
    name: 'Explicit indexing policy; analytics and CV remain disabled',
    pass:
      /indexable:\s*(?:true|false)/.test(site) &&
      /analytics:\s*\{\s*enabled:\s*false/.test(site) &&
      /const cv:[\s\S]*?enabled:\s*false/.test(site),
  },
  {
    name: 'No unsafe string-to-HTML/eval injection in portfolio source',
    pass: !/(set:html|\.innerHTML\s*=|\beval\s*\(|\bnew Function\s*\()/.test(combined),
  },
  {
    name: 'No known credential patterns in portfolio source/public assets',
    pass: !/(-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|gh[pousr]_[a-zA-Z0-9]{30,}|AKIA[A-Z0-9]{16}|sk-(?:proj-)?[A-Za-z0-9_-]{32,})/.test(
      combined,
    ),
  },
  { name: 'No excluded private project in source content/config', pass: !/moki/i.test(combined) },
  {
    name: 'No remote CSS/font imports',
    pass: !/@import\s+(?:url\()?\s*["']?https?:\/\/|url\(["']?https?:\/\//.test(css),
  },
];
const report = {
  phase: 5,
  method:
    'Source/public text inspection and WCAG relative luminance on actual CSS tokens; no DOM/compositing/browser audit',
  contrast,
  checks,
  limitations: [
    'Does not prove runtime accessibility or security',
    'Does not inspect browser compositing, forced colors or third-party media rights',
    'Future trusted Markdown requires separate review',
  ],
};
writeFileSync(resolve(directory, 'source-audit.json'), JSON.stringify(report, null, 2) + '\n');
const failed = [...contrast.filter((row) => !row.pass), ...checks.filter((row) => !row.pass)];
console.log(
  `${contrast.length - failed.filter((row) => 'ratio' in row).length}/${contrast.length} CSS contrast pairs pass; ${checks.filter((row) => row.pass).length}/${checks.length} source checks pass.`,
);
for (const failure of failed) console.error(JSON.stringify(failure));
if (failed.length) process.exitCode = 1;
