#!/bin/bash
# Lighthouse performance + accessibility for every page, mobile preset. Needs Node (npx) and Chrome.
cd "$(dirname "$0")/.." || exit 1
mkdir -p tools/lh
/usr/bin/python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 &
PID=$!
sleep 1
status=0
for p in index mentoring consulting telesalud; do
  npx --yes lighthouse "http://127.0.0.1:8765/$p.html" --only-categories=performance,accessibility \
    --quiet --chrome-flags="--headless=new" --output=json --output-path="tools/lh/$p.json" >/dev/null 2>&1
  /usr/bin/python3 - "$p" <<'PY' || status=1
import json, sys
p = sys.argv[1]
d = json.load(open(f"tools/lh/{p}.json"))
perf = round(d["categories"]["performance"]["score"] * 100)
a11y = round(d["categories"]["accessibility"]["score"] * 100)
print(f"{p:11s} performance {perf:3d}  accessibility {a11y:3d}")
sys.exit(0 if perf >= 95 and a11y >= 95 else 1)
PY
done
kill $PID
[ $status -eq 0 ] && echo "LIGHTHOUSE OK" || echo "LIGHTHOUSE BELOW 95 — fix and rerun"
exit $status
