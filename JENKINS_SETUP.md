# Jenkins CI/CD Setup Guide

This guide will help you set up automated deployment for the Resume Builder using Jenkins.

## Prerequisites

- Jenkins server installed and running
- Docker installed on Jenkins server
- Git configured on Jenkins server
- Jenkins plugins installed:
  - Docker Pipeline
  - Git Plugin
  - Pipeline Plugin
  - Credentials Binding Plugin

## Quick Setup

### 1. Install Required Jenkins Plugins

Go to **Manage Jenkins** → **Manage Plugins** → **Available** and install:

- Docker Pipeline
- Docker Commons Plugin
- Git Plugin
- Pipeline Plugin
- GitHub Plugin (if using GitHub)

### 2. Configure Docker on Jenkins

Make sure Jenkins user has Docker permissions:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### 3. Create Jenkins Pipeline Job

1. Go to **Jenkins Dashboard** → **New Item**
2. Enter job name: `Resume-Builder-Pipeline`
3. Select **Pipeline** → Click **OK**

### 4. Configure Pipeline

In the job configuration:

#### General Settings
- ✅ Check **GitHub project** (optional)
- Project url: `https://github.com/ShukoorTalha/Resume_Editor`

#### Build Triggers
Select one or more:

- ✅ **Poll SCM**: `H/5 * * * *` (checks every 5 minutes)
- ✅ **GitHub hook trigger** (recommended - instant deployment)

#### Pipeline Definition
- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: `https://github.com/ShukoorTalha/Resume_Editor.git`
- **Branch**: `*/main`
- **Script Path**: `Jenkinsfile`

### 5. Setup GitHub Webhook (For Instant Deployment)

#### On GitHub:
1. Go to your repository → **Settings** → **Webhooks** → **Add webhook**
2. **Payload URL**: `http://your-jenkins-server:8080/github-webhook/`
3. **Content type**: `application/json`
4. **Events**: Select "Just the push event"
5. Click **Add webhook**

#### On Jenkins:
1. Job Configuration → **Build Triggers**
2. ✅ Check **GitHub hook trigger for GITScm polling**

## Pipeline Configuration

### Environment Variables

Edit the `Jenkinsfile` to customize:

```groovy
environment {
    DOCKER_IMAGE = 'resume-builder'        // Your image name
    CONTAINER_NAME = 'resume-builder'      // Container name
    APP_PORT = '8080'                      // Port to expose
    DOCKER_REGISTRY = ''                   // Leave empty for local, or add registry URL
}
```

### Using Docker Registry (Optional)

If you want to push to Docker Hub, ECR, or another registry:

#### 1. Add Docker Credentials to Jenkins
- Go to **Manage Jenkins** → **Manage Credentials**
- Click **(global)** → **Add Credentials**
- **Kind**: Username with password
- **ID**: `docker-credentials`
- **Username**: Your registry username
- **Password**: Your registry password/token

#### 2. Update Jenkinsfile
```groovy
environment {
    DOCKER_REGISTRY = 'docker.io/yourusername'  // or 'your-ecr-url'
}
```

## Pipeline Stages Explained

The pipeline executes these stages:

1. **Checkout**: Pulls latest code from Git repository
2. **Build Docker Image**: Builds the Docker image with current build number
3. **Run Tests**: Placeholder for future tests
4. **Stop Old Container**: Stops and removes the existing container
5. **Deploy**: Starts new container with updated code
6. **Health Check**: Verifies the app is running correctly
7. **Push to Registry**: (Optional) Pushes image to Docker registry
8. **Cleanup**: Removes old Docker images to save space

## Testing the Pipeline

### Manual Trigger
1. Go to your Jenkins job
2. Click **Build Now**
3. Watch the **Console Output** for progress

### Automatic Trigger (After Webhook Setup)
1. Make any change to your code
2. Push to GitHub: `git push origin main`
3. Jenkins automatically starts building within seconds

## Monitoring

### View Build Status
- Jenkins Dashboard shows build history
- Green ✅ = Success
- Red ❌ = Failed
- Blue 🔵 = In Progress

### View Logs
- Click on build number → **Console Output**
- Shows detailed logs for each stage

### Access Application
After successful deployment:
- **URL**: `http://your-server-ip:8080`
- Check Docker: `docker ps | grep resume-builder`

## Troubleshooting

### Pipeline Fails at Build Stage

**Error**: `permission denied while trying to connect to Docker daemon`

**Fix**:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Pipeline Fails at Health Check

