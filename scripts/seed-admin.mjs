// scripts/seed-admin.mjs
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

const EMAIL = 'info@zakariaelahbabi.com';
const PASSWORD = 'Zz@0634408525';

const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(EMAIL);
if (existing) {
  console.log('Admin already exists, skipping.');
  db.close();
  process.exit(0);
}

const passwordHash = await bcrypt.hash(PASSWORD, 12);
const id = crypto.randomUUID();
const createdAt = new Date().toISOString();

db.prepare(
  'INSERT INTO User (id, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)'
).run(id, EMAIL, passwordHash, 'admin', createdAt);

console.log('✅ Admin created:', EMAIL);
db.close();
