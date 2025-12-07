# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine as runner

WORKDIR /app

# Install runtime deps (ensure curl/wget/nc are available for health checks)
RUN apk add --no-cache curl wget netcat-openbsd

# Install global http-server so the container can serve static files
RUN npm install -g http-server

COPY --from=builder /app/dist ./dist

EXPOSE 80

# Clear any inherited ENTRYPOINT (node base image may set one) so http-server runs directly
ENTRYPOINT []

CMD ["http-server", "dist", "-p", "80"]
