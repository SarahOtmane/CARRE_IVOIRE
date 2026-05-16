# ─── Stage 1: Production dependencies (cacheable) ────────────────────
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# ─── Stage 2: All dependencies (cacheable) ───────────────────────────
FROM node:20-alpine AS build-deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ─── Stage 3: Build (cacheable si src inchangé) ──────────────────────
FROM build-deps AS build
COPY . .
RUN npm run build

# ─── Stage 4: Development (hot reload nodemon) ───────────────────────
FROM build-deps AS development
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ─── Stage 5: Production (image minimale) ────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main.js"]
