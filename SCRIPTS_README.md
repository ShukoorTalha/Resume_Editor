# CI/CD Automation Scripts

Three scripts to set up and test the complete automation pipeline:

## 🚀 Option 1: Quick Start (5 minutes)
**Best for:** Experienced users who want to get started immediately

```bash
./quick-start.sh
```

**What it does:**
- ✅ Runs all tests locally
- ✅ Builds Docker image
- ✅ Tests Docker container
- ✅ Starts monitoring stack (Prometheus, Grafana, Alertmanager)
- ✅ Starts Jenkins
- ✅ Shows access URLs

**Output:**
```
✓ Type check passed
✓ Lint passed
✓ Tests passed
✓ Security audit passed
✓ Build successful
✓ Docker image built
✓ Container is healthy
✓ Monitoring stack started
✓ Jenkins started

Access your services:
  • Jenkins: http://localhost:8080
  • Prometheus: http://localhost:9090
  • Grafana: http://localhost:3000
  • Alertmanager: http://localhost:9093
```

---

## 🛠️ Option 2: Full Setup (15 minutes)
**Best for:** New users who need guided setup with explanations

```bash
./setup-full-automation.sh
```

**What it does:**
1. ✅ Checks prerequisites (Node.js, npm, Docker, Git)
2. ✅ Installs dependencies
3. ✅ Runs type checking
4. ✅ Runs linting
5. ✅ Runs unit tests
6. ✅ Generates coverage report
7. ✅ Runs security audit
8. ✅ Builds application
9. ✅ Builds Docker image
10. ✅ Tests Docker container (with health checks)
11. ✅ (Optional) Starts monitoring stack
12. ✅ (Optional) Starts Jenkins with detailed setup instructions
13. ✅ Shows comprehensive summary and next steps

**Features:**
- Interactive prompts for optional components
- Colored output with clear success/failure indicators
- Detailed error messages and troubleshooting
- Complete next steps guidance
- Links to documentation

---

## 🧪 Option 3: Automated Tests Only
**Best for:** Running tests repeatedly during development

```bash
./test-automation.sh
```

**What it does:**
- ✅ Runs all local tests in sequence
- ✅ Builds Docker image
- ✅ Tests Docker container
- ✅ Optional security scanning (if Trivy/Semgrep installed)
- ✅ Shows pass/fail counters
- ✅ Displays summary and next steps

---

## 📋 Quick Comparison

| Script | Time | Complexity | Best For |
|--------|------|-----------|----------|
| `quick-start.sh` | 5 min | Simple | Experienced users, fast setup |
| `setup-full-automation.sh` | 15 min | Interactive | New users, guided setup |
| `test-automation.sh` | 2-3 min | Moderate | Developers, repeated testing |

---

## 🏃 Quickest Path: Single Command

**Start everything with one command:**

```bash
./quick-start.sh
```

That's it! Everything will be running:
- ✅ Tests passed
- ✅ Docker built
- ✅ Services started
- ✅ Access URLs shown

---

## 📚 Recommended Workflow

### First Time Setup
```bash
# Run full setup with guidance
./setup-full-automation.sh

# Follow the on-screen instructions to set up Jenkins
# (You'll need 10-15 minutes to complete initial Jenkins setup)
```

### Daily Development
```bash
# Quick tests before committing
./test-automation.sh

# Or for minimal feedback
npm run test
```

### After Code Changes
```bash
# Test everything is working
./quick-start.sh
```

### Production Deployment
```bash
# Jenkins automatically runs on push to main
# Monitor at: http://localhost:8080/blue/
```

---

## 🛑 Stopping Services

### Stop Jenkins
```bash
docker stop jenkins && docker rm jenkins
```

### Stop Monitoring Stack
```bash
docker-compose -f docker-compose.monitoring.yml down
```

### Stop Everything
```bash
docker stop $(docker ps -aq)
docker-compose -f docker-compose.monitoring.yml down
```

---

## 🔍 Troubleshooting

### Script fails on dependency check
```bash
# Install missing tools
brew install node docker docker-compose git

# Or on Linux
sudo apt-get install nodejs npm docker.io docker-compose git
```

### Port already in use
```bash
# Find what's using the port
lsof -i :8080    # Jenkins
lsof -i :9090    # Prometheus
lsof -i :3000    # Grafana

# Stop conflicting service or use different port
```

### Docker daemon not running
```bash
# Start Docker (macOS)
open -a Docker

# Start Docker (Linux)
sudo systemctl start docker
```

### Tests failing
```bash
# Run with verbose output
npm run test -- --reporter=verbose

# Check for syntax errors
npm run type-check
```

---

## 📖 Documentation

- **[CI_CD_GUIDE.md](./CI_CD_GUIDE.md)** - Complete implementation guide
- **[TESTING_AUTOMATION.md](./TESTING_AUTOMATION.md)** - Detailed testing guide
- **[SECURITY_SCANNING.md](./SECURITY_SCANNING.md)** - Security scanning details
- **[HTTPS_SETUP.md](./HTTPS_SETUP.md)** - HTTPS/SSL configuration
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Quick reference

---

## ✨ Features

All scripts include:
- ✅ Colorized output (success/warning/error indicators)
- ✅ Error handling and early exit on failures
- ✅ Clear progress indicators
- ✅ Service status reporting
- ✅ Access URL display
- ✅ Helpful next steps
- ✅ Cleanup instructions

---

## 🎯 Success Indicators

When running successfully, you'll see:
```
✓ Type check passed
✓ Lint passed
✓ Tests passed
✓ Coverage generated
✓ Security audit passed
✓ Build successful
✓ Docker image built
✓ Container is healthy
✓ Monitoring stack started
✓ Jenkins started

All systems ready!
```

---

## 🚀 What Happens After Running a Script

1. **Code Quality**: All tests pass (type checking, linting, unit tests)
2. **Build**: Production-ready artifacts created
3. **Docker**: Container image built and tested
4. **Services**: Jenkins, Prometheus, Grafana, Alertmanager running
5. **Ready**: Your automation pipeline is fully operational

Next steps:
1. Visit Jenkins: http://localhost:8080
2. Complete initial Jenkins setup
3. Create pipeline job from Jenkinsfile.production
4. Configure GitHub webhook for automatic triggers
5. Set up Slack notifications

---

**Choose your preference and run:**
- **Fast setup?** → `./quick-start.sh`
- **Need guidance?** → `./setup-full-automation.sh`
- **Just testing?** → `./test-automation.sh`

All scripts are production-ready and fully automated! 🎉
