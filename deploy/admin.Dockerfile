# ── Abiyan Telestore – Admin Frontend (React + Vite) ──────────────────────────
# Multi-stage build: build static files → serve with Nginx

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /build

# Copy package files first for better layer caching
COPY admin-frontend/package.json admin-frontend/package-lock.json ./
RUN npm ci

# Copy source and build
COPY admin-frontend/ .

# Build-time environment variable (overridable at build time)
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY deploy/nginx/admin.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
