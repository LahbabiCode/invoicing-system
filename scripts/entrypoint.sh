#!/bin/sh
set -e
echo "=== STARTUP $(date) ==="
echo "Node: $(node --version)"
echo "DB: $DATABASE_URL"

# Bootstrap tables + admin
node scripts/seed-admin.mjs

echo "=== STARTING SERVER ==="
exec node server.js
