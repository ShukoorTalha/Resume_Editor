#!/bin/bash
# Setup script for Jenkins with Docker support
# Run this after starting Jenkins container

echo "🔧 Setting up Jenkins with Docker support..."

# Check if Jenkins container is running
if ! docker ps | grep -q jenkins; then
    echo "❌ Jenkins container not found. Please start it first:"
    echo "   docker-compose -f docker-compose.jenkins.yml up -d jenkins"
    exit 1
fi

echo "✓ Jenkins container found"

# Install Docker CLI inside Jenkins container
echo "📦 Installing Docker CLI in Jenkins container..."
docker exec -u root jenkins-controller bash -c "
    apt-get update && \
    apt-get install -y docker.io curl && \
    docker --version
"

# Verify Docker access from Jenkins
echo "🔍 Verifying Docker access..."
docker exec -u root jenkins-controller docker ps > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Docker CLI installed and working!"
else
    echo "⚠️  Docker CLI installed but may need permissions adjustment"
    echo "Attempting to fix permissions..."
    
    # Fix Docker socket permissions
    docker exec -u root jenkins-controller chmod 666 /var/run/docker.sock
    
    # Test again
    docker exec jenkins-controller docker ps > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Docker permissions fixed!"
    else
        echo "❌ Still having issues. Try restarting Jenkins:"
        echo "   docker restart jenkins-controller"
    fi
fi

echo ""
echo "📝 Next steps:"
echo "1. Access Jenkins at: http://localhost:8080"
echo "2. Get initial admin password: docker exec jenkins-controller cat /var/jenkins_home/secrets/initialAdminPassword"
echo "3. Install suggested plugins"
echo "4. Create your first job using the Jenkinsfile"
echo ""
echo "🧪 Test Docker from Jenkins:"
echo "   docker exec jenkins-controller docker ps"
echo ""
echo "✅ Setup complete!"
