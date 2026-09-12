#!/bin/bash
# Lighthouse performance + accessibility for every page, mobile and desktop. Needs Node (npx) and Chrome.
cd "$(dirname "$0")/.." || exit 1
mkdir -p tools/lh
/usr/bin/python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null' EXIT
sleep 1
status=0
for p in index mentoring consulting telesalud; do
  for form in mobile desktop; do
    preset=""
    [ "$form" = desktop ] && preset="--preset=desktop"
    if ! npx --yes lighthouse "http://127.0.0.1:8765/$p.html" --only-categories=performance,accessibility \
      $preset --quiet --chrome-flags="--headless=new" --output=json --output-path="tools/lh/$p-$form.json" >/dev/null 2>&1; then
      echo "$p $form: lighthouse failed to run"; status=1; continue
    fi
    /usr/bin/python3 - "$p" "$form" <<'PY' || status=1
import json, sys
p, form = sys.argv[1], sys.argv[2]
d = json.load(open(f"tools/lh/{p}-{form}.json"))
perf = round(d["categories"]["performance"]["score"] * 100)
a11y = round(d["categories"]["accessibility"]["score"] * 100)
print(f"{p:11s} {form:7s} performance {perf:3d}  accessibility {a11y:3d}")
sys.exit(0 if perf >= 95 and a11y >= 95 else 1)
PY
  done
done
[ $status -eq 0 ] && echo "LIGHTHOUSE OK" || echo "LIGHTHOUSE BELOW 95 — fix and rerun"
exit $status
