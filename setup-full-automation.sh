#!/bin/bash
# Complete CI/CD Automation Setup & Testing Script
# Run this once to set up and test the entire automation pipeline
# Usage: ./setup-full-automation.sh

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# State file to track progress
STATE_FILE=".automation-setup-state"

# Function to print headers
header() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Function to print success
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print info
info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Confirm user action
confirm() {
    read -p "$(echo -e ${YELLOW}$1${NC}) (y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Check prerequisites
check_prerequisites() {
    header "Checking Prerequisites"
    
    local missing=0
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js not found. Please install Node.js 18+"
        missing=1
    else
        success "Node.js $(node --version) found"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm not found. Please install npm"
        missing=1
    else
        success "npm $(npm --version) found"
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker not found. Please install Docker"
        missing=1
    else
        success "Docker found"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose not found. Please install Docker Compose"
        missing=1
    else
        success "Docker Compose found"
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        error "Git not found. Please install Git"
        missing=1
    else
        success "Git $(git --version | awk '{print $3}') found"
    fi
    
    if [ $missing -eq 1 ]; then
        error "Please install missing prerequisites"
        exit 1
    fi
    
    success "All prerequisites met!"
}

# Phase 1: Setup Dependencies
phase_dependencies() {
    header "Phase 1: Installing Dependencies"
    
    info "Running: npm ci"
    npm ci
    
    success "Dependencies installed"
}

# Phase 2: Code Quality & Tests
phase_quality_tests() {
    header "Phase 2: Code Quality & Testing"
    
    info "TypeScript type checking..."
    npm run type-check
    success "Type checking passed"
    
    info "ESLint linting..."
    npm run lint
    success "Linting passed"
    
    info "Running unit tests..."
    npm run test
    success "Tests passed"
    
    info "Generating coverage report..."
    npm run test:coverage
    success "Coverage report generated"
    
    info "Running security audit..."
    npm run security:audit
    success "Security audit passed"
}

# Phase 3: Build
phase_build() {
    header "Phase 3: Building Application"
    
    info "Building for production..."
    npm run build
    
    if [ -d "dist" ]; then
        success "Production build successful"
        info "Build output: $(du -sh dist | awk '{print $1}')"
    else
        error "Build failed - dist/ directory not created"
        exit 1
    fi
}

# Phase 4: Docker Build
phase_docker_build() {
    header "Phase 4: Building Docker Image"
    
    info "Building Docker image: resume-builder:latest"
    docker build -t resume-builder:latest .
    
    if docker images | grep -q resume-builder; then
        success "Docker image built successfully"
        docker images | grep resume-builder | head -1
    else
        error "Docker build failed"
        exit 1
    fi
}

# Phase 5: Test Docker Container
phase_docker_test() {
    header "Phase 5: Testing Docker Container"
    
    info "Starting test container..."
    
    CONTAINER_ID=$(docker run -d -p 8888:80 resume-builder:latest 2>/dev/null) || {
        error "Failed to start container"
        exit 1
    }
    
    success "Container started: $CONTAINER_ID"
    
    # Wait for container to be healthy
    info "Waiting for container to be healthy..."
    for i in {1..30}; do
        if curl -f http://localhost:8888/health > /dev/null 2>&1; then
            success "Container health check passed"
            break
        fi
        if [ $i -eq 30 ]; then
            error "Container health check timed out"
            docker logs $CONTAINER_ID
            docker stop $CONTAINER_ID
            docker rm $CONTAINER_ID
            exit 1
        fi
        sleep 1
    done
    
    # Test main app
    info "Testing main application..."
    if curl -f http://localhost:8888/ > /dev/null 2>&1; then
        success "Application responds to requests"
    else
        error "Application health check failed"
        docker logs $CONTAINER_ID
        docker stop $CONTAINER_ID
        docker rm $CONTAINER_ID
        exit 1
    fi
    
    # Cleanup test container
    info "Stopping test container..."
    docker stop $CONTAINER_ID > /dev/null
    docker rm $CONTAINER_ID > /dev/null
    success "Test container cleaned up"
}

# Phase 6: Start Monitoring Stack
phase_monitoring() {
    header "Phase 6: Starting Monitoring Stack"
    
    if confirm "Start monitoring stack? (Prometheus, Grafana, Alertmanager)"; then
        info "Starting: docker-compose -f docker-compose.monitoring.yml up -d"
        docker-compose -f docker-compose.monitoring.yml up -d
        
        # Wait for services to be ready
        info "Waiting for services to start (30 seconds)..."
        sleep 30
        
        # Check services
        if docker-compose -f docker-compose.monitoring.yml ps | grep -q "Up"; then
            success "Monitoring stack started"
            echo ""
            echo -e "${GREEN}Access Points:${NC}"
            echo "  • Prometheus: http://localhost:9090"
            echo "  • Grafana: http://localhost:3000 (admin/admin)"
            echo "  • Alertmanager: http://localhost:9093"
            echo ""
            echo -e "${YELLOW}To stop monitoring stack later:${NC}"
            echo "  docker-compose -f docker-compose.monitoring.yml down"
        else
            error "Monitoring stack failed to start"
            docker-compose -f docker-compose.monitoring.yml logs
        fi
    else
        warning "Monitoring stack skipped"
    fi
}

# Phase 7: Setup Jenkins
phase_jenkins() {
    header "Phase 7: Setting Up Jenkins"
    
    if confirm "Start Jenkins for pipeline testing?"; then
        
        # Create Jenkins home directory
        mkdir -p ~/jenkins_home
        
        info "Starting Jenkins container..."
        docker run -d \
            -p 8080:8080 \
            -p 50000:50000 \
            -v ~/jenkins_home:/var/jenkins_home \
            -v /var/run/docker.sock:/var/run/docker.sock \
            --name jenkins \
            jenkins/jenkins:lts
        
        success "Jenkins container started"
        
        # Wait for Jenkins to start
        info "Waiting for Jenkins to initialize (60 seconds)..."
        sleep 60
        
        # Get initial password
        JENKINS_PASSWORD=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null) || JENKINS_PASSWORD="<password-file>"
        
        echo ""
        echo -e "${GREEN}Jenkins Setup Instructions:${NC}"
        echo "========================================"
        echo "1. Open Jenkins UI:"
        echo "   http://localhost:8080"
        echo ""
        echo "2. Initial Admin Password:"
        echo "   $JENKINS_PASSWORD"
        echo ""
        echo "3. Click 'Install suggested plugins' and wait"
        echo ""
        echo "4. Create first admin user with your credentials"
        echo ""
        echo "5. Install additional plugins:"
        echo "   - Docker Pipeline"
        echo "   - Slack Notification"
        echo "   - GitHub Integration"
        echo "   - Blue Ocean"
        echo ""
        echo "6. Add Credentials (Manage Jenkins → Manage Credentials):"
        echo "   - github-credentials: GitHub personal access token"
        echo "   - docker-credentials: Docker registry credentials (optional)"
        echo "   - slack-webhook-url: Slack webhook URL (optional)"
        echo ""
        echo "7. Create New Pipeline Job:"
        echo "   - Name: 'resume-builder'"
        echo "   - Pipeline → Definition: 'Pipeline script'"
        echo "   - Copy content from Jenkinsfile.production"
        echo ""
        echo "8. Click 'Build Now' to test the pipeline"
        echo ""
        echo -e "${YELLOW}To stop Jenkins later:${NC}"
        echo "  docker stop jenkins && docker rm jenkins"
        echo "========================================"
        
        if confirm "Open Jenkins in browser now?"; then
            # Try to open in default browser
            if command -v open &> /dev/null; then
                open http://localhost:8080
            elif command -v xdg-open &> /dev/null; then
                xdg-open http://localhost:8080
            else
                info "Please open http://localhost:8080 in your browser"
            fi
        fi
        
    else
        warning "Jenkins setup skipped"
        echo ""
        echo -e "${YELLOW}To set up Jenkins manually later:${NC}"
        echo "  docker run -d -p 8080:8080 -p 50000:50000 \\"
        echo "    -v ~/jenkins_home:/var/jenkins_home \\"
        echo "    -v /var/run/docker.sock:/var/run/docker.sock \\"
        echo "    --name jenkins jenkins/jenkins:lts"
        echo ""
    fi
}

