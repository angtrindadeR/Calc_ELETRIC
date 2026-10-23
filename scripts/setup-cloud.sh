#!/usr/bin/env bash
set -euo pipefail
cd /workspace/Calc_ELETRIC
node -e "if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Use Node.js 24, conforme .nvmrc')"
test -f package-lock.json
export npm_config_cache=/tmp/eletricalc-npm
export EXPO_OFFLINE=1
export EXPO_NO_CACHE=1
export EXPO_NO_TELEMETRY=1
npm ci --no-audit --no-fund
npm run typecheck
npm test
npm run build:web
