#!/bin/sh
# Quick Start Script - One command for non-technical users.
# Usage: ./quick-start.sh

set -eu

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "${BLUE}═══════════════════════════════════════════════════${NC}"
echo "${BLUE}Resume Builder - Quick Start${NC}"
echo "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

if ! command -v docker >/dev/null 2>&1; then
    echo "${RED}Docker is not installed or not available on this machine.${NC}"
    exit 1
fi

if ! docker-compose version >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
    echo "${RED}Docker Compose is not available.${NC}"
    exit 1
fi

if [ ! -f .env ] || ! grep -q '^CLOUDFLARED_TUNNEL_TOKEN=' .env 2>/dev/null; then
    echo "${YELLOW}Cloudflare tunnel token is needed once to start the shared app.${NC}"
    printf "Paste the token now: "
    stty -echo
    read -r CLOUDFLARED_TUNNEL_TOKEN
    stty echo
    echo ""

    if [ -z "${CLOUDFLARED_TUNNEL_TOKEN:-}" ]; then
        echo "${RED}No token provided. Aborting.${NC}"
        exit 1
    fi

    cat > .env <<EOF
CLOUDFLARED_TUNNEL_TOKEN=${CLOUDFLARED_TUNNEL_TOKEN}
EOF
    chmod 600 .env
fi

echo "${YELLOW}Starting the app and tunnel...${NC}"

if docker compose version >/dev/null 2>&1; then
    docker compose -f docker-compose.tunnel.yml up -d --build
else
    docker-compose -f docker-compose.tunnel.yml up -d --build
fi

echo ""
echo "${GREEN}The app is starting now.${NC}"
echo "${BLUE}Your Cloudflare tunnel will be available through the hostname configured in Cloudflare.${NC}"
echo "${BLUE}To stop it later, run the same compose file with 'down'.${NC}"
