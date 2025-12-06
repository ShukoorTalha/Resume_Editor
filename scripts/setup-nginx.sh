#!/bin/bash

# Nginx configuration for Resume Builder
# This script sets up nginx as a reverse proxy for the Docker container running on port 8080

set -e

echo "Setting up Nginx reverse proxy for Resume Builder..."

# Create nginx config
sudo tee /etc/nginx/sites-available/resume.conf >/dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

echo "✓ Nginx configuration created at /etc/nginx/sites-available/resume.conf"

# Remove default site
sudo rm /etc/nginx/sites-enabled/default || true
echo "✓ Removed default nginx site"

# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/resume.conf /etc/nginx/sites-enabled/resume.conf
echo "✓ Enabled resume.conf site"

# Test and restart nginx
echo "Testing nginx configuration..."
sudo nginx -t

echo "Restarting nginx..."
sudo systemctl restart nginx

echo "✅ Nginx setup complete!"
echo ""
echo "Resume Builder is now accessible at http://localhost (via nginx reverse proxy)"
echo "Docker container running on: http://127.0.0.1:8080"
