# Testing the CI/CD Automation - Step-by-Step Guide

## Phase 1: Local Testing (Before Jenkins)

### 1. Test Dependencies & Installation
```bash
cd /Users/shukoortalha/Resume_Builder/Resume_Editor

# Install all dependencies
npm ci

# Verify installation
npm list
```

### 2. Test Code Quality Checks
```bash
# TypeScript type checking
npm run type-check
# Expected: ✓ No compilation errors

# ESLint linting
npm run lint
# Expected: May show warnings, but no errors

# Auto-fix linting issues
npm run lint:fix
```

### 3. Test Unit Tests
```bash
# Run tests once
npm run test
# Expected: ✓ Tests pass

# Run with coverage
npm run test:coverage
# Expected: Coverage report generated in ./coverage/

# View HTML coverage report
open coverage/index.html
```

### 4. Test Security Audit
```bash
# Run npm audit
npm run security:audit
# Expected: No moderate or higher vulnerabilities

# Generate detailed report
npm audit --json > npm-audit-report.json
cat npm-audit-report.json
```

### 5. Test Build
```bash
# Build for production
npm run build
# Expected: dist/ folder created with optimized files

# Verify build
ls -lah dist/
file dist/index.html
```

---

## Phase 2: Docker Testing

### 1. Build Docker Image
```bash
# Build image
docker build -t resume-builder:test .
# Expected: Successfully built image

# Verify image
docker images | grep resume-builder
```

### 2. Run Container
```bash
# Run container
docker run -d --name resume-builder-test -p 8080:80 resume-builder:test
# Expected: Container ID printed

# Check container is running
docker ps | grep resume-builder-test

# Check logs
docker logs resume-builder-test

# Check health
docker inspect resume-builder-test | grep -A 10 '"Health"'
```

### 3. Test Container Endpoints
```bash
# Test main app
curl -I http://localhost:8080/
# Expected: HTTP 200

# Test health endpoint
curl http://localhost:8080/health
# Expected: Response received

# Check HTML loads
curl http://localhost:8080/ | grep -o "<title>.*</title>"
```

### 4. Scan Docker Image
```bash
# Install Trivy if not already installed
which trivy || {
  curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
}

# Scan image
trivy image resume-builder:test
# Expected: Shows vulnerabilities if any (informational at this stage)

# Scan for critical only
trivy image --severity CRITICAL resume-builder:test
```

### 5. Cleanup
```bash
# Stop container
docker stop resume-builder-test

# Remove container
docker rm resume-builder-test

# Remove image
docker rmi resume-builder:test
```

---

## Phase 3: Monitoring Stack Testing

### 1. Start Monitoring Stack
```bash
# Start all monitoring services
docker-compose -f docker-compose.monitoring.yml up -d

# Verify all services are running
docker-compose -f docker-compose.monitoring.yml ps
# Expected: All services in "Up" state
```

### 2. Access Prometheus
```bash
# Open in browser
open http://localhost:9090

# Or check with curl
curl -s http://localhost:9090/-/healthy
# Expected: OK response
```

### 3. Access Grafana
```bash
# Open in browser
open http://localhost:3000

# Login with default credentials
# Username: admin
# Password: admin
# (Will ask to change password)

# Check data sources
Settings → Data Sources → Prometheus
# Expected: "Data source is working"
```

### 4. Check Prometheus Metrics
```bash
# List available metrics
curl -s http://localhost:9090/api/v1/query?query=up | jq

# Query node metrics
curl -s 'http://localhost:9090/api/v1/query?query=node_cpu_seconds_total' | jq

# View targets
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets'
```

### 5. Test Alertmanager
```bash
# Access Alertmanager
open http://localhost:9093

# Check configuration
curl -s http://localhost:9093/api/v1/status | jq

# View alerts
curl -s http://localhost:9093/api/v2/alerts | jq
```

### 6. Cleanup Monitoring Stack
```bash
docker-compose -f docker-compose.monitoring.yml down
```

---

## Phase 4: Jenkins Pipeline Testing

