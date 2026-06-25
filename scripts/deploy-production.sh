#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f wrangler.production.toml ]]; then
  echo "Missing wrangler.production.toml - copy wrangler.production.toml.example and fill in your bindings." >&2
  exit 1
fi

if grep -qE 'your-kv-namespace-id|your-r2-bucket-name|replace-with-caretcms' wrangler.production.toml; then
  echo "wrangler.production.toml still contains placeholder bindings." >&2
  exit 1
fi

PUBLIC_CONFIG_BACKUP="$(mktemp "${TMPDIR:-/tmp}/sterling-wrangler-public.XXXXXX.toml")"
cleanup() {
  if [[ -f "$PUBLIC_CONFIG_BACKUP" ]]; then
    cp "$PUBLIC_CONFIG_BACKUP" wrangler.toml
    rm -f "$PUBLIC_CONFIG_BACKUP"
  fi
}
trap cleanup EXIT

cp wrangler.toml "$PUBLIC_CONFIG_BACKUP"
cp wrangler.production.toml wrangler.toml

npm run build
npx wrangler deploy --config dist/server/wrangler.json
