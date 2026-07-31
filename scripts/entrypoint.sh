#!/bin/sh
# Diagnostic entrypoint - tests native modules then keeps alive
echo "ENTRYPOINT START $(date)"
node --version
node -e "const D=require('better-sqlite3'); console.log('sqlite test:', JSON.stringify(new D(':memory:').prepare('SELECT 1 AS x').get()))"
echo "ENTRYPOINT DONE - keeping alive"
sleep infinity
