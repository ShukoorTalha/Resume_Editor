#!/bin/bash
# Quick Test Script for Resume Builder CI/CD Automation
# Run this to test all components locally before pushing to Jenkins

set -e

echo "================================"
echo "Resume Builder CI/CD Test Suite"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for tests
PASSED=0
FAILED=0

# Test function
run_test() {
    local test_name=$1
    local command=$2
    
    echo -n "Testing: $test_name ... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
        eval "$command" # Run again to show error
    fi
}

# Phase 1: Local Testing
echo -e "${YELLOW}Phase 1: Local Code Testing${NC}"
echo "================================"

run_test "npm ci (dependencies)" "npm ci"
run_test "TypeScript type check" "npm run type-check"
run_test "ESLint linting" "npm run lint"
run_test "Unit tests" "npm run test"
run_test "Code coverage" "npm run test:coverage"
run_test "Security audit" "npm run security:audit"
run_test "Production build" "npm run build"

# Phase 2: Docker Testing
echo ""
echo -e "${YELLOW}Phase 2: Docker Testing${NC}"
echo "================================"

# Build image
run_test "Docker image build" "docker build -t resume-builder:test ."

# Run container
echo -n "Testing: Docker container startup ... "
CONTAINER_ID=$(docker run -d -p 8888:80 resume-builder:test 2>/dev/null) || CONTAINER_ID=""

if [ -n "$CONTAINER_ID" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
    
    # Wait for container to be healthy
    sleep 3
    
    # Test health endpoint
    run_test "Container health endpoint" "curl -f http://localhost:8888/health"
    
    # Test main app loads
    run_test "Main app loads" "curl -f http://localhost:8888/ | grep -q 'Resume'"
    
    # Cleanup
    echo -n "Cleaning up: Docker container ... "
    docker stop $CONTAINER_ID > /dev/null 2>&1
    docker rm $CONTAINER_ID > /dev/null 2>&1
    echo -e "${GREEN}done${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Phase 3: Security Scanning
echo ""
echo -e "${YELLOW}Phase 3: Security Scanning${NC}"
echo "================================"

# Check if Trivy is installed
if command -v trivy &> /dev/null; then
    run_test "Docker image scan (Trivy)" "trivy image --severity CRITICAL resume-builder:test"
else
    echo -e "${YELLOW}⊘ SKIPPED${NC}: Trivy not installed (install with: curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin)"
fi

# Check if Semgrep is installed
if command -v semgrep &> /dev/null; then
    run_test "SAST scanning (Semgrep)" "semgrep --config=p/security-audit --quiet"
else
    echo -e "${YELLOW}⊘ SKIPPED${NC}: Semgrep not installed (install with: pip install semgrep)"
fi

# Phase 4: Cleanup
echo ""
echo -e "${YELLOW}Phase 4: Cleanup${NC}"
echo "================================"

echo -n "Removing test Docker image ... "
docker rmi resume-builder:test > /dev/null 2>&1 && echo -e "${GREEN}done${NC}" || echo -e "${RED}failed${NC}"

echo -n "Removing dist build directory ... "
rm -rf dist && echo -e "${GREEN}done${NC}"

# Results Summary
echo ""
echo "================================"
echo "Test Results Summary"
echo "================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Your automation is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push changes to GitHub"
    echo "2. Set up Jenkins with Jenkinsfile.production"
    echo "3. Configure GitHub webhooks"
    echo "4. Start monitoring stack: docker-compose -f docker-compose.monitoring.yml up -d"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Fix issues before proceeding.${NC}"
    exit 1
fi
