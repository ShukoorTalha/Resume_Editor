# Build stage - compile React app with Node
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - serve with lightweight Nginx and Cloudflare Tunnel
FROM nginx:alpine

ARG TARGETARCH

WORKDIR /usr/share/nginx/html

RUN apk add --no-cache ca-certificates curl tzdata \
  && update-ca-certificates \
  && case "$TARGETARCH" in \
    amd64) CLOUDFLARED_ARCH=amd64 ;; \
    arm64) CLOUDFLARED_ARCH=arm64 ;; \
    *) echo "Unsupported architecture: $TARGETARCH" && exit 1 ;; \
  esac \
  && curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${CLOUDFLARED_ARCH}" -o /usr/local/bin/cloudflared \
  && chmod +x /usr/local/bin/cloudflared

# Copy built app from builder stage
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/index.html || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
