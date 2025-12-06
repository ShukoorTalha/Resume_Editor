#!/bin/bash
# Fix Snap Docker permissions for Jenkins
# Run this script if you see: "Sorry, home directories outside of /home needs configuration"

echo "🔧 Fixing Snap Docker permissions for Jenkins..."

# Check if Docker is installed via Snap
if snap list | grep -q docker; then
    echo "✓ Snap Docker detected"
    
    # Option 1: Give Jenkins user access to snap docker
    echo "Setting up snap docker permissions..."
    sudo snap connect docker:home :home
    
    # Option 2: Add Jenkins to docker group (if not already)
    if ! groups jenkins | grep -q docker; then
        echo "Adding jenkins user to docker group..."
        sudo usermod -aG docker jenkins
    fi
    
    # Restart Jenkins
    echo "Restarting Jenkins service..."
    sudo systemctl restart jenkins
    
    echo ""
    echo "✅ Done! Snap Docker should now work with Jenkins."
    echo "If issues persist, consider installing Docker via apt instead:"
    echo ""
    echo "  sudo snap remove docker"
    echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "  sudo sh get-docker.sh"
    echo "  sudo usermod -aG docker jenkins"
    echo "  sudo systemctl restart jenkins"
    
else
    echo "ℹ️  Docker is not installed via Snap."
    echo "Checking regular Docker installation..."
    
    if command -v docker &> /dev/null; then
        echo "✓ Docker found: $(docker --version)"
        
        # Add Jenkins to docker group if needed
        if ! groups jenkins | grep -q docker; then
            echo "Adding jenkins user to docker group..."
            sudo usermod -aG docker jenkins
            sudo systemctl restart jenkins
            echo "✅ Jenkins added to docker group. Restart Jenkins to apply."
        else
            echo "✅ Jenkins is already in docker group."
        fi
    else
        echo "❌ Docker not found. Please install Docker first:"
        echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
        echo "  sudo sh get-docker.sh"
    fi
fi

echo ""
echo "📝 Test with: sudo -u jenkins docker ps"
