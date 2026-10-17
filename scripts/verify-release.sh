#!/usr/bin/env bash
set -euo pipefail

# The pinned official Astro action first runs npm install. Reject any lock drift,
# then use the same immutable install and verification path as CI.
if [[ ! "${GA_MEASUREMENT_ID:-}" =~ ^G-[A-Z0-9]{4,}$ ]]; then
  echo 'GA_MEASUREMENT_ID must contain a valid GA4 web measurement ID.' >&2
  exit 1
fi
git diff --exit-code -- package.json package-lock.json
npm ci --no-fund
bash scripts/verify-ci.sh
PUBLIC_GA_MEASUREMENT_ID="${GA_MEASUREMENT_ID}" npm run build
PUBLIC_GA_MEASUREMENT_ID="${GA_MEASUREMENT_ID}" npm run test:build
node scripts/build-manifest.mjs
git diff --exit-code -- package.json package-lock.json
