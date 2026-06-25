// Compute layout health metrics instead of relying on the image viewer.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const url = process.argv[2] || 'http://localhost:3001/';
  const widths = [1440, 768, 390];

  for (const w of widths) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const bodyH = document.body.scrollHeight;
      const sections = Array.from(document.querySelectorAll('section'));
      const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
      const buttons = Array.from(document.querySelectorAll('a[href], button'));
      // Surface any elements wider than the viewport.
      const overflows = [];
      document.querySelectorAll('*').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > window.innerWidth + 1) {
          overflows.push({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 60),
            right: Math.round(r.right),
            width: Math.round(r.width),
          });
        }
      });
      // Get font detection — is Fraunces actually loaded for the H1?
      const h1 = document.querySelector('h1');
      const h1Font = h1 ? getComputedStyle(h1).fontFamily : 'none';
      return {
        docW,
        winW,
        bodyH,
        hOverflow: docW > winW,
        sections: sections.length,
        headings: headings.map(h => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 80) })),
        buttons: buttons.length,
        overflows: overflows.slice(0, 5),
        h1Font,
      };
    });

    console.log(`\n=== ${w}px ===`);
    console.log(JSON.stringify(metrics, null, 2));
    await ctx.close();
  }

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });