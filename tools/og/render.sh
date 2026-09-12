#!/bin/bash
# Renders tools/og/og_card.html to assets/og.jpg (1200x630) with headless Chrome.
cd "$(dirname "$0")/../.." || exit 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 \
  --virtual-time-budget=5000 --screenshot="assets/og.png" "file://$PWD/tools/og/og_card.html" >/dev/null 2>&1
sips -s format jpeg -s formatOptions 85 assets/og.png --out assets/og.jpg >/dev/null
rm -f assets/og.png
sips -g pixelWidth -g pixelHeight assets/og.jpg
