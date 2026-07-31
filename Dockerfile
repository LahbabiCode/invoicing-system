FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/* \
  && npm ci

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npx prisma generate
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

# openssl required by Prisma query engine / better-sqlite3
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Persistent volume mount point for SQLite DB
RUN mkdir -p /data

ENV DATABASE_URL=file:/data/prod.db
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# DIAGNOSTIC - test better-sqlite3, keep alive for log capture
CMD node -e "console.log('A node', process.version); const D=require('better-sqlite3'); console.log('B sqlite', JSON.stringify(new D(':memory:').prepare('SELECT 1 AS x').get())); console.log('C OK'); setInterval(()=>{}, 1000)"
