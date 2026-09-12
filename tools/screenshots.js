// Captures every existing page at 375 and 1280 px viewports, full page, into tools/shots/.
// Fails (exit 1) if any page scrolls horizontally at either width.
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PAGES = ['index', 'mentoring', 'consulting', 'telesalud'].filter((p) => fs.existsSync(`${p}.html`));
const WIDTHS = [375, 1280];

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  try {
    for (const p of PAGES) {
      for (const w of WIDTHS) {
        const page = await browser.newPage();
        await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
        await page.goto(`http://127.0.0.1:8765/${p}.html`, { waitUntil: 'networkidle0' });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => document.querySelectorAll('.rv').forEach((el) => el.classList.add('in')));
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        await page.screenshot({ path: `tools/shots/${p}-${w}.png`, fullPage: true });
        await page.close();
        if (overflow > 0) {
          console.error(`OVERFLOW ${overflow}px: ${p}.html at ${w}px`);
          process.exitCode = 1;
        } else {
          console.log(`tools/shots/${p}-${w}.png`);
        }
      }
    }
  } finally {
    await browser.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
