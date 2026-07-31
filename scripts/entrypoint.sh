#!/bin/sh
# Diagnostic entrypoint - pinpoint better-sqlite3 crash stage
echo "ENTRYPOINT START $(date)"
node --version

echo "--- PHASE 1: require only ---"
node -e "console.log('before require'); const D=require('better-sqlite3'); console.log('after require OK')"
echo "--- PHASE 2: db create + query ---"
node -e "const D=require('better-sqlite3'); const db=new D(':memory:'); console.log('db created'); console.log('query:', JSON.stringify(db.prepare('SELECT 1 AS x').get()))"
echo "--- PHASE 3: full app modules ---"
node -e "console.log('loading @prisma/adapter'); const A=require('@prisma/adapter-better-sqlite3'); console.log('adapter OK', Object.keys(A))"
echo "ENTRYPOINT DONE - keeping alive"
sleep infinity
