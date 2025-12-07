# Quick Fix: Docker Not Found in Jenkins Container

## Problem
Error: `docker: not found` when Jenkins tries to build Docker images.

**Root Cause**: Jenkins is running inside a Docker container (`/var/jenkins_home/` path), but Docker CLI is not installed inside that container.

## Quick Solutions

### Solution 1: Install Docker CLI in Running Jenkins Container (Fastest)

```bash
# Find your Jenkins container name
docker ps | grep jenkins

# Install Docker CLI
docker exec -u root <your-jenkins-container-name> bash -c "
    apt-get update && \
    apt-get install -y docker.io && \
    docker --version
"

# Verify it works
docker exec <your-jenkins-container-name> docker ps
```

### Solution 2: Use Automated Setup Script

```bash
# If Jenkins container is named 'jenkins-controller'
chmod +x scripts/setup-jenkins-docker.sh
./scripts/setup-jenkins-docker.sh
```

### Solution 3: Recreate Jenkins with Docker Socket (Recommended)

**Stop existing Jenkins:**
```bash
docker stop <your-jenkins-container-name>
docker rm <your-jenkins-container-name>
```

**Start with Docker socket mounted:**
```bash
docker run -d \
  --name jenkins-controller \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --user root \
  jenkins/jenkins:lts

# Install Docker CLI
docker exec -u root jenkins-controller bash -c "
    apt-get update && apt-get install -y docker.io
"
```

**Or use docker-compose:**
```bash
docker-compose -f docker-compose.jenkins.yml up -d
bash scripts/setup-jenkins-docker.sh
```

## Verify Setup

```bash
# Test Docker access from Jenkins
docker exec jenkins-controller docker ps

# Should show list of containers (including Jenkins itself)
```

## After Fix

1. Go to Jenkins: `http://localhost:8080`
2. Click **"Build Now"** on your pipeline
3. Pipeline should now successfully build Docker images

## Troubleshooting

### Permission Denied Error

If you see: `permission denied while trying to connect to the Docker daemon socket`

**Fix:**
```bash
docker exec -u root jenkins-controller chmod 666 /var/run/docker.sock
```

### Docker Socket Not Mounted

If `/var/run/docker.sock` doesn't exist in container:

**Fix:** Recreate container with `-v /var/run/docker.sock:/var/run/docker.sock`

### Still Not Working?

Check Docker socket permissions on host:
```bash
# On host machine
ls -l /var/run/docker.sock
# Should show: srw-rw---- 1 root docker

# If needed, fix permissions
sudo chmod 666 /var/run/docker.sock
```

## Security Note

Running Jenkins as `root` and mounting Docker socket gives Jenkins **full access** to your Docker daemon. This is fine for development but consider using:
- Jenkins agents for production
- Docker-in-Docker (DinD) for isolation
- Kubernetes for enterprise setups

## Alternative: Use Host Docker

Instead of Docker-in-Docker, run Jenkins on the **host** (not in container):

```bash
# Install Jenkins on host
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins

# Jenkins will use host's Docker
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

Then follow the original `JENKINS_SETUP.md` guide.

---

**Choose the solution that best fits your setup!**
