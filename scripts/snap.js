// One-off snapshot — used during debugging layout issues.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const url = process.argv[2] || 'http://localhost:3001/settings';
  const out = process.argv[3] || 'C:/Users/USER/Desktop/keepwise/screenshots/debug.png';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: out, fullPage: true });
  console.log('saved', out);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });