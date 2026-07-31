// scripts/seed-admin.mjs
// Bootstrap: create tables (SQLite) + seed admin user. No Prisma CLI needed.
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

// Resolve DB path from DATABASE_URL env or fallback
const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const filePart = url.replace(/^file:/, '');
const dbPath = path.isAbsolute(filePart)
  ? filePart
  : path.resolve(process.cwd(), filePart);

const db = new Database(dbPath);

const SCHEMA = `
CREATE TABLE IF NOT EXISTS "CompanyProfile" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'profile',
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "commercialReg" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankIBAN" TEXT NOT NULL,
    "bankSwift" TEXT NOT NULL,
    "logoUrl" TEXT,
    "signatureUrl" TEXT,
    "primaryColor" TEXT NOT NULL,
    "templateTheme" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "taxNumber" TEXT,
    "currency" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "profileData" TEXT NOT NULL,
    "itemsData" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "taxPercentage" REAL NOT NULL,
    "taxAmount" REAL NOT NULL,
    "discountPercentage" REAL NOT NULL,
    "discountAmount" REAL NOT NULL,
    "totalAmount" REAL NOT NULL,
    "paidAmount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "qrCodeData" TEXT,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_number_key" ON "Invoice"("number");
CREATE TABLE IF NOT EXISTS "PaymentReminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "daysOverdue" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "generatedText" TEXT NOT NULL,
    "lastSentAt" TEXT
);
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
`;

db.exec(SCHEMA);
console.log('✅ Tables ensured.');

const EMAIL = 'info@zakariaelahbabi.com';
const PASSWORD = 'Zz@0634408525';

const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(EMAIL);
if (!existing) {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  db.prepare(
    'INSERT INTO User (id, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)'
  ).run(id, EMAIL, passwordHash, 'admin', createdAt);
  console.log('✅ Admin created:', EMAIL);
} else {
  console.log('Admin already exists, skipping.');
}

db.close();
