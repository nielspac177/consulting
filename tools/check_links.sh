#!/bin/bash
# Requests every external URL in the HTML and i18n files; fails on any non-2xx/3xx answer.
cd "$(dirname "$0")/.." || exit 1
fail=0
urls=$(grep -hv 'rel="preconnect"' ./*.html i18n.js | grep -oE 'https?://[^"'"'"' <>)]+' | sed 's/[.,]$//' | sort -u)
for u in $urls; do
  code=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 25 -A 'Mozilla/5.0' "$u")
  case "$code" in
    2*|3*) echo "ok  $code $u" ;;
    *) echo "BAD $code $u"; fail=1 ;;
  esac
done
[ $fail -eq 0 ] && echo "LINKS OK"
exit $fail
