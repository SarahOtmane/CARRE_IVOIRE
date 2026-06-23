# ─── Stage 1: Development (hot reload Vite) ──────────────────────────
FROM node:20-alpine AS development
WORKDIR /app

# Copy root workspace manifests so private workspaces can be resolved
COPY package.json package-lock.json ./
# Copy this app package manifest (placed at /app) so npm sees the app scripts
COPY apps/front-office/package*.json ./
# Copy local packages (workspace packages) to allow resolving local deps at build-time
COPY packages ./packages

# Install at repo root (will resolve workspaces and create node_modules at /app)
RUN npm install --legacy-peer-deps

# Copy front-office source into /app (keeps /app/src expected by volumes)
COPY apps/front-office .
RUN rm -f postcss.config.js

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# ─── Stage 2: Build (réutilise le layer development) ─────────────────
FROM development AS build
ARG VITE_API_URL
ARG FRONTEND_PUBLIC_KEY=pk_test_xxx
RUN VITE_API_URL="$VITE_API_URL" VITE_STRIPE_PUBLISHABLE_KEY="$FRONTEND_PUBLIC_KEY" npm run build

# ─── Stage 3: Production (Nginx static) ──────────────────────────────
FROM nginx:1.25-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
