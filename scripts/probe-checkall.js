// Run the same routes as scripts/check-all.js but with an authenticated cookie,
// then count horizontal overflows.

const { chromium } = require('playwright');
const BASE = "http://localhost:3001";

const ROUTES = ['/', '/sign-in', '/items', '/items/sony-wh1000xm5', '/upload', '/settings', '/changelog', '/privacy', '/terms'];
const WIDTHS = [1440, 768, 390];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  // Sign in via the API to seed cookies
  const signIn = await ctx.request.post(`${BASE}/api/auth/sign-in/email`, {
    headers: { 'Content-Type': 'application/json', Origin: BASE },
    data: { email: 'bola@example.com', password: 'keepwise-demo' },
  });
  console.log(`sign-in: ${signIn.status()}`);

  const fail = [];
  for (const route of ROUTES) {
    for (const w of WIDTHS) {
      const c = await browser.newContext({ viewport: { width: w, height: 900 } });
      // Copy cookies from authed context
      await c.addCookies(await ctx.cookies(BASE));
      const page = await c.newPage();
      try {
        const resp = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(300);
        // Probe horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        const status = resp ? resp.status() : 0;
        console.log(`${route} @ ${w}px  status=${status}  overflow=${overflow}`);
        if (overflow) fail.push({ route, w });
      } catch (e) {
        console.log(`${route} @ ${w}px  ERROR ${e.message}`);
        fail.push({ route, w, error: e.message });
      } finally {
        await c.close();
      }
    }
  }
  await browser.close();
  if (fail.length === 0) {
    console.log("All routes clean across all viewports (authenticated).");
  } else {
    console.log("Failures:", fail);
    process.exit(1);
  }
})();
