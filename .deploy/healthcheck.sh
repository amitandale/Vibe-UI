#!/usr/bin/env bash
set -euo pipefail
ENV_FILE="${ENV_FILE:-/etc/vibe/vibe-ui.env}"
if [[ -f "$ENV_FILE" ]]; then set -a; . "$ENV_FILE"; set +a; fi
PORT="${PORT:-3000}"
ok=0
for path in "/" "/health"; do
  url="http://127.0.0.1:${PORT}${path}"
  echo "Probing ${url}"
  if curl -fsSIL "$url" >/dev/null; then
    ok=1
    break
  fi
done
if [[ "$ok" -eq 1 ]]; then
  echo "OK"
else
  echo "Health probe failed" >&2
  exit 1
fi
