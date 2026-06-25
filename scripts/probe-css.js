const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const html = document.documentElement;
    const h1 = document.querySelector('h1');
    return {
      htmlClass: html.className,
      htmlStyle: html.getAttribute('style') || '(none)',
      htmlFontFamily: getComputedStyle(html).fontFamily,
      h1Class: h1?.className || '(no h1)',
      h1FontFamily: h1 ? getComputedStyle(h1).fontFamily : 'no h1',
      bodyFontFamily: getComputedStyle(document.body).fontFamily,
      cssVarDisplay: getComputedStyle(html).getPropertyValue('--font-display'),
      cssVarFraunces: getComputedStyle(html).getPropertyValue('--font-fraunces'),
      cssVarInter: getComputedStyle(html).getPropertyValue('--font-inter'),
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
