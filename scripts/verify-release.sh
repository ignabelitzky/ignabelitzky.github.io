#!/usr/bin/env bash
set -euo pipefail

# The pinned official Astro action first runs npm install. Reject any lock drift,
# then use the same immutable install and verification path as CI.
git diff --exit-code -- package.json package-lock.json
npm ci --no-fund
bash scripts/verify-ci.sh
git diff --exit-code -- package.json package-lock.json
