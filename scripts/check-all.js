// Layout health probe — hits every route at 3 viewports and reports
// horizontal overflows, section counts, heading counts, and detected
// font on the H1. Used to catch regressions before screenshotting.

const { chromium } = require('playwright');

const ROUTES = [
  '/',
  '/sign-in',
  '/items',
  '/items/sony-wh1000xm5',
  '/upload',
  '/settings',
  '/changelog',
  '/privacy',
  '/terms',
];

const WIDTHS = [1440, 768, 390];
const BASE = process.argv[2] || 'http://localhost:3001';

(async () => {
  const browser = await chromium.launch();
  const fail = [];
  for (const route of ROUTES) {
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: 900 },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      const url = BASE + route;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(400);
      } catch (e) {
        console.log(`!! ${url} (${w}px) navigation failed: ${e.message}`);
        await ctx.close();
        fail.push({ route, w, reason: e.message });
        continue;
      }
      const metrics = await page.evaluate(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const bodyH = document.body.scrollHeight;
        const sections = document.querySelectorAll('section').length;
        const headings = document.querySelectorAll('h1, h2, h3').length;
        const buttons = document.querySelectorAll('a[href], button').length;
        const overflows = [];
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > window.innerWidth + 1) {
            overflows.push({
              tag: el.tagName,
              cls: (el.className || '').toString().slice(0, 60),
              right: Math.round(r.right),
            });
          }
        });
        const h1 = document.querySelector('h1');
        const h1Font = h1 ? getComputedStyle(h1).fontFamily : 'none';
        return {
          docW,
          winW,
          bodyH,
          hOverflow: docW > winW,
          sections,
          headings,
          buttons,
          overflows: overflows.slice(0, 4),
          h1Font,
        };
      });
      const ok = !metrics.hOverflow && metrics.overflows.length === 0;
      const tag = ok ? '✓' : '✗';
      console.log(`${tag} ${route.padEnd(30)} @ ${String(w).padStart(4)}px  sections=${metrics.sections}  headings=${metrics.headings}  hOverflow=${metrics.hOverflow}  overflows=${metrics.overflows.length}`);
      if (!ok) {
        console.log('   ', JSON.stringify(metrics.overflows, null, 0));
        fail.push({ route, w, metrics });
      }
      await ctx.close();
    }
  }
  await browser.close();
  if (fail.length) {
    console.log(`\n${fail.length} failing route/viewport combination(s).`);
    process.exit(1);
  } else {
    console.log('\nAll routes clean across all viewports.');
  }
})().catch((e) => { console.error(e); process.exit(1); });
