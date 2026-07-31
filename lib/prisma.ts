import { PrismaClient } from '../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

// DATABASE_URL = "file:/data/prod.db" (production) or "file:./dev.db" (dev)
function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db';
  const filePart = url.replace(/^file:/, '');
  return path.isAbsolute(filePart) ? filePart : path.resolve(process.cwd(), filePart);
}

function createPrisma() {
  const adapter = new PrismaLibSql({ url: 'file:' + resolveDbPath() });
  return new PrismaClient({ adapter });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
