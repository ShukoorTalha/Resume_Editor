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

echo "${YELLOW}Starting the local app...${NC}"

if docker compose version >/dev/null 2>&1; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

echo ""
echo "${GREEN}The app is starting now.${NC}"
echo "${BLUE}Open http://localhost:8081 in your browser.${NC}"
echo "${BLUE}To stop it later, run 'docker compose down'.${NC}"
