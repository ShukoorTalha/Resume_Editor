# HTTPS/SSL and Security Hardening Setup

## Overview
This guide sets up production-grade HTTPS with automatic certificate renewal using Let's Encrypt and Certbot.

## Prerequisites
- Domain name pointing to server
- Ubuntu/Debian Linux
- Docker installed
- Root or sudo access

## Installation Steps

### 1. Install Certbot

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx python3-certbot-dns-cloudflare

# Or for other DNS providers:
# sudo apt-get install python3-certbot-dns-route53
# sudo apt-get install python3-certbot-dns-google
```

### 2. Create Nginx Directories

```bash
sudo mkdir -p /etc/nginx/conf.d
sudo mkdir -p /etc/letsencrypt
sudo mkdir -p /var/www/certbot
```

### 3. Initial Certificate Generation

```bash
# For domain validation via HTTP
sudo certbot certonly --nginx \
    -d yourdomain.com \
    -d www.yourdomain.com \
    --agree-tos \
    --no-eff-email \
    --email admin@yourdomain.com

# Or for DNS validation (wildcard support)
sudo certbot certonly --dns-cloudflare \
    -d yourdomain.com \
    -d *.yourdomain.com \
    --agree-tos \
    --no-eff-email \
    --email admin@yourdomain.com
```

### 4. Update Docker Compose for HTTPS

```yaml
version: '3.8'

services:
  app:
    image: resume-builder:latest
    container_name: resume-builder-prod
    restart: always
    expose:
      - 80
    networks:
      - web
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:latest-alpine
    container_name: resume-builder-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-production.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/www/certbot:/var/www/certbot:ro
      - nginx-cache:/var/cache/nginx
    depends_on:
      - app
    networks:
      - web

  certbot:
    image: certbot/certbot:latest
    container_name: resume-builder-certbot
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt
      - /var/www/certbot:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew --quiet; sleep 12h & wait $${!}; done;'"
    networks:
      - web

volumes:
  nginx-cache:
    driver: local

networks:
  web:
    driver: bridge
```

### 5. Update Nginx Configuration for HTTPS

Create `nginx-production.conf`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Certbot validation
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;
    
    # SSL Best Practices
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # OCSP Stapling (improves SSL validation speed)
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';" always;
    
    # Remove server info
    server_tokens off;
    
    # Logging
    access_log /var/log/nginx/resume-builder-access.log;
    error_log /var/log/nginx/resume-builder-error.log warn;
    
    # Root and index
    root /app/dist;
    index index.html;
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript;
    
    # Static files with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri @fallback;
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        
        if ($request_filename ~* ^.*?\.(html|htm)$) {
            add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0";
        }
    }
    
    location @fallback {
        rewrite ^(.*)$ /index.html break;
    }
    
    # Security: Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Proxy to backend
    location /api/ {
        proxy_pass http://app:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Automatic Certificate Renewal

The Certbot container automatically renews certificates 30 days before expiration.

Check renewal status:
```bash
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew
```

### 7. Verify HTTPS Setup

```bash
# Check SSL/TLS configuration
curl -I https://yourdomain.com

# Test SSL certificate
openssl s_client -connect yourdomain.com:443

# Check certificate details
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -text -noout

# Verify expiration date
sudo certbot certificates
```

### 8. Security Best Practices

✅ **Enable HSTS**: Included in nginx config (`Strict-Transport-Security`)
✅ **Perfect Forward Secrecy**: TLS 1.2 and 1.3 only
✅ **Certificate Transparency**: OCSP stapling enabled
✅ **Automatic Renewal**: Certbot container handles it
✅ **Security Headers**: CSP, X-Frame-Options, and more

### 9. Troubleshooting

**Certificate renewal fails:**
```bash
# Check Certbot logs
docker logs resume-builder-certbot

# Verify DNS records
nslookup yourdomain.com
dig yourdomain.com

# Test domain accessibility
curl http://yourdomain.com/.well-known/acme-challenge/test
```

**SSL certificate error:**
```bash
# Verify certificate exists
ls -la /etc/letsencrypt/live/yourdomain.com/

# Check Nginx configuration
sudo nginx -t

# Restart Nginx
sudo docker-compose restart nginx
```

## Cost
- **Let's Encrypt certificates**: FREE
- **Automatic renewal**: Automated, no cost
- **HTTPS**: Industry standard, no additional cost

## Resources
- [Let's Encrypt](https://letsencrypt.org/)
- [Certbot Documentation](https://certbot.eff.org/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [OWASP HTTPS Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)
