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

COPY --from=builder /app/dist ./dist

EXPOSE 80

CMD ["http-server", "dist", "-p", "80"]