### 1. Install Jenkins (Using Docker)
```bash
# Create Jenkins home directory
mkdir -p ~/jenkins_home

# Run Jenkins
docker run -d \
  -p 8080:8080 \
  -p 50000:50000 \
  -v ~/jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins \
  jenkins/jenkins:lts

# Check status
docker logs jenkins | grep "Jenkins initial setup"
```

### 2. Initial Jenkins Setup
```bash
# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Access Jenkins
open http://localhost:8080

# Follow setup:
# 1. Paste initial password
# 2. Install suggested plugins
# 3. Create first admin user
# 4. Configure Jenkins URL (http://localhost:8080)
```

### 3. Install Required Plugins
```bash
# Go to Manage Jenkins → Manage Plugins → Available
# Search and install:
# - Docker Pipeline
# - Slack Notification
# - GitHub Integration
# - Blue Ocean
# - Pipeline
# - Timestamper

# Or use Jenkins CLI (after setup):
docker exec jenkins jenkins-cli install-plugin docker-pipeline github slack-plugin blueocean pipeline timestamper
```

### 4. Add Credentials
```bash
# In Jenkins UI: Manage Jenkins → Manage Credentials

# 1. GitHub Token
# Kind: Username with password
# Username: your-github-username
# Password: your-github-token
# ID: github-credentials

# 2. Docker Credentials (if using registry)
# Kind: Username with password
# Username: your-registry-user
# Password: your-registry-password
# ID: docker-credentials

# 3. Slack Webhook
# Kind: Secret text
# Secret: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
# ID: slack-webhook-url
```

### 5. Create Pipeline Job
```bash
# In Jenkins UI:
# 1. New Item → Pipeline
# 2. Name: "resume-builder-test"
# 3. Build Triggers: None (we'll manually trigger)
# 4. Pipeline:
#    - Definition: Pipeline script
#    - Copy content from Jenkinsfile.production
# 5. Save
```

### 6. Test Manual Trigger
```bash
# Click "Build Now" in Jenkins UI
# Or use CLI:
docker exec jenkins jenkins-cli build resume-builder-test

# Monitor build in Jenkins UI
# Blue Ocean view provides better visualization
# Access at: http://localhost:8080/blue/organizations/jenkins/resume-builder-test/
```

### 7. Check Build Results
```bash
# View build logs
docker exec jenkins cat /var/jenkins_home/jobs/resume-builder-test/builds/1/log

# Or in Jenkins UI: Build → Console Output
```

### 8. Validate Pipeline Stages

Expected successful output:
```
✓ Checkout
✓ Install Dependencies
✓ Code Quality Checks (Type Check, Lint, Security Audit)
✓ Run Tests
✓ Code Coverage
✓ Build Docker Image
✓ Deploy (creates container)
✓ Health Check (passes)
✓ Cleanup
✓ Success Notification
```

---

## Phase 5: Full Integration Testing

### 1. Create Test Branch
```bash
# Create feature branch
git checkout -b test/ci-cd-automation

# Make a small change (add comment or test)
echo "# Test CI/CD" >> types.ts

# Commit and push
git add .
git commit -m "test: validate CI/CD pipeline"
git push origin test/ci-cd-automation
```

### 2. Configure GitHub Webhook (for Jenkins)
```bash
# In GitHub: Repository → Settings → Webhooks → Add webhook
# Payload URL: http://your-jenkins-url/github-webhook/
# Content type: application/json
# Events: Push events
# Active: ✓

# Or test webhook manually:
curl -X POST http://localhost:8080/github-webhook/ \
  -H 'Content-Type: application/json' \
  -d '{"action":"opened"}'
```

### 3. Watch Pipeline Trigger
```bash
# Jenkins should automatically start build when push is detected
# Monitor in: http://localhost:8080/blue/organizations/jenkins/resume-builder-test/

# Or check Jenkins logs
docker logs jenkins | tail -20
```

### 4. Verify All Stages
```bash
# ✓ Code checkout
# ✓ Dependencies installed
# ✓ Type checking passed
# ✓ Linting passed
# ✓ Tests passed
# ✓ Coverage generated
# ✓ Security audit passed
# ✓ Docker built
# ✓ Container deployed
# ✓ Health check passed
# ✓ Notifications sent
```

