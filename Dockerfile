FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache python3 make g++ \
  && npm install -g npm

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public 2>/dev/null || true
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Data directory for persistent SQLite DB
RUN mkdir -p /data

ENV NODE_ENV=production
ENV DATABASE_URL=file:/data/prod.db
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Migrate + seed on startup, then launch
CMD npx prisma migrate deploy && node scripts/seed-admin.mjs; node server.js