**Error**: `curl: (7) Failed to connect to localhost`

**Fix**: Increase sleep time in Jenkinsfile:
```groovy
sleep(time: 30, unit: 'SECONDS')  // Changed from 10 to 30
```

### Port Already in Use

**Error**: `port is already allocated`

**Fix**: Change `APP_PORT` in Jenkinsfile or stop conflicting container:
```bash
docker stop $(docker ps -q --filter "publish=8080")
```

### GitHub Webhook Not Triggering

**Fixes**:
1. Check webhook URL ends with `/github-webhook/` (with trailing slash)
2. Verify Jenkins is accessible from internet
3. Check GitHub webhook delivery logs
4. Ensure "GitHub hook trigger" is checked in job config

### Build Number Not Incrementing

This is normal - Jenkins auto-increments. If you want to reset:
1. Go to job → **Configure**
2. Advanced Project Options → Set build number

## Advanced Configuration

### Email Notifications

Add to Jenkinsfile `post` block:

```groovy
post {
    success {
        emailext(
            subject: "✅ Resume Builder - Build #${env.BUILD_NUMBER} SUCCESS",
            body: "Application deployed successfully at http://your-server:8080",
            to: "your-email@example.com"
        )
    }
    failure {
        emailext(
            subject: "❌ Resume Builder - Build #${env.BUILD_NUMBER} FAILED",
            body: "Build failed. Check console output: ${env.BUILD_URL}console",
            to: "your-email@example.com"
        )
    }
}
```

### Slack Notifications

Install Slack Notification Plugin, then add:

```groovy
post {
    success {
        slackSend(
            color: 'good',
            message: "✅ Build #${env.BUILD_NUMBER} deployed successfully!"
        )
    }
}
```

### Multi-Branch Pipeline

For feature branches:
1. Create **New Item** → **Multibranch Pipeline**
2. Add Git source
3. Jenkins auto-discovers branches with Jenkinsfile

### Parallel Stages

For faster builds, parallelize independent stages:

```groovy
stage('Parallel Tasks') {
    parallel {
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
```

## Security Best Practices

1. **Never commit credentials** to Jenkinsfile
2. Use Jenkins **Credentials** for sensitive data
3. Enable **CSRF Protection** in Jenkins
4. Use **HTTPS** for Jenkins server
5. Restrict **job permissions** per user
6. Enable **audit logs**
7. Keep Jenkins and plugins **updated**

## Backup & Restore

### Backup Jenkins Configuration
```bash
# Backup Jenkins home directory
sudo tar -czf jenkins-backup-$(date +%Y%m%d).tar.gz /var/lib/jenkins/
```

### Backup Docker Images
```bash
docker save resume-builder:latest | gzip > resume-builder-backup.tar.gz
```

## Rollback Procedure

If deployment fails:

### Manual Rollback
```bash
# Stop current container
docker stop resume-builder

# Start previous version
docker run -d --name resume-builder -p 8080:80 resume-builder:previous-tag
```

### Automated Rollback
The Jenkinsfile includes automatic rollback in the `post failure` block.

## Maintenance

### Clean Old Images Weekly
Add cron job:
```bash
0 2 * * 0 docker image prune -a -f --filter "until=168h"
```

### Monitor Disk Space
```bash
df -h
docker system df
```

### Update Jenkins Plugins Monthly
**Manage Jenkins** → **Manage Plugins** → **Updates**

## Performance Optimization

### Cache Docker Layers
Already implemented in multi-stage Dockerfile

### Parallel Builds
Enable in Jenkins global config: **# of executors**

### Incremental Builds
Use Docker layer caching and npm cache

## CI/CD Flow Diagram

```
Code Push (GitHub)
       ↓
GitHub Webhook Trigger
       ↓
Jenkins Pipeline Start
       ↓
Checkout Code → Build Image → Test → Deploy
       ↓
Health Check
       ↓
✅ Success: App Running
❌ Failure: Rollback
```

## Next Steps

1. ✅ Set up Jenkins server
2. ✅ Configure pipeline job
3. ✅ Add GitHub webhook
4. ✅ Test with manual build
5. ✅ Push code change to verify auto-deployment
6. 📧 Add notifications (optional)
7. 🔒 Configure HTTPS (recommended)
8. 📊 Set up monitoring (optional)

## Support

For issues:
- Check Jenkins console output
- Review Docker logs: `docker logs resume-builder`
- Verify Jenkins has Docker permissions
- Check GitHub webhook delivery status

---

**Happy Automated Deployment! 🚀**
