# ─── Stage 1: Production dependencies (cacheable) ────────────────────
FROM node:20-alpine AS dependencies
WORKDIR /app
# Copy root and app manifests + local packages so production dependencies can be resolved
COPY package.json package-lock.json ./
COPY apps/api/package*.json ./
COPY packages ./packages
RUN npm install --only=production --legacy-peer-deps

# ─── Stage 2: All dependencies (cacheable) ───────────────────────────
FROM node:20-alpine AS build-deps
WORKDIR /app
# Copy manifests and local packages to resolve workspaces during build
COPY package.json package-lock.json ./
COPY apps/api/package*.json ./
COPY packages ./packages
RUN npm install --legacy-peer-deps

# ─── Stage 3: Build (cacheable si src inchangé) ──────────────────────
FROM build-deps AS build
# Copy only the API app source into /app
COPY apps/api .
RUN npm run build

# ─── Stage 4: Development (hot reload nodemon) ───────────────────────
FROM build-deps AS development
WORKDIR /app
# Mount or copy app source for development
COPY apps/api .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ─── Stage 5: Production (image minimale) ────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Ensure production package.json is the app manifest
COPY apps/api/package.json ./package.json

RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main.js"]
