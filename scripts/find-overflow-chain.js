// Walk parent chain of the leftmost overflowing element on the page
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const url = process.argv[2] || 'http://localhost:3001/settings';
  const width = parseInt(process.argv[3] || '390', 10);
  const ctx = await browser.newContext({ viewport: { width, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);
  const result = await page.evaluate(() => {
    const winW = window.innerWidth;
    const all = Array.from(document.querySelectorAll('*'));
    const overflows = all
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.right > winW + 1);
    if (!overflows.length) return { ok: true };
    // take leftmost (smallest right) – closest to the overflow
    overflows.sort((a, b) => a.r.right - b.r.right);
    const target = overflows[0].el;
    const chain = [];
    let cur = target;
    while (cur && cur !== document.body) {
      const r = cur.getBoundingClientRect();
      const cs = getComputedStyle(cur);
      chain.push({
        tag: cur.tagName,
        cls: (cur.className || '').toString().slice(0, 100),
        right: Math.round(r.right),
        width: Math.round(r.width),
        display: cs.display,
        minW: cs.minWidth,
        whiteSpace: cs.whiteSpace,
        text: (cur.textContent || '').trim().slice(0, 60),
      });
      cur = cur.parentElement;
    }
    return { ok: false, winW, targetText: target.textContent?.trim().slice(0, 80), chain };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });