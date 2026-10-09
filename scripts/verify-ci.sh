#!/usr/bin/env bash
set -euo pipefail

test "$(node --version)" = 'v24.19.0'
test "$(npm --version)" = '11.9.0'
test "$(python3 --version | cut -d ' ' -f 1)" = 'Python'
lock_before=$(sha256sum package-lock.json | cut -d ' ' -f 1)
npm run validate
npm run test:e2e
npm run test:lighthouse
npm audit --audit-level=high
test "$(sha256sum package-lock.json | cut -d ' ' -f 1)" = "$lock_before"
node scripts/build-manifest.mjs
