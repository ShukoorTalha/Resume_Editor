# Enterprise CI/CD Pipeline - Complete Implementation Guide

## Overview

This guide provides a comprehensive setup for an enterprise-grade CI/CD pipeline for the Resume Builder application with:
- ✅ Automated testing and code quality checks
- ✅ Multi-stage deployments (dev/staging/production)
- ✅ Security scanning at every stage
- ✅ HTTPS with automatic certificate renewal
- ✅ Comprehensive monitoring and alerting
- ✅ Automated rollback on failures
- ✅ Slack notifications

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Jenkins Setup](#jenkins-setup)
5. [Testing & Code Quality](#testing--code-quality)
6. [Security Implementation](#security-implementation)
7. [Deployment Stages](#deployment-stages)
8. [Monitoring & Alerting](#monitoring--alerting)
9. [HTTPS/SSL Setup](#httpsssl-setup)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

---

## Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/ShukoorTalha/Resume_Editor.git
cd Resume_Editor
```

### 2. Install Dependencies
```bash
npm ci
npm run build
```

### 3. Run Tests Locally
```bash
npm run test
npm run test:coverage
npm run lint
npm run security:audit
```

### 4. Build Docker Image
```bash
docker build -t resume-builder:latest .
```

### 5. Start with Monitoring (Optional)
```bash
docker-compose -f docker-compose.monitoring.yml up -d
# Access Grafana at http://localhost:3000
# Access Prometheus at http://localhost:9090
```

---

## Architecture Overview

```
Developer Push
    ↓
GitHub Webhook
    ↓
Jenkins Pipeline
    ├─ Checkout Code
    ├─ Install Dependencies
    ├─ Type Checking & Linting
    ├─ Security Audit
    ├─ Unit Tests
    ├─ Code Coverage
    ├─ SAST Scanning
    ├─ Build Docker Image
    ├─ Docker Image Scanning
    ├─ Deploy (Dev/Staging/Prod)
    ├─ Health Check
    └─ Archive Reports
    ↓
Docker Registry
    ↓
Nginx + Monitoring
    ├─ Prometheus (Metrics)
    ├─ Grafana (Dashboards)
    ├─ Alertmanager (Alerts)
    └─ Application
```

---

## Prerequisites

### System Requirements
- Ubuntu 20.04 LTS or later
- Docker & Docker Compose
- Git
- 4GB RAM minimum
- 20GB disk space

### Tools to Install
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Jenkins (or use Docker)
docker run -d -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
```

### Required Credentials
- GitHub personal access token
- Docker registry credentials (if using Docker Hub/ECR)
- Slack webhook URL
- SMTP credentials for email alerts (optional)
- PagerDuty service key (optional)

---

## Jenkins Setup

### 1. Install Required Plugins
```groovy
// Manage Jenkins → Plugin Manager
- Docker Pipeline
- Slack Notification
- Email Notification
- Blue Ocean
- Pipeline
- GitHub Integration
- Timestamper
- Log Parser
```

### 2. Configure Credentials
Navigate to `Manage Jenkins → Manage Credentials → System`:

**1. GitHub Token**
```
Kind: Username with password
Username: your-github-username
Password: your-github-token (Settings → Developer settings → Personal access tokens)
ID: github-credentials
```

**2. Docker Registry**
```
Kind: Username with password
Username: your-registry-user
Password: your-registry-password (or personal access token)
ID: docker-credentials
```

**3. Slack Webhook**
```
Kind: Secret text
Secret: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
ID: slack-webhook-url
```

### 3. Create Pipeline Job
```
1. New Item → Pipeline
2. Name: "resume-builder-pipeline"
3. Build Triggers:
   ✓ GitHub hook trigger for GITScm polling
4. Pipeline:
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: https://github.com/ShukoorTalha/Resume_Editor.git
   - Branches to build: main
   - Script Path: Jenkinsfile.production
```

### 4. Configure GitHub Webhook
```
GitHub Repository → Settings → Webhooks → Add webhook
Payload URL: http://jenkins.yourdomain.com/github-webhook/
Content type: application/json
Events: Push events
Active: ✓
```

---

## Testing & Code Quality

### Unit Tests
```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Configuration** (`vitest.config.ts`):
- Framework: Vitest (Vite-native, fast)
- Environment: jsdom (browser simulation)
- Coverage threshold: 70% lines, functions, branches
- Reports: HTML, JSON, LCOV

### Code Linting
```bash
# Check code style
npm run lint

# Automatic fix
npm run lint:fix
```

**ESLint Configuration** (`.eslintrc.json`):
- React best practices
- TypeScript strict mode
- Hooks rules enforcement
- Console warnings (no errors)

### Type Checking
```bash
npm run type-check
```

### Security Audit
```bash
npm run security:audit
```

---

## Security Implementation

### 1. SAST (Static Application Security Testing)

**Semgrep Configuration:**
```bash
# Install
pip install semgrep

# Run
semgrep --config=p/security-audit
semgrep --config=p/owasp-top-ten
semgrep --config=p/react
```

**In Pipeline:**
- Runs on staging and production deployments
- Scans for OWASP Top 10 vulnerabilities
- Generates JSON report for archival

### 2. Dependency Scanning

**npm audit:**
```bash
# In pipeline: npm audit --audit-level=moderate
# Blocks deployment on moderate+ vulnerabilities
```

**Automated fixes:**
```bash
npm audit fix --only=dev
```

### 3. Container Image Scanning

**Trivy Configuration:**
```bash
# Install
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Scan image
trivy image resume-builder:latest
trivy image --severity CRITICAL resume-builder:latest
```

### 4. Security Headers

**Nginx Configuration** (`nginx-security.conf`):
```nginx
# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; ...";

# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN";

# Force HTTPS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";

# Other headers
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

See [SECURITY_SCANNING.md](./SECURITY_SCANNING.md) for detailed security setup.

---

## Deployment Stages

### Stage 1: Development
```
Trigger: Push to develop branch
Environment: http://localhost:8083
Tests: Required ✓
Security Scan: Skipped
Approval: Automatic
Duration: ~5-7 minutes
```

### Stage 2: Staging
```
Trigger: Manual or push to main
Environment: http://localhost:8082
Tests: Required ✓
Security Scan: Full (SAST + Trivy) ✓
Approval: Automatic (on success)
Duration: ~10-12 minutes
```

### Stage 3: Production
```
Trigger: Manual approval
Environment: https://yourdomain.com (port 8081)
Tests: Required ✓
Security Scan: Full ✓
Approval: Manual (Jenkins UI)
Rollback: Automatic on failure
Duration: ~10-12 minutes
```

### Deployment Process

```
1. Code Pushed to GitHub
   ↓
2. Jenkins Detects Webhook
   ↓
3. Checkout Code
   ↓
4. Install Dependencies
   ↓
5. Code Quality (Type Check + Lint)
   ↓
6. Run Tests
   ↓
7. Generate Coverage Report
   ↓
8. Security Audit (npm audit)
   ↓
9. SAST Scanning (Semgrep)
   ↓
10. Build Docker Image
    ↓
11. Scan Image (Trivy)
    ↓
12. Stop Old Container
    ↓
13. Deploy New Container
    ↓
14. Health Check (30 retries, 3s interval)
    ↓
15. Push to Registry (if configured)
    ↓
16. Cleanup Old Images
    ↓
17. Send Slack Notification
    ↓
18. Archive Reports & Logs
```

---

## Monitoring & Alerting

### Setup Monitoring Stack
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

### Access Points
- **Prometheus**: http://localhost:9090 (Metrics database)
- **Grafana**: http://localhost:3000 (Dashboards)
  - Default: admin / admin
  - Change password on first login
- **Alertmanager**: http://localhost:9093 (Alert management)
- **Node Exporter**: http://localhost:9100 (System metrics)
- **cAdvisor**: http://localhost:8080 (Container metrics)

### Alert Rules

**Critical Alerts** (Immediate PagerDuty/Phone):
- Application Down (5+ min)
- Critical Disk Space (<5%)
- Container Restarting Excessively
- SLA Violation (99% uptime)

**Warning Alerts** (Email/Slack):
- High Error Rate (>5% in 5min)
- High Response Time (>1s at p95)
- High Memory Usage (>85%)
- High CPU Usage (>80%)
- Low Disk Space (15%)
- Build Failure

See [docker-compose.monitoring.yml](./docker-compose.monitoring.yml) and [monitoring/alert-rules.yml](./monitoring/alert-rules.yml)

---

## HTTPS/SSL Setup

### Quick Setup with Let's Encrypt
```bash
# 1. Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 2. Get Certificate
sudo certbot certonly --nginx -d yourdomain.com

# 3. Update Nginx config
# See HTTPS_SETUP.md

# 4. Restart Nginx
docker-compose restart nginx

# 5. Verify
curl -I https://yourdomain.com
```

### Automatic Renewal
```bash
# Certbot container in docker-compose.monitoring.yml
# Automatically renews 30 days before expiration
# No manual action needed
```

See [HTTPS_SETUP.md](./HTTPS_SETUP.md) for complete guide.

---

## Troubleshooting

### Jenkins Pipeline Fails

**Problem: Tests Failing**
```
Solution:
1. Check test output in Jenkins console
2. Run locally: npm run test
3. Review coverage: npm run test:coverage
4. Fix failures and push
```

**Problem: Build Timeout**
```
Solution:
1. Check timeout setting in Jenkinsfile.production
2. Increase if needed: timeout(time: 2, unit: 'HOURS')
3. Optimize Docker build if possible
```

**Problem: Docker Push Fails**
```
Solution:
1. Verify credentials in Jenkins: Manage Jenkins → Manage Credentials
2. Check registry URL in environment variables
3. Ensure credentials have write permissions
```

### Monitoring Issues

**Problem: No Data in Prometheus**
```
Solution:
1. Verify Prometheus is running: docker ps
2. Check metrics endpoint: curl http://localhost:9090/metrics
3. Review Prometheus logs: docker logs <container-id>
4. Check prometheus.yml for correct scrape targets
```

**Problem: Slack Alerts Not Sending**
```
Solution:
1. Verify webhook URL in alertmanager.yml
2. Test webhook: curl -X POST -H 'Content-type: application/json' --data '{"text":"test"}' YOUR_WEBHOOK_URL
3. Check alertmanager logs: docker logs <container-id>
4. Ensure alerts are firing: Prometheus → Alerts
```

### Container/App Issues

**Problem: Container Keeps Restarting**
```bash
# Check logs
docker logs resume-builder-prod

# Verify health check
docker inspect --format='{{json .State.Health}}' resume-builder-prod | jq

# Check port conflicts
sudo netstat -tlnp | grep 8081
```

**Problem: High Memory Usage**
```bash
# Check resource limits
docker stats resume-builder-prod

# Adjust in docker-compose (if needed)
# Add: deploy:
#        resources:
#          limits:
#            memory: 512M
```

---

## Best Practices

### 1. Code Quality
- ✅ Always run tests locally before pushing
- ✅ Maintain >70% code coverage
- ✅ Fix linting errors, not warnings
- ✅ Keep commits small and focused

### 2. Git Workflow
```
develop branch → for active development
main branch → for production-ready code
feature/* → for individual features
hotfix/* → for urgent production fixes
```

### 3. Commit Messages
```
Good:  "feat: add mentorship section editing"
       "fix: resolve email validation bug"
       "docs: update deployment guide"

Bad:   "fix stuff"
       "wip"
       "update"
```

### 4. Security
- ✅ Never commit secrets (use environment variables)
- ✅ Run security audit before major releases
- ✅ Keep dependencies updated
- ✅ Review third-party code carefully

### 5. Monitoring
- ✅ Set up meaningful alerts (not alert fatigue)
- ✅ Monitor application-specific metrics
- ✅ Review logs regularly
- ✅ Test alert channels (Slack, email, etc.)

### 6. Deployment
- ✅ Always deploy to staging first
- ✅ Run smoke tests before production
- ✅ Have rollback procedure ready
- ✅ Document deployment changes

### 7. Documentation
- ✅ Keep README up to date
- ✅ Document environment variables
- ✅ Maintain runbook for common issues
- ✅ Record deployment procedures

---

## Performance Optimization

### Build Times
```bash
# Current typical build time: 5-7 minutes
# To optimize:

1. Use Docker BuildKit (faster builds)
   DOCKER_BUILDKIT=1 docker build .

2. Cache dependencies
   npm ci instead of npm install

3. Parallel testing
   npm run test -- --threads=4

4. Shallow clone in Jenkins
   git clone --depth=1
```

### Runtime Performance
```bash
# Enable Gzip compression (nginx)
gzip on;
gzip_min_length 1000;

# Use CDN for static assets
# Implement service worker for caching
# Monitor Core Web Vitals in Grafana
```

---

## Scaling & High Availability

### For Production:
1. **Load Balancing**: Use multiple app containers behind Nginx
2. **Database**: Add persistent storage for Jenkins jobs
3. **Backup**: Backup Jenkins config and Grafana data
4. **Clustering**: Use Docker Swarm or Kubernetes
5. **CDN**: Distribute static assets globally

Example multi-container setup:
```yaml
services:
  app-1:
    image: resume-builder:latest
    networks: [web]
  app-2:
    image: resume-builder:latest
    networks: [web]
  app-3:
    image: resume-builder:latest
    networks: [web]
  nginx:
    # Load balances across app-1, app-2, app-3
```

---

## Support & Resources

- **Jenkins Docs**: https://www.jenkins.io/doc/
- **Docker**: https://docs.docker.com/
- **Prometheus**: https://prometheus.io/docs/
- **Grafana**: https://grafana.com/docs/grafana/
- **Nginx**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/getting-started/

---

## Next Steps

1. ✅ Set up Jenkins with this pipeline
2. ✅ Configure credentials
3. ✅ Test pipeline with develop branch
4. ✅ Set up monitoring stack
5. ✅ Configure HTTPS
6. ✅ Set up Slack notifications
7. ✅ Test all alert channels
8. ✅ Document runbooks for your team
9. ✅ Schedule regular security audits
10. ✅ Review and optimize based on metrics

---

**Version**: 1.0
**Last Updated**: February 2026
**Maintainer**: DevOps Team
