// Quick visual check: load the landing page at desktop and mobile widths, save PNGs.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const url = process.argv[2] || 'http://localhost:3001/';
  const out = process.argv[3] || 'C:/Users/USER/Desktop/keepwise/screenshots';

  const widths = [
    { w: 1440, h: 900, name: 'desktop' },
    { w: 768, h: 1024, name: 'tablet' },
    { w: 390, h: 844, name: 'mobile' },
  ];

  const fs = require('fs');
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

  for (const { w, h, name } of widths) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // Give fonts a beat to settle.
    await page.waitForTimeout(800);
    const file = `${out}/${name}-fullpage.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Saved ${file}`);
    await ctx.close();
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});