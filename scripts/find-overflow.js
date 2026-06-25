// Find what's overflowing on a given URL+viewport.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const url = process.argv[2] || 'http://localhost:3001/settings';
  const width = parseInt(process.argv[3] || '390', 10);
  const ctx = await browser.newContext({ viewport: { width, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);
  const result = await page.evaluate(() => {
    const winW = window.innerWidth;
    const overflows = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > winW + 1) {
        overflows.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 100),
          right: Math.round(r.right),
          width: Math.round(r.width),
          text: (el.textContent || '').trim().slice(0, 50),
        });
      }
    });
    return { winW, overflows };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });