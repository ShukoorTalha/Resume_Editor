# Resume Builder Deployment Guide

This guide covers deploying the Resume Builder application to a production environment with Docker and Nginx.

## Prerequisites

- Docker and Docker Compose installed
- Nginx installed on the host system
- Linux-based OS (Ubuntu/Debian recommended)
- Port 80 available for HTTP traffic

## Quick Start

### 1. Clone and Navigate to Project

```bash
git clone https://github.com/ShukoorTalha/Resume_Editor.git
cd Resume_Editor
```

### 2. Start Docker Container

```bash
docker-compose up -d
```

This will:
- Build the Docker image
- Start the container on port 8080
- Make the app accessible at `http://localhost:8080`

### 3. Setup Nginx Reverse Proxy

Run the provided setup script:

```bash
chmod +x scripts/setup-nginx.sh
sudo ./scripts/setup-nginx.sh
```

This will:
- Create an Nginx configuration file
- Set up a reverse proxy pointing to the Docker container
- Enable the site and restart Nginx
- Make the app accessible at `http://localhost` (port 80)

## Manual Nginx Setup

If you prefer manual setup instead of using the script:

```bash
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

# Enable the site
sudo rm /etc/nginx/sites-enabled/default || true
sudo ln -s /etc/nginx/sites-available/resume.conf /etc/nginx/sites-enabled/resume.conf

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

## Accessing the Application

After setup, access the Resume Builder at:

- **Via Nginx:** `http://localhost` or `http://your-server-ip`
- **Direct Docker:** `http://localhost:8080` or `http://your-server-ip:8080`

## Stopping the Application

To stop the Docker container:

```bash
docker-compose down
```

## Restarting Services

### Restart Docker container:
```bash
docker-compose restart
```

### Restart Nginx:
```bash
sudo systemctl restart nginx
```

## Troubleshooting

### Container not starting
```bash
docker-compose logs app
```

### Nginx errors
```bash
sudo nginx -t  # Test configuration
sudo systemctl status nginx  # Check service status
```

### Port already in use
- Port 80 (Nginx): Change the port in nginx config
- Port 8080 (Docker): Change the port in `docker-compose.yml`

## SSL/HTTPS Setup

For production, configure SSL certificates with Let's Encrypt:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Update the Nginx config to redirect HTTP to HTTPS:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Environment Variables

No environment variables required for basic setup. All data is stored locally in the browser (localStorage).

## Monitoring

### Check container status
```bash
docker ps
```

### View application logs
```bash
docker-compose logs -f app
```

### Monitor Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Performance Tips

1. **Cache static files** - Nginx can serve the built assets with caching headers
2. **Enable gzip compression** - Add to Nginx config for smaller responses
3. **Use CDN** - Serve static assets through a CDN for faster global access

## Backup and Recovery

### Backup application data
Since the app uses browser localStorage, no server-side data backup is needed. Users' data is stored in their browser.

### Docker image backup
```bash
docker save resume_editor-app:latest -o resume-builder.tar
```

## Support

For issues or questions, refer to:
- Main README: `../README.md`
- GitHub Issues: https://github.com/ShukoorTalha/Resume_Editor/issues
