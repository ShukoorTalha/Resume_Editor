# 🚀 One-Command CI/CD Automation Setup

## Getting Started in 3 Steps

### 1️⃣ Choose Your Setup Method

#### **Option A: Quick Start (5 minutes)**
Starts the local Docker app immediately:
```bash
./quick-start.sh
```

#### **Option B: Full Setup (15 minutes)**  
Perfect for new users with step-by-step guidance:
```bash
./setup-full-automation.sh
```

#### **Option C: Tests Only (2-3 minutes)**
Perfect for developers who want to test during development:
```bash
./test-automation.sh
```

---

## 📦 What Gets Set Up

### Quick start focuses on the local app:

✅ **Build & Run**
- Builds the Docker image locally
- Starts the app with Docker Compose
- Opens the app on port 8081

### The other scripts still cover the broader automation workflow:

✅ **Code Quality & Testing**
- TypeScript type checking
- ESLint linting
- Unit tests (Vitest)
- Code coverage reports
- Security audit (npm audit)

✅ **Build & Docker**
- Production build (Vite)
- Docker image creation
- Container testing with health checks

✅ **Services** (Optional in some scripts)
- Jenkins CI/CD pipeline orchestrator
- Prometheus metrics collection
- Grafana dashboards
- Alertmanager for alerts

---

## 🎯 Quick Start (Recommended)

The absolute fastest way to get the local app running:

```bash
./quick-start.sh
```

**That's it!** In a couple of minutes you'll have:
- ✅ Local Docker image built
- ✅ App running on port 8081
- ✅ Local access URL displayed

---

## 📊 What Each Script Does

### quick-start.sh
```
Dependencies     → npm ci
Type Checking    → npm run type-check
Linting         → npm run lint  
Tests           → npm run test
Coverage        → npm run test:coverage
Security        → npm run security:audit
Build           → npm run build
Docker Build    → docker build
Docker Test     → curl health checks
Monitoring      → docker-compose up
Jenkins         → docker run jenkins
```

### setup-full-automation.sh
```
Prerequisites   → Check Node, npm, Docker, Git
Dependencies    → npm ci with details
Type Check      → With explanation
Linting         → With explanation
Testing         → With coverage reporting
Security        → With vulnerability info
Build           → With output size
Docker Build    → With verification
Docker Test     → With health checks
Monitoring      → Interactive selection
Jenkins         → Interactive setup with instructions
Summary         → Comprehensive next steps
```

### test-automation.sh
```
Dependencies    → Lightweight check
Type Check      → Pass/fail indicator
Linting         → Pass/fail indicator
Tests           → Pass/fail indicator
Coverage        → Pass/fail indicator
Security        → Pass/fail indicator
Docker Build    → Pass/fail indicator
Docker Test     → Pass/fail indicator
Optional Scans  → Trivy, Semgrep (if installed)
Summary         → Count passed/failed
```

---

## 🔧 After Running a Script

### You'll See Output Like:
```
═══════════════════════════════════════════════════
Resume Builder - Quick Start
═══════════════════════════════════════════════════

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

═══════════════════════════════════════════════════
✓ All systems ready!
═══════════════════════════════════════════════════

Access your services:
  • Jenkins: http://localhost:8080
  • Prometheus: http://localhost:9090
  • Grafana: http://localhost:3000 (admin/admin)
  • Alertmanager: http://localhost:9093

Stop services:
  • Docker: docker stop jenkins && docker rm jenkins
  • Monitoring: docker-compose -f docker-compose.monitoring.yml down
```

---

## 🎮 Common Tasks

### Run Full Setup (First Time)
```bash
./setup-full-automation.sh
```

### Quick Start (Fastest)
```bash
./quick-start.sh
```

### Test Changes
```bash
./test-automation.sh
```

### Just Run Tests
```bash
npm run test
```

### Just Type Check
```bash
npm run type-check
```

### Stop All Services
```bash
docker stop jenkins
docker-compose -f docker-compose.monitoring.yml down
```

### View Jenkins Logs
```bash
docker logs jenkins
```

### View Monitoring Logs
```bash
docker-compose -f docker-compose.monitoring.yml logs -f prometheus
```

---

## 📚 Documentation

All scripts have corresponding documentation:

| Document | Purpose |
|----------|---------|
| **SCRIPTS_README.md** | Guide for all three scripts |
| **TESTING_AUTOMATION.md** | 7-phase testing guide with details |
| **CI_CD_GUIDE.md** | Complete implementation guide (400+ lines) |
| **SECURITY_SCANNING.md** | Security scanning setup |
| **HTTPS_SETUP.md** | HTTPS/SSL configuration |
| **IMPLEMENTATION_SUMMARY.md** | Quick reference |

