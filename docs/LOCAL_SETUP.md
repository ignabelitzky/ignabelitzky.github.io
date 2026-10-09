# Local setup — Phase 3

Tested in Work: Linux, Node 24.19.0, npm 11.9.0, Python 3.12.14. Your Fedora/macOS/Windows installation has not been tested here. Use Node 24 LTS; do not select the Node 26 Current stream for this locked checkpoint. Engines permit later compatible Node 24 patches, but this report covers only the tested patch.

## Fedora Linux (bash)

If `nvm` already exists, skip installing it. For a fresh setup, the current nvm project's documented installer is version 0.40.8; it installs a per-user manager and may update your shell profile. These are instructions, not actions already performed on your PC.

```bash
sudo dnf install curl git python3
curl --fail --location --output /tmp/ignacio-nvm-install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh
bash /tmp/ignacio-nvm-install.sh
source ~/.bashrc
command -v nvm
```

Extract the source ZIP and enter its actual folder:

```bash
cd ~/Downloads/ignabelitzky-portfolio
nvm install
nvm use
node --version
npm --version
```

`.nvmrc` selects 24.19.0. If npm is outside the required 11.x range, select the tested npm under this user-managed Node installation:

```bash
npm install --global npm@11.9.0
```

Run the project:

```bash
npm ci
npm run format:check
npm run lint
npm run check
npm test
npm run build
npm run test:build
npm run preview -- --port 4321
```

Visit `http://localhost:4321/` and `/es/`. Ctrl+C stops the server. For editing with hot reload, use `npm run dev` instead. The preview binds to loopback; no remote/public hosting is configured.

## macOS

Use an existing nvm setup and the same `nvm install` / `nvm use` commands, or install Node 24 using the official Node downloads. If nvm needs installation, follow its linked official README; shell setup differs for zsh. Install Python 3 from its official installer if `python3 --version` is unavailable. Enter the extracted project folder and use the npm commands above. Sharp/Tailwind choose platform-specific optional binaries from the lockfile; do not copy Linux node_modules to macOS.

## Windows 11 (PowerShell)

Install Node 24 using the official Windows installer and Python 3 with its launcher. Do not use POSIX nvm's bash installer in native PowerShell. Reopen the terminal after installation.

```powershell
cd "$HOME\Downloads\ignabelitzky-portfolio"
node --version
npm --version
py -3 --version
npm ci
npm run check
npm test
npm run build
npm run test:build
npm run preview -- --port 4321
```

The Node wrapper automatically launches `py -3` for build validation. For the complete logged sequence: `py -3 scripts/run_checks.py`. If PowerShell rejects `npm.ps1`, run the same commands with `npm.cmd`; no system execution-policy change is necessary. Use native Windows dependencies from npm ci instead of copying Linux node_modules.

## Prebuilt review without Node

The separate preview ZIP contains the tested dist tree. Extract it, enter the folder containing `dist`, then:

```bash
python3 -m http.server 4321 --bind 127.0.0.1 --directory dist
```

Windows: `py -3 -m http.server 4321 --bind 127.0.0.1 --directory dist`. Open the same localhost URLs. Python's simple server does not apply GitHub Pages' custom fallback behavior: directly visit `/404.html` or `/es/404/` to inspect those files. Astro preview is the preferred production-preview command after npm ci.

## Troubleshooting

- Engine mismatch: activate Node 24 and npm 11; check `command -v node` on Linux/macOS or `Get-Command node` in PowerShell.
- Native package/Sharp error: run npm ci on the current OS, with optional dependencies enabled. Never transplant node_modules between systems. Record the actual error before changing the lockfile.
- Port occupied: use `npm run dev -- --port 4322` or the corresponding preview command, then open that port.
- Blank file-URL preview: serve dist over localhost; URLs intentionally target the eventual domain root.
- Theme storage blocked: the current-page choice remains usable; no-JS uses OS-aware CSS and hides the enhancement-only select. Actual browser behavior needs manual verification.
- `nvm: command not found`: reopen bash or source the appropriate profile as the nvm README describes.

## Official setup sources rechecked 2026-10-09

- [Node release policy](https://nodejs.org/en/about/previous-releases) and [downloads](https://nodejs.org/en/download).
- [nvm installation README](https://github.com/nvm-sh/nvm#installing-and-updating), version 0.40.8 observed.
- [Astro installation](https://docs.astro.build/en/install-and-setup/) and [Tailwind Astro integration](https://tailwindcss.com/docs/installation/framework-guides/astro).

The exact Node archive SHASUMS URL was inaccessible through web retrieval. No checksum value is asserted or substituted here. The existing runtime was used; no Node download/install or user-PC setup was performed.
