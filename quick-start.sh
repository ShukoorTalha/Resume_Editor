#!/bin/bash
# Quick Start Script - Minimal Setup
# Fast track for experienced users who just want to get everything running
# Usage: ./quick-start.sh

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Resume Builder - Quick Start${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Fast track: Just run tests and start services
echo -e "${YELLOW}Running automated tests...${NC}"
npm ci > /dev/null
npm run type-check > /dev/null 2>&1 && echo -e "${GREEN}✓${NC} Type check passed" || echo -e "${RED}✗${NC} Type check failed"
npm run lint > /dev/null 2>&1 && echo -e "${GREEN}✓${NC} Lint passed" || echo -e "${RED}✗${NC} Lint failed"
npm run test > /dev/null 2>&1 && echo -e "${GREEN}✓${NC} Tests passed" || echo -e "${RED}✗${NC} Tests failed"
npm run test:coverage > /dev/null 2>&1 && echo -e "${GREEN}✓${NC} Coverage generated" || true
npm run security:audit > /dev/null 2>&1 && echo -e "${GREEN}✓${NC} Security audit passed" || echo -e "${RED}✗${NC} Security audit failed"

echo ""
echo -e "${YELLOW}Building...${NC}"
npm run build > /dev/null && echo -e "${GREEN}✓${NC} Build successful" || exit 1

echo ""
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t resume-builder:latest . > /dev/null && echo -e "${GREEN}✓${NC} Docker image built" || exit 1

echo ""
echo -e "${YELLOW}Testing Docker container...${NC}"
CONTAINER_ID=$(docker run -d -p 8888:80 resume-builder:latest)
sleep 3
curl -f http://localhost:8888/health > /dev/null 2>&1 && echo -e "${GREEN}✓${NC} Container is healthy" || echo -e "${RED}✗${NC} Container health check failed"
docker stop $CONTAINER_ID > /dev/null
docker rm $CONTAINER_ID > /dev/null

echo ""
echo -e "${YELLOW}Starting monitoring stack...${NC}"
docker-compose -f docker-compose.monitoring.yml up -d > /dev/null 2>&1 && echo -e "${GREEN}✓${NC} Monitoring stack started" || echo -e "${RED}✗${NC} Failed to start monitoring"
sleep 10

echo ""
echo -e "${YELLOW}Starting Jenkins...${NC}"
mkdir -p ~/jenkins_home
docker run -d \
    -p 8080:8080 -p 50000:50000 \
    -v ~/jenkins_home:/var/jenkins_home \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --name jenkins \
    jenkins/jenkins:lts > /dev/null 2>&1 && echo -e "${GREEN}✓${NC} Jenkins started" || echo -e "${RED}✗${NC} Jenkins failed"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All systems ready!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""
echo "Access your services:"
echo "  • Jenkins: http://localhost:8080"
echo "  • Prometheus: http://localhost:9090"
echo "  • Grafana: http://localhost:3000 (admin/admin)"
echo "  • Alertmanager: http://localhost:9093"
echo ""
echo "Stop services:"
echo "  • Docker: docker stop jenkins && docker rm jenkins"
echo "  • Monitoring: docker-compose -f docker-compose.monitoring.yml down"
echo ""