---

## ✨ Features

All scripts include:
- ✅ **Error Handling**: Stops on first error with clear messages
- ✅ **Colorized Output**: Green for success, red for errors, yellow for warnings
- ✅ **Progress Indicators**: Know exactly what's running
- ✅ **Verification**: Health checks for each component
- ✅ **Service Management**: Start/stop helpers shown
- ✅ **Troubleshooting**: Links to documentation
- ✅ **Access URLs**: All service URLs displayed
- ✅ **Next Steps**: Clear guidance for next actions

---

## 🚦 Usage Decision Tree

```
Are you new to this?
├─ YES → Run ./setup-full-automation.sh
│        (Get full guidance and explanations)
└─ NO → Have you run setup before?
      ├─ YES → Run ./quick-start.sh
      │        (Fast local app start)
        └─ NO → Run ./setup-full-automation.sh
               (Get the full walkthrough)

Need to run tests repeatedly?
└─ YES → Run ./test-automation.sh
         (Just tests, no service startup)
```

---

## ⚙️ System Requirements

Before running any script, ensure you have:

- **Node.js 18+**
  ```bash
  node --version
  ```

- **npm**
  ```bash
  npm --version
  ```

- **Docker**
  ```bash
  docker --version
  ```

- **Docker Compose**
  ```bash
  docker-compose --version
  ```

- **Git**
  ```bash
  git --version
  ```

If any are missing, scripts will tell you which to install.

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -i :8080    # Jenkins
lsof -i :9090    # Prometheus
lsof -i :3000    # Grafana

# Kill the process or stop the service
```

### Docker Daemon Not Running
```bash
# macOS
open -a Docker

# Linux
sudo systemctl start docker
```

### Tests Failing
```bash
# Run with details
npm run test -- --reporter=verbose

# Check for syntax errors
npm run type-check
```

### Jenkins Won't Start
```bash
# Check logs
docker logs jenkins

# Ensure port 8080 is free
lsof -i :8080

# Remove container if stuck
docker rm jenkins
```

---

## 🎯 Success Checklist

After running a script, verify:
- ✅ All tests passed
- ✅ Docker image built successfully
- ✅ Docker container is healthy
- ✅ Can access Jenkins at http://localhost:8080
- ✅ Can access Prometheus at http://localhost:9090
- ✅ Can access Grafana at http://localhost:3000
- ✅ Can access Alertmanager at http://localhost:9093

---

## 📋 Next Steps

After scripts complete:

1. **Set Up Jenkins** (if using setup-full-automation.sh)
   - Open http://localhost:8080
   - Complete initial setup
   - Install plugins
   - Create pipeline job

2. **Configure GitHub Webhook**
   - Go to repo Settings → Webhooks
   - Add: http://your-jenkins-url/github-webhook/
   - Select: Push events

3. **Set Up Slack Notifications** (optional)
   - Create Slack webhook
   - Add to Jenkins credentials
   - Update Jenkinsfile with webhook

4. **Configure HTTPS** (for production)
   - See HTTPS_SETUP.md
   - Use Let's Encrypt + Certbot

5. **Test the Pipeline**
   - Push a test branch
   - Verify Jenkins triggers
   - Check all stages pass

---

## 💡 Pro Tips

### Re-run Scripts
Scripts are idempotent (safe to run multiple times):
```bash
./quick-start.sh  # Safe to run again
```

### Clean Up Between Runs
```bash
# Stop services
docker stop jenkins
docker-compose -f docker-compose.monitoring.yml down

# Clean Docker
docker system prune -f
```

### View Script Source
All scripts are readable and well-commented:
```bash
cat quick-start.sh
cat setup-full-automation.sh
cat test-automation.sh
```

### Integrate with Git Hooks
```bash
# Add to .git/hooks/pre-commit
#!/bin/bash
./test-automation.sh
```

---

## 📞 Support

If you get stuck:

1. **Check the logs**
   ```bash
   docker logs jenkins
   docker-compose -f docker-compose.monitoring.yml logs
   ```

2. **Read documentation**
   - See SCRIPTS_README.md for script details
   - See CI_CD_GUIDE.md for complete guide
   - See TESTING_AUTOMATION.md for testing details

3. **Run setup script again**
   ```bash
   ./setup-full-automation.sh
   # Provides step-by-step guidance
   ```

---

## 🎉 You're All Set!

**To get the local app started right now:**

```bash
./quick-start.sh
```

**Or for guided setup:**

```bash
./setup-full-automation.sh
```

**That's all you need!** Everything else is automated. 🚀
