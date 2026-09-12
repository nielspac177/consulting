#!/bin/bash
# Renders every page at 375 px and 1280 px wide into tools/shots/ with headless Chrome.
cd "$(dirname "$0")/.." || exit 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p tools/shots
/usr/bin/python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 &
PID=$!
sleep 1
for p in index mentoring consulting telesalud; do
  [ -f "$p.html" ] || continue
  for w in 375 1280; do
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size="$w,2600" \
      --virtual-time-budget=4000 --screenshot="tools/shots/$p-$w.png" \
      "http://127.0.0.1:8765/$p.html" >/dev/null 2>&1
  done
done
kill $PID
ls -la tools/shots
