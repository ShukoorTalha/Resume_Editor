# Build stage - bundle the app with a standalone esbuild binary
FROM alpine:3.20 AS builder

ARG TARGETARCH

WORKDIR /app

COPY vendor/esbuild/ /opt/esbuild/
COPY . .

RUN set -eux; \
  ARCH="${TARGETARCH:-}"; \
  if [ -z "$ARCH" ]; then \
    case "$(uname -m)" in \
      x86_64|amd64) ARCH=amd64 ;; \
      aarch64|arm64) ARCH=arm64 ;; \
      *) echo "Unsupported architecture: $(uname -m)" && exit 1 ;; \
    esac; \
  fi; \
  case "$ARCH" in \
    amd64) install -m 755 /opt/esbuild/linux-x64/esbuild /usr/local/bin/esbuild ;; \
    arm64) install -m 755 /opt/esbuild/linux-arm64/esbuild /usr/local/bin/esbuild ;; \
    *) echo "Unsupported architecture: $ARCH" && exit 1 ;; \
  esac; \
  esbuild index.tsx \
    --bundle \
    --format=esm \
    --platform=browser \
    --target=es2020 \
    --jsx=transform \
    --external:react \
    --external:react-dom \
    --external:react-dom/client \
    --external:lucide-react \
    --loader:.css=css \
    --outdir=dist \
    --entry-names=index; \
  cp index.html dist/index.html; \
  sed -i '/<script type="module" src="\/index.tsx"><\/script>/i \    <link rel="stylesheet" href="/index.css" />' dist/index.html; \
  sed -i 's|/index.tsx|/index.js|' dist/index.html

# Production stage - serve the compiled app with lightweight Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN apk add --no-cache ca-certificates tzdata \
  && update-ca-certificates

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