# Phase 8: Final Summary
phase_summary() {
    header "Setup Complete!"
    
    echo -e "${GREEN}All automation components are now configured!${NC}"
    echo ""
    echo "Next Steps:"
    echo "==========="
    echo ""
    echo "1. Jenkins Pipeline Testing:"
    echo "   - Go to http://localhost:8080"
    echo "   - Complete initial setup"
    echo "   - Create pipeline job with Jenkinsfile.production"
    echo "   - Click 'Build Now'"
    echo ""
    echo "2. GitHub Webhook Setup:"
    echo "   - Repository Settings → Webhooks → Add webhook"
    echo "   - Payload URL: http://your-jenkins-url/github-webhook/"
    echo "   - Content type: application/json"
    echo "   - Events: Push events"
    echo ""
    echo "3. Configure Notifications:"
    echo "   - Create Slack webhook: https://api.slack.com/messaging/webhooks"
    echo "   - Add as Jenkins credential: slack-webhook-url"
    echo ""
    echo "4. HTTPS Setup (Production):"
    echo "   - See HTTPS_SETUP.md for Let's Encrypt setup"
    echo ""
    echo "Documentation:"
    echo "=============="
    echo "  • CI_CD_GUIDE.md - Complete implementation guide"
    echo "  • SECURITY_SCANNING.md - Security scanning details"
    echo "  • HTTPS_SETUP.md - SSL/TLS configuration"
    echo "  • TESTING_AUTOMATION.md - Detailed testing guide"
    echo "  • IMPLEMENTATION_SUMMARY.md - Quick reference"
    echo ""
    echo "Running Services:"
    echo "================="
    
    if docker ps | grep -q "jenkins"; then
        echo -e "  ${GREEN}✓${NC} Jenkins - http://localhost:8080"
    fi
    
    if docker-compose -f docker-compose.monitoring.yml ps 2>/dev/null | grep -q "Up"; then
        echo -e "  ${GREEN}✓${NC} Prometheus - http://localhost:9090"
        echo -e "  ${GREEN}✓${NC} Grafana - http://localhost:3000"
        echo -e "  ${GREEN}✓${NC} Alertmanager - http://localhost:9093"
    fi
    
    echo ""
    echo "Useful Commands:"
    echo "================"
    echo "  # View logs"
    echo "  docker logs jenkins"
    echo ""
    echo "  # Stop all services"
    echo "  docker stop jenkins"
    echo "  docker-compose -f docker-compose.monitoring.yml down"
    echo ""
    echo "  # Run automation tests only"
    echo "  ./test-automation.sh"
    echo ""
    echo "  # Clean up everything"
    echo "  docker stop jenkins"
    echo "  docker-compose -f docker-compose.monitoring.yml down"
    echo ""
    echo -e "${GREEN}✓ Automation pipeline is ready!${NC}"
}

# Main execution
main() {
    clear
    
    header "Resume Builder - Complete CI/CD Automation Setup"
    
    # Check if already running
    if [ -f "$STATE_FILE" ]; then
        warning "Previous setup state found. Starting fresh..."
        rm "$STATE_FILE"
    fi
    
    # Check prerequisites
    check_prerequisites
    
    # Ask which phases to run
    echo ""
    info "This script will:"
    echo "  1. Install dependencies"
    echo "  2. Run code quality checks and tests"
    echo "  3. Build production artifacts"
    echo "  4. Build Docker image"
    echo "  5. Test Docker container"
    echo "  6. (Optional) Start monitoring stack"
    echo "  7. (Optional) Start Jenkins"
    echo ""
    
    if ! confirm "Continue with full setup?"; then
        warning "Setup cancelled"
        exit 0
    fi
    
    # Run phases
    phase_dependencies
    phase_quality_tests
    phase_build
    phase_docker_build
    phase_docker_test
    phase_monitoring
    phase_jenkins
    phase_summary
    
    # Mark as complete
    touch "$STATE_FILE"
}

# Run main
main "$@"
