#!/bin/sh
set -eu

start_cloudflared() {
  if [ -n "${CLOUDFLARED_TUNNEL_TOKEN:-}" ]; then
    cloudflared tunnel --no-autoupdate run --token "$CLOUDFLARED_TUNNEL_TOKEN" &
    CLOUDFLARED_PID=$!
  fi
}

cleanup() {
  if [ -n "${CLOUDFLARED_PID:-}" ]; then
    kill "$CLOUDFLARED_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup INT TERM

start_cloudflared
exec "$@"