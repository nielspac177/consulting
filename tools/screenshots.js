// Captures every existing page at 375, 640, 768 and 1280 px, in both languages,
// full page, into tools/shots/. Fails (exit 1) if any page scrolls horizontally.
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PAGES = ['index', 'mentoring', 'consulting', 'telesalud'].filter((p) => fs.existsSync(`${p}.html`));
const WIDTHS = [375, 640, 768, 1024, 1280];
const LANGS = ['authored', 'other'];

// A fresh context per capture keeps the language stored in localStorage from leaking
// into the next one.
function newContext(browser) {
  return typeof browser.createBrowserContext === 'function'
    ? browser.createBrowserContext()
    : browser.createIncognitoBrowserContext();
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  try {
    for (const p of PAGES) {
      for (const w of WIDTHS) {
        for (const want of LANGS) {
          const context = await newContext(browser);
          try {
            const page = await context.newPage();
            await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
            await page.goto(`http://127.0.0.1:8765/${p}.html`, { waitUntil: 'networkidle0' });
            await page.evaluate(() => document.fonts.ready);
            if (want === 'other') {
              const before = await page.evaluate(() => document.documentElement.lang);
              await page.click('#lang-btn');
              await page.waitForFunction(
                (prev) => document.documentElement.lang !== prev, {}, before);
            }
            const lang = await page.evaluate(() => document.documentElement.lang);
            await page.addStyleTag({ content: '.rv{transition:none !important}' });
            await page.evaluate(() => document.querySelectorAll('.rv').forEach((el) => el.classList.add('in')));
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            await page.screenshot({ path: `tools/shots/${p}-${w}-${lang}.png`, fullPage: true });
            if (overflow > 0) {
              console.error(`OVERFLOW ${overflow}px: ${p}.html at ${w}px (${lang})`);
              process.exitCode = 1;
            } else {
              console.log(`tools/shots/${p}-${w}-${lang}.png`);
            }
          } finally {
            await context.close();
          }
        }
      }
    }
  } finally {
    await browser.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