---

## Phase 6: Security Scanning Testing

### 1. Test SAST Scanning (Semgrep)
```bash
# Install Semgrep
pip install semgrep

# Run security audit
semgrep --config=p/security-audit
semgrep --config=p/owasp-top-ten
semgrep --config=p/react

# Generate report
semgrep --config=p/security-audit --json > semgrep-report.json
cat semgrep-report.json
```

### 2. Test npm Audit
```bash
# Run audit
npm audit

# Generate JSON report
npm audit --json > npm-audit-report.json

# Check for vulnerabilities
npm audit --audit-level=moderate
# Expected exit code 0 (no moderate+ vulnerabilities)
```

### 3. Test Trivy Image Scanning
```bash
# Build image
docker build -t resume-builder:scan-test .

# Scan with Trivy
trivy image resume-builder:scan-test

# Scan for specific severities
trivy image --severity HIGH,CRITICAL resume-builder:scan-test

# Generate JSON report
trivy image --format json --output trivy-report.json resume-builder:scan-test
```

---

## Phase 7: Slack Notifications Testing

### 1. Get Slack Webhook
```bash
# Go to: https://api.slack.com/messaging/webhooks
# Create new webhook for your workspace/channel
# Copy webhook URL
```

### 2. Test Webhook Manually
```bash
# Send test message
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test from Resume Builder CI/CD"}' \
  YOUR_WEBHOOK_URL

# Expected: Message appears in Slack channel
```

### 3. Configure in Jenkins
```bash
# Add slack-webhook-url credential (see Phase 4, step 4)
# Update Jenkinsfile.production with your webhook
# Or set as environment variable
```

### 4. Test Pipeline Notifications
```bash
# Trigger build
docker exec jenkins jenkins-cli build resume-builder-test

# Monitor build
# Expected: Slack message on success/failure
```

---

## Troubleshooting Common Issues

### Tests Failing
```bash
# View test output
npm run test -- --reporter=verbose

# Check specific test file
npm run test -- types.test.ts

# Update snapshots if needed
npm run test -- --update
```

### Docker Build Failing
```bash
# Check Docker daemon
docker ps

# Rebuild with verbose
docker build -t resume-builder:test . --progress=plain

# Check Dockerfile
cat Dockerfile
```

### Jenkins Not Finding Code
```bash
# Verify Jenkins can access files
docker exec jenkins ls -la /var/jenkins_home/workspace/

# Check Git configuration
docker exec jenkins cat /var/jenkins_home/config.xml | grep git
```

### Health Check Failing
```bash
# Check container logs
docker logs resume-builder-test

# Test endpoint manually
curl -v http://localhost:80/

# Check port binding
docker port resume-builder-test
```

### Monitoring Stack Issues
```bash
# Check all services
docker-compose -f docker-compose.monitoring.yml ps

# View logs of failing service
docker-compose -f docker-compose.monitoring.yml logs prometheus

# Verify prometheus config
docker exec <prometheus-container> cat /etc/prometheus/prometheus.yml
```

---

## Cleanup Commands

```bash
# Clean local test builds
npm run build && rm -rf dist

# Stop all Docker containers
docker stop $(docker ps -aq)

# Remove test images
docker rmi resume-builder:test resume-builder:scan-test

# Cleanup Jenkins
docker stop jenkins && docker rm jenkins

# Stop monitoring stack
docker-compose -f docker-compose.monitoring.yml down

# Remove volumes (WARNING: deletes data)
docker volume prune -f
```

---

## Success Checklist

- ✅ npm run test passes
- ✅ npm run lint passes  
- ✅ npm run type-check passes
- ✅ npm run security:audit passes
- ✅ npm run build creates dist/
- ✅ Docker image builds successfully
- ✅ Docker container runs and is healthy
- ✅ Trivy scan completes (no critical vulnerabilities)
- ✅ Prometheus collects metrics
- ✅ Grafana displays dashboards
- ✅ Jenkins pipeline runs successfully
- ✅ All stages complete
- ✅ Slack notifications send
- ✅ Health checks pass

Once all checks pass, your automation is ready for production! 🚀
