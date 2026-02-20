# Security Scanning Configuration

## SonarQube Configuration (sonar-project.properties)
sonar.projectKey=resume-builder
sonar.projectName=Resume Builder
sonar.projectVersion=1.0.0
sonar.sources=components,context,hooks,services
sonar.tests=.
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.exclusions=node_modules/**,dist/**,coverage/**
sonar.javascript.lcov.reportPaths=coverage/lcov.info

## Coverage requirements
sonar.qualitygate.wait=true
sonar.qualitygate.timeout=300

## Analysis scope
sonar.javascript.node.maxspace=4096

---

## OWASP Dependency Check (dependency-check configuration)

The Jenkins pipeline includes OWASP Dependency-Check scanning to identify known vulnerable components.

Run locally:
```bash
# Install dependency-check
brew install dependency-check

# Run scan
dependency-check --project "Resume Builder" --scan . --format JSON --out ./dependency-check-report.json

# View HTML report
dependency-check --project "Resume Builder" --scan . --format HTML --out ./
```

## npm Audit Configuration

The pipeline runs `npm audit` with the following settings:
- Audit level: moderate (blocks deployment on moderate+ vulnerabilities)
- Automatic remediation: attempted for dev dependencies
- Registry: npm official registry

Commands:
```bash
# Audit only
npm audit --audit-level=moderate

# Generate report
npm audit --json > npm-audit-report.json

# Attempt auto-fix
npm audit fix

# Fix only dev dependencies
npm audit fix --only=dev
```

## SAST with Semgrep

Lightweight static application security testing using Semgrep:

```bash
# Install
pip install semgrep

# Run security audit rules
semgrep --config=p/security-audit

# Custom rules for React/TypeScript
semgrep --config=p/owasp-top-ten
semgrep --config=p/react

# Generate JSON report
semgrep --config=p/security-audit --json > semgrep-report.json
```

## Docker Image Scanning with Trivy

Vulnerability scanning for Docker images:

```bash
# Install Trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Scan image
trivy image resume-builder:latest

# Generate JSON report
trivy image --format json --output trivy-report.json resume-builder:latest

# Scan for specific severity levels
trivy image --severity HIGH,CRITICAL resume-builder:latest

# Fail on vulnerabilities
trivy image --exit-code 1 --severity CRITICAL resume-builder:latest
```

## Security Best Practices

1. **Keep Dependencies Updated**: Run `npm update` regularly
2. **Review Vulnerabilities**: Check `npm audit` reports before merging
3. **Use Package Lock**: Commit `package-lock.json` to ensure consistent installs
4. **Scan Images**: Always scan Docker images before production deployment
5. **Monitor CVEs**: Subscribe to GitHub Dependabot alerts
6. **Code Review**: Review third-party dependencies before installation

## CI/CD Integration

All security scans are automated in the Jenkins pipeline:
1. `npm audit` runs on every build
2. Semgrep SAST runs on staging and production deployments
3. Trivy container scanning runs before pushing to registry
4. Code coverage must meet minimum thresholds (70%)
5. TypeScript type checking must pass
6. ESLint must pass (warnings allowed, errors block)
7. Deployment is blocked on critical vulnerabilities

## Handling Vulnerabilities

### Low Priority
- Plan fix in next sprint
- May proceed with caution

### Medium Priority
- Must fix before production deployment
- Can proceed to staging with documentation

### High Priority
- Blocks deployment
- Requires immediate fix or documented exception

### Critical Priority
- Blocks pipeline immediately
- Requires emergency fix or security team approval

## Security Scanning Reports

All reports are archived and available in Jenkins:
- `npm-audit-report.json` - NPM dependency vulnerabilities
- `semgrep-results.json` - SAST findings
- `trivy-report.json` - Container vulnerabilities
- `coverage/` - Code coverage report
- `test-results.json` - Test execution results
