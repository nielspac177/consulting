#!/bin/bash
# Renders every page at 375, 640, 768 and 1280 px wide, in both languages (full page),
# into tools/shots/.
# Uses puppeteer-core (installed into the git-ignored node_modules/ on first run) because
# headless Chrome enforces a 500 px minimum window width and would crop a 375 px capture.
cd "$(dirname "$0")/.." || exit 1
[ -d node_modules/puppeteer-core ] || npm install --no-save --no-package-lock --silent puppeteer-core >/dev/null 2>&1
[ -d node_modules/puppeteer-core ] || { echo "puppeteer-core not available"; exit 1; }
mkdir -p tools/shots
/usr/bin/python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null' EXIT
sleep 1
node tools/screenshots.js
status=$?
ls -la tools/shots
exit $status
