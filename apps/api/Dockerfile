# ─── Stage 1: Production dependencies (cacheable) ────────────────────
FROM node:20-alpine AS dependencies
WORKDIR /app
# Keep root workspace package.json so npm resolves @carre-ivoire/* packages via workspaces
COPY package.json package-lock.json ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json
RUN npm install --only=production --legacy-peer-deps

# ─── Stage 2: All dependencies (cacheable) ───────────────────────────
FROM node:20-alpine AS build-deps
WORKDIR /app
# Keep root workspace package.json so npm resolves @carre-ivoire/* packages via workspaces
COPY package.json package-lock.json ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json
RUN npm install --legacy-peer-deps

# ─── Stage 3: Build (cacheable si src inchangé) ──────────────────────
FROM build-deps AS build
# Copy only the API app source into /app
COPY apps/api .
RUN npm run build

# ─── Stage 4: Development (hot reload nodemon) ───────────────────────
FROM build-deps AS development
WORKDIR /app
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY apps/api .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ─── Stage 5: Production (image minimale) ────────────────────────────
FROM node:20-alpine AS production
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
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
